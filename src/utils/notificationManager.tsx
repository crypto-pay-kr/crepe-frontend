export class NotificationManager {
  private static instance: NotificationManager;
  private registration: ServiceWorkerRegistration | null = null;

  private constructor() {}

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  // 알림 권한 요청
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      return 'denied';
    }

    const permission = await Notification.requestPermission();
    return permission;
  }

  // 서비스 워커 등록
  async registerServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        this.registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully');
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  // 푸시 구독 설정
  async subscribeToPush(): Promise<PushSubscription | null> {
    if (!this.registration) {
      await this.registerServiceWorker();
    }

    if (!this.registration) {
      console.error('Service Worker not registered');
      return null;
    }

    const permission = await this.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return null;
    }

    try {
      // VAPID 키는 서버에서 생성한 키를 사용해야 합니다
      const vapidPublicKey = process.env.REACT_APP_VAPID_PUBLIC_KEY || 'YOUR_VAPID_PUBLIC_KEY';
      
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey)
      });

      // 구독 정보를 서버에 전송
      await this.sendSubscriptionToServer(subscription);
      
      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return null;
    }
  }

  // 로컬 알림 표시
  async showLocalNotification(title: string, options: NotificationOptions = {}): Promise<void> {
    const permission = await this.requestPermission();
    if (permission !== 'granted') {
      return;
    }

    const defaultOptions: NotificationOptions = {
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      tag: 'crepe-notification',
      requireInteraction: true,
      ...options
    };

    if (this.registration) {
      // 서비스 워커를 통한 알림
      await this.registration.showNotification(title, defaultOptions);
    } else {
      // 일반 브라우저 알림
      new Notification(title, defaultOptions);
    }
  }

  // 주문 관련 알림
  async showOrderNotification(orderData: {
    orderId: string;
    type: 'new_order' | 'order_accepted' | 'order_ready' | 'order_cancelled';
    message: string;
    storeName?: string;
  }): Promise<void> {
    const { orderId, type, message, storeName } = orderData;
    
    let title = 'Crepe 주문 알림';
    let body = message;
    let actions: NotificationAction[] = [];

    switch (type) {
      case 'new_order':
        title = '새로운 주문이 접수되었습니다';
        body = `주문번호: ${orderId}`;
        actions = [
          { action: 'accept', title: '수락하기' },
          { action: 'reject', title: '거절하기' }
        ];
        break;
      case 'order_accepted':
        title = '주문이 수락되었습니다';
        body = storeName ? `${storeName}에서 주문을 수락했습니다` : message;
        actions = [
          { action: 'view', title: '확인하기' }
        ];
        break;
      case 'order_ready':
        title = '주문이 준비되었습니다';
        body = storeName ? `${storeName}에서 주문이 완료되었습니다` : message;
        actions = [
          { action: 'view', title: '확인하기' }
        ];
        break;
      case 'order_cancelled':
        title = '주문이 취소되었습니다';
        body = message;
        actions = [
          { action: 'view', title: '확인하기' }
        ];
        break;
    }

    await this.showLocalNotification(title, {
      body,
      tag: `order-${orderId}`,
      data: { orderId, type },
      actions,
      vibrate: [200, 100, 200],
      sound: '/sounds/notification.mp3' // 선택사항
    });
  }

  // 구독 정보를 서버에 전송
  private async sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
    const token = sessionStorage.getItem('accessToken');
    if (!token) return;

    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/push/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(subscription)
      });
    } catch (error) {
      console.error('Failed to send subscription to server:', error);
    }
  }

  // VAPID 키 변환 유틸리티
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    
    return outputArray;
  }

  // 알림 해제
  async unsubscribe(): Promise<void> {
    if (!this.registration) return;

    try {
      const subscription = await this.registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        console.log('Successfully unsubscribed from push notifications');
      }
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
    }
  }
}
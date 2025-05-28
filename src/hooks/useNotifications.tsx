"use client";

import { useState, useEffect, useCallback } from 'react';
import { NotificationManager } from '@/utils/notificationManager';

interface UseNotificationsReturn {
  isSupported: boolean;
  permission: NotificationPermission;
  isSubscribed: boolean;
  requestPermission: () => Promise<NotificationPermission>;
  subscribeToPush: () => Promise<void>;
  unsubscribe: () => Promise<void>;
  showNotification: (title: string, options?: NotificationOptions) => Promise<void>;
  showOrderNotification: (orderData: {
    orderId: string;
    type: 'new_order' | 'order_accepted' | 'order_ready' | 'order_cancelled';
    message: string;
    storeName?: string;
  }) => Promise<void>;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const notificationManager = NotificationManager.getInstance();

  const isSupported = 'Notification' in window && 'serviceWorker' in navigator;

  useEffect(() => {
    if (isSupported) {
      setPermission(Notification.permission);
      
      // 서비스 워커 등록
      notificationManager.registerServiceWorker();
      
      // 기존 구독 상태 확인
      checkSubscriptionStatus();
    }
  }, [isSupported]);

  const checkSubscriptionStatus = useCallback(async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
      } catch (error) {
        console.error('Failed to check subscription status:', error);
      }
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    const result = await notificationManager.requestPermission();
    setPermission(result);
    return result;
  }, [notificationManager]);

  const subscribeToPush = useCallback(async (): Promise<void> => {
    try {
      const subscription = await notificationManager.subscribeToPush();
      setIsSubscribed(!!subscription);
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
    }
  }, [notificationManager]);

  const unsubscribe = useCallback(async (): Promise<void> => {
    try {
      await notificationManager.unsubscribe();
      setIsSubscribed(false);
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
    }
  }, [notificationManager]);

  const showNotification = useCallback(async (
    title: string, 
    options?: NotificationOptions
  ): Promise<void> => {
    await notificationManager.showLocalNotification(title, options);
  }, [notificationManager]);

  const showOrderNotification = useCallback(async (orderData: {
    orderId: string;
    type: 'new_order' | 'order_accepted' | 'order_ready' | 'order_cancelled';
    message: string;
    storeName?: string;
  }): Promise<void> => {
    await notificationManager.showOrderNotification(orderData);
  }, [notificationManager]);

  return {
    isSupported,
    permission,
    isSubscribed,
    requestPermission,
    subscribeToPush,
    unsubscribe,
    showNotification,
    showOrderNotification
  };
};
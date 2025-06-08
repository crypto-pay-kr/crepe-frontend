describe('쇼핑몰 주문 플로우 - API 로그인 방식 + 더미 시세', () => {
  const API_BASE_URL = 'http://localhost:8080';
  const DUMMY_ORDER_ID = 'ORDER-123456';
  const STORE_ID = 3;

  const dummyStoreList = [
    {
      storeId: STORE_ID,
      storeName: '치즈당',
      storeNickname: '치즈당',
      storeType: 'CAFE',
      storeImage: '/dummy-store.jpg',
      coinList: ['XRP', 'SOL', 'USDT'],
      likeCount: 15,
    },
  ];

  const dummyStoreDetail = {
    likeCount: 15,
    storeName: '치즈당',
    storeAddress: '서울시 강남구 테헤란로 123',
    storeImageUrl: '/dummy-store.jpg',
    storeNickname: '치즈당',
    coinList: ['XRP', 'SOL', 'USDT'],
    menuList: [
      { menuId: 1, menuName: '치즈케이크', menuPrice: 8000, menuImage: '/dummy-menu1.jpg' },
    ],
  };

  const dummyVouchers = [
    {
      id: 1,
      productName: '치즈당 전용 바우처',
      balance: 50000,
      expiredDate: '2025-12-31T23:59:59',
      storeType: 'CAFE',
      bankTokenSymbol: 'XRP',
      tokenBalance: 31250,
    },
  ];

  const dummyTickerData = {
    'KRW-XRP': { trade_price: 1600, change: 'RISE', timestamp: Date.now() },
    'KRW-SOL': { trade_price: 190000, change: 'RISE', timestamp: Date.now() },
    'KRW-USDT': { trade_price: 1340, change: 'EVEN', timestamp: Date.now() },
  };

  const dummyOrderDetails = {
    orderId: DUMMY_ORDER_ID,
    totalPrice: 8000,
    orderType: 'STORE',
    orderStatus: 'PAID',
    orderDetails: [
      { menuId: 1, menuName: '치즈케이크', menuPrice: 8000, quantity: 1 },
    ],
  };

  beforeEach(() => {
    cy.request('POST', `${API_BASE_URL}/api/login`, {
      email: Cypress.env('email'),
      password: Cypress.env('password'),
      captchaKey: 'test-bypass',
      captchaValue: 'test-bypass',
    }).then((res) => {
      const { accessToken, refreshToken } = res.body;
      cy.visit('/mall', {
        onBeforeLoad(win) {
          win.sessionStorage.setItem('accessToken', accessToken);
          win.sessionStorage.setItem('refreshToken', refreshToken);
        },
      });
    });

    cy.intercept('GET', '/api/store', dummyStoreList).as('getStoreList');
    cy.intercept('GET', `/api/store/${STORE_ID}`, dummyStoreDetail).as('getStoreDetail');
    cy.intercept('GET', '/api/balance', {
      balance: [
        { currency: 'XRP', balance: 1000 },
        { currency: 'SOL', balance: 100 },
        { currency: 'USDT', balance: 5000 },
      ],
    }).as('getCoinBalance');
    cy.intercept('GET', '/api/orders/available-currency*', ['XRP', 'SOL', 'USDT']).as('getCurrency');
    cy.intercept('GET', '/api/subscribe/vouchers', dummyVouchers).as('getMyVouchers');
    cy.intercept('GET', '/api/orders/cart*', {
      items: [
        { menuId: 1, menuName: '치즈케이크', menuPrice: 8000, quantity: 1, storeId: STORE_ID },
      ],
      totalPrice: 8000,
      totalQuantity: 1,
    }).as('getCart');
    cy.intercept('POST', '/api/orders/create', { orderId: DUMMY_ORDER_ID }).as('createOrder');
    cy.intercept('GET', `/api/orders/${DUMMY_ORDER_ID}`, dummyOrderDetails).as('getOrderDetails');
    cy.intercept('GET', '/api/exchange/info*', (req) => {
      const currency = req.query.currency;
      const tickerKey = `KRW-${currency}`;
      if (tickerKey in dummyTickerData) {
        req.reply(dummyTickerData[tickerKey as keyof typeof dummyTickerData]);
      } else {
        req.reply({});
      }
    }).as('getExchangeInfo');
  });

  it('✅ XRP 결제 전체 플로우 + 결제 완료 페이지 확인', () => {
    cy.wait('@getStoreList');
    cy.contains('치즈당').click();
    cy.wait('@getStoreDetail');

    cy.get('button.bg-\\[\\#5d63db\\]').should('exist').click();
    cy.get('.fixed.bottom-24').click();

    cy.get('button')
      .contains('주문하기')
      .should('be.visible')
      .and('not.be.disabled')
      .click();

    cy.contains('결제수단 선택').should('be.visible').click();
    cy.wait('@getCurrency');
    cy.wait('@getCoinBalance');
    cy.wait('@getMyVouchers');

    cy.contains('XRP').click();
    cy.wait('@getExchangeInfo');

    cy.get('button')
      .contains('주문하기')
      .should('be.visible')
      .and('not.be.disabled')
      .click();

    cy.wait('@createOrder');

    // ✅ 결제 완료 페이지 도달 여부만 확인
    cy.url().should('include', '/mall/store/pay-complete');

    // ✅ 완료 문구로 '주문이 접수되었습니다'가 보이는지 확인
    cy.contains('주문이 접수되었습니다').should('exist');

// ✅ UI 요소 확인
    cy.contains('주문 요청').should('be.visible');
    cy.contains('홈으로 돌아가기').should('be.visible');
  });
});
describe('코인 입금 페이지 테스트 - 더미 데이터로', () => {
  const symbol = 'BTC';
  const API_BASE_URL = 'http://localhost:8080';
  const dummyTxId = 'DUMMY-TXID-123456';

  beforeEach(() => {
    // ✅ intercept 먼저 등록
    cy.intercept('GET', `${API_BASE_URL}/api/coin/info/${symbol}`, {
      statusCode: 200,
      body: {
        currency: symbol,
        address: '0xDUMMY123456789abcdef',
        tag: 'DUMMY-TAG-9876',
      },
    }).as('getCoinInfo');

    cy.intercept('POST', `${API_BASE_URL}/api/deposit`, (req) => {
      expect(req.body).to.include({
        txid: dummyTxId,
        currency: symbol,
      });

      req.reply({
        statusCode: 200,
        body: {},
      });
    }).as('requestDeposit');


    cy.request('POST', `${API_BASE_URL}/api/login`, {
      email: Cypress.env('email'),
      password: Cypress.env('password'),
      captchaKey: 'test-bypass',
      captchaValue: 'test-bypass',
    }).then((res) => {
      const { accessToken } = res.body;

      cy.visit(`/coin/address/${symbol}`, {
        onBeforeLoad(win) {
          win.sessionStorage.setItem('accessToken', accessToken);

          // ✅ 클립보드 모킹
          Object.defineProperty(win.navigator, 'clipboard', {
            value: {
              writeText: (text: string) => {
                (win as any).handleCopyCallCount =
                  ((win as any).handleCopyCallCount || 0) + 1;
                (win as any).lastCopiedText = text;
                return Promise.resolve();
              },
            },
            configurable: true,
          });
        },
      });
    });
  });

  it('입금 주소 복사부터 거래 ID 제출까지 전체 플로우', () => {
    cy.wait('@getCoinInfo');

    cy.get('.font-mono').should('contain.text', '0xDUMMY123456789abcdef');

    cy.window().then((win) => {
      (win as any).handleCopyCallCount = 0;
    });

    cy.get('[data-testid="copy-button"]').click();

    cy.window().its('handleCopyCallCount').should('eq', 1);

    cy.get('[data-testid="copy-toast"]').should('be.visible');
    cy.wait(2100);
    cy.get('[data-testid="copy-toast"]').should('not.exist');

    cy.contains('입금 확인').click();
    cy.location('pathname').should('include', `/coin/transaction/${symbol}`);

    cy.get('[data-testid="txid-input"]').type(dummyTxId);
    cy.contains('button', '확인')
      .should('exist')
      .and('not.be.disabled')
      .click();

    cy.wait('@requestDeposit');

    cy.location('pathname').should('include', `/coin-detail/${symbol}`);
  });
});

describe("토큰 환전 페이지", () => {
  const bank = "MYTOKEN";
  const selectedCurrency = "XRP";
  const API_BASE_URL = "http://localhost:8080";

  beforeEach(() => {
    // ✅ API 인터셉트 등록
    cy.intercept("GET", `${API_BASE_URL}/api/exchange/info?currency=${bank}`, {
      statusCode: 200,
      body: {
        currency: bank,
        tokenBalance: 10000,
        portfolios: [
          {
            currency: selectedCurrency,
            amount: 500,
            nonAvailableAmount: 100,
          },
        ],
      },
    }).as("getTokenInfo");

    // ❌ WebSocket이라 intercept 불필요
    // cy.intercept("GET", `${API_BASE_URL}/api/ticker`, ... ) -> 제거

    cy.intercept("GET", `${API_BASE_URL}/api/token/balance/${bank}`, {
      statusCode: 200,
      body: 1000,
    }).as("getTokenBalance");

    cy.intercept("GET", `${API_BASE_URL}/api/balance/${selectedCurrency}`, {
      statusCode: 200,
      body: {
        balance: 300,
      },
    }).as("getCoinBalance");

    cy.intercept("POST", `${API_BASE_URL}/api/exchange/token`, (req) => {
      expect(req.body).to.have.property("traceId");
      req.reply({ statusCode: 200 });
    }).as("requestExchange");

    // ✅ 로그인 후 sessionStorage에 토큰 저장 & 페이지 진입
    cy.request("POST", `${API_BASE_URL}/api/login`, {
      email: Cypress.env("email"),
      password: Cypress.env("password"),
      captchaKey: "test-bypass",
      captchaValue: "test-bypass",
    }).then((res) => {
      const token = res.body.accessToken;
      cy.visit(`/token/exchange/${bank}`, {
        onBeforeLoad(win) {
          win.sessionStorage.setItem("accessToken", token);
        },
      });
    });
  });

  it("환전 요청이 정상적으로 수행되는지 확인", () => {
    cy.wait("@getTokenInfo");
    cy.wait("@getTokenBalance");
    cy.wait("@getCoinBalance");

    cy.get('input[type="number"]').clear().type("100");

    cy.contains("button", "환전 요청")
      .should("exist")
      .and("not.be.disabled")
      .click();

    cy.wait("@requestExchange");

    cy.location("pathname").should("include", "/token/exchange/complete");
  });
});

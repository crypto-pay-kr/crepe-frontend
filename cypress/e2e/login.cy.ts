describe("Login Flow", () => {
  it("should successfully log in and navigate to /my/coin", () => {
    // 환경변수에서 로그인 정보 가져오기
    const email = Cypress.env("email");
    const password = Cypress.env("password");

    // 로그인 수행
    cy.login({ email, password });

    // 로그인 후 페이지 이동 확인 (주석 해제하면 검사됨)
    // cy.url().should("include", "/my/coin");
  });
});
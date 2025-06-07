// 로그인에 필요한 인터페이스 정의
interface LoginCredentials {
  email: string;
  password: string;
}

// Cypress.Commands에 타입 추가
declare namespace Cypress {
  interface Chainable {
    login(credentials: LoginCredentials): Chainable<void>;
  }
}

// 로그인 커스텀 명령어
Cypress.Commands.add("login", ({ email, password }: LoginCredentials) => {
  cy.visit("/"); // 루트 페이지로 이동
  cy.url().should("include", "/");
  cy.get('.bg-white\\/60 > .text-\\[\\#4B5EED\\]').click(); // 로그인 버튼 클릭
  cy.get("input[placeholder='아이디 (이메일)']").type(email); // 이메일 입력
  cy.get("input[placeholder='비밀번호']").type(password); // 비밀번호 입력
  cy.get("input[placeholder='보이는 대로 입력해주세요']").should("exist"); // Captcha 입력 필드 확인
  cy.get("input[placeholder='보이는 대로 입력해주세요']").focus(); // Captcha 필드에 포커스
  cy.wait(10000); // 사용자가 Captcha를 입력할 시간을 기다림 (30초)
  cy.get("button.bg-\\[\\#4B5EED\\]").click(); // 로그인 버튼 클릭
 // cy.url().should("include", "/my/coin"); // /my/coin 페이지로 이동 확인
});
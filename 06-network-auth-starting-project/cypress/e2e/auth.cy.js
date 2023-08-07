describe('Auth', () => {
  beforeEach(() => {
    cy.task('seedDatabase');
  });
  it('Sign up', () => {
    cy.visit('/signup');
    cy.get('[data-cy="auth-email"]').click();
    cy.get('[data-cy="auth-email"]').type('test2@example.com');
    cy.get('[data-cy="auth-password"]').type('testpassword');
    cy.get('[data-cy="auth-submit"]').click();
    cy.location('pathname').should('eq', '/takeaways');
    cy.getCookie('__session').its('value').should('not.be.empty');
  });
  it('Should login', () => {
    cy.visit('login');
    cy.get('[data-cy="auth-email"]').click();
    cy.get('[data-cy="auth-email"]').type('test@example.com');
    cy.get('[data-cy="auth-password"]').type('testpassword');
    cy.get('[data-cy="auth-submit"]').click();
    cy.location('pathname').should('eq', '/takeaways');
    cy.getCookie('__session').its('value').should('not.be.empty');
  });
  it('should log out', () => {
    cy.login();

    cy.contains('Logout').click();
    cy.location('pathname').should('eq', '/');
    cy.getCookie('__session').its('value').should('be.empty');
  });
});

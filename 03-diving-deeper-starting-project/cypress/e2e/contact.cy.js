describe('Contact Form', () => {
  it('should submit the form', () => {
    cy.visit('http://localhost:5173/about');
    cy.get('[data-cy="contact-input-message"]').type('Hello');
    cy.get('[data-cy="contact-input-name"]').type('Jane Doe');
    // cy.get('[data-cy="contact-btn-submit"]')
    //   .contains('Send Message')
    //   .and('not.have.attr', 'disabled');
    cy.get('[data-cy="contact-btn-submit"]').then((el) => {
      expect(el.attr('disabled')).to.be.undefined;
      expect(el.text()).to.eq('Send Message');
    });

    cy.get('[data-cy="contact-input-email"]').type('kDl8G@example.com{enter}');
    cy.get('[data-cy="contact-btn-submit"]').as('submitBtn');
    // cy.get('@submitBtn').click();

    cy.get('@submitBtn').contains('Sending...');
    cy.get('@submitBtn').should('be.disabled');
  });
});

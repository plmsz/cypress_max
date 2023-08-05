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
  it('should validate the form input', () => {
    cy.visit('http://localhost:5173/about');
    cy.get('[data-cy="contact-btn-submit"]').then((el) => {
      expect(el).to.not.have.attr('disabled');
      expect(el.text()).to.not.eq('Sending...');
    });
    cy.get('[data-cy="contact-btn-submit"]').contains('Send Message');
    cy.screenshot();
    cy.get('[data-cy="contact-input-message"]').as('msgInput');
    cy.get('@msgInput').focus().blur();
    //then was instable
    // cy.get('@msgInput').parent().then(el => {
    //   expect(el.attr('class')).to.contains('invalid'); //contains matches the class name partially
    // });
    cy.get('@msgInput')
      .parent()
      .should('have.attr', 'class')
      .and('match', /invalid/);
    cy.get('[data-cy="contact-input-name"]').focus().blur();

    cy.get('[data-cy="contact-input-name"]')
      .parent()
      .should('have.attr', 'class')
      .and('match', /invalid/);

    cy.get('[data-cy="contact-input-email"]').focus().blur();
    cy.get('[data-cy="contact-input-email"]')
      .parent()
      .should((el) => {
        expect(el.attr('class')).not.to.be.undefined;
        expect(el.attr('class')).contains('invalid');
      });
    cy.screenshot();
  });
});

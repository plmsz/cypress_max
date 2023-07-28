describe('tasks page', () => {
  it('should render the main image', () => {
    cy.visit('http://localhost:5173/'); //implicit assertion
    //cy.get('img')
    // cy.get('.main-header img');
    cy.get('.main-header').find('img')
  });
  it('should display the page title', () => {
    cy.visit('http://localhost:5173/');
    cy.get('h1').should('have.length', 1); // explicit assertion
    cy.get('h1').contains('My Cypress Course Tasks');
    // cy.contains('My Cypress Course Tasks'); // ambos funcionam
  });
});

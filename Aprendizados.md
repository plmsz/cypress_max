# Run

npx open cypress

"cypress": "concurrently \"npm run dev\" \"cypress open\""
npm i concurrently

# Auto-completion

`/// <reference types="Cypress" />`

ou:
https://docs.cypress.io/guides/tooling/IDE-integration#Writing-Tests
ts:
{
"compilerOptions": {
"allowJs": true,
"types": ["cypress"]
},
"include": ["**/*.*"]
}
`

# Selecting (queries)

- `cy.get('img')` procura por todas as img
- `cy.get("[alt='A list']")` procura pelo alt

## get() x find()

- Get after get doesn't not work, use find instead:
  `cy.get('.main-header').find('img')`

## contains()

DOM elements can contain more than the desired text and still match.
https://docs.cypress.io/api/commands/contains#Scopes

- When starting a series of commands:
  This queries the entire document for the content.

`cy.contains('Log In')`

- When chained to an existing series of commands
  This will query inside of the <#checkout-container> element.

`cy.get('#checkout-container').contains('Buy Now')`

- Be wary of chaining multiple contains
  Let's imagine a scenario where you click a button to delete a user and a dialog appears asking you to confirm this deletion.

// This doesn't work as intended
`cy.contains('Delete User').click().contains('Yes, Delete!').click()`

What you want to do is call cy again, which automatically creates a new chain scoped to the document.
`cy.contains('Delete User').click()`
`cy.contains('Yes, Delete!').click()`

## data-\*

Use data-\* attributes to provide context to your selectors and isolate them from CSS or JS changes.
When determining a unique selector, it will automatically prefer elements with:

data-cy
data-test
data-testid

## disabled
cy.get('[data-cy="contact-btn-submit"]').should("be.disabled")
cy.get('[data-cy="contact-btn-submit"]').should("not.be.disabled")

cy.get('[data-cy="contact-btn-submit"]').should("not.have.attr", 'disabled')
cy.get('[data-cy="contact-btn-submit"]').should(".have.attr", 'disabled')

# Chain commands
-  and = should
 cy.get('[data-cy="contact-btn-submit"]')
      .contains('Send Message')
      .and('not.have.attr', 'disabled');

# Alias
cy.get('[data-cy="contact-btn-submit"]').as("submitBtn")
    cy.get("@submitBtn").click();
    cy.get("@submitBtn").contains('Sending...');

# Then
  cy.get('[data-cy="contact-btn-submit"]').then((el) => {
      expect(el.attr('disabled')).to.be.undefined;
      expect(el.text()).to.eq('Send Message')
    });

## Element in order
`cy.get('.task').first().contains("New Task");`
`cy.get('.task').eq(0).contains("New Task");`

`cy.get('.task').last().contains("New Task 2");`
`cy.get('.task').eq(1).contains("New Task 2");`

# User interaction

`cy.get('#filter').select('moderate');`
`cy.contains('Add Task').click();`
`cy.get('#title').type('New Task');`

It forces cypress to click in the backdrop, even if that is a textarea in front, but would causes a false positive, so will need a second check
`cy.get('.backdrop').click({ force: true });`
`cy.get('.backdrop').should('not.exist');`
`cy.get('.modal').should('not.exist')`

# Special keys in type
https://docs.cypress.io/api/commands/type#Arguments
{esc}
{enter}
non native events on cypress : https://github.com/dmtrKovalenko/cypress-real-events
# Location

`cy.location('pathname').should('eq','/about');`
`cy.go("back");`


# Custom Comands
Cypress.Commands.add("getByData", (selector) => {
  return cy.get(`[data-test=${selector}]`)
})


// TODO: rEAD https://docs.cypress.io/guides/references/best-practices
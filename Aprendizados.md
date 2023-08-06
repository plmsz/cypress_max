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

- and = should
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

# blur, focus, parent

cypress doens't automatically move the focus to the next input field.
`cy.get('[data-cy="contact-input-name"]').focus().blur();
cy.get('[data-cy="contact-input-name"]').parent().then(el => {
expect(el.attr('class')).to.contains('invalid');
});

`

# Cy headless

cypress run

- When fails in the headless cypres use a data atribute to select something
- should() is more stable than "then()"

## Should - Yields

cy.get('nav') // yields <nav>
.should('be.visible') // yields <nav>

In the example below, the second .should() yields the string sans-serif because the chainer have.css, 'font-family' changes the subject.

cy.get('nav') // yields <nav>
.should('be.visible') // yields <nav>
.should('have.css', 'font-family') // yields 'sans-serif'
.and('match', /serif/) // yields 'sans-serif'

### Change of subject

cy.get('[data-cy="contact-input-name"]')
.parent()
.should('have.attr', 'class')
.and('match', /invalid/);

    cy.get('[data-cy="contact-input-email"]').focus().blur();
    cy.get('[data-cy="contact-input-email"]')
      .parent()
      .should((el) => {
        expect(el.attr('class').contains('invalid'));
      });
    cy.screenshot();

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
Cypress.Commands.add('submitForm', () => {
cy.get('form button[type="submit"]').click();
});
Now a query is like a command, but one core difference is that it's a retryable function that can be retried
by Cypress whilst it's, for example, is waiting for the visibily of the element. The difference is that queries are automatically retried by Cypress whereas commands are not (i.e., if the element is not found initially, Cypress will keep on searching).

Cypress.Commands.addQuery('getById', (id) => {
const getFn = cy.now('get', `[data-cy="${id}"]`);
return () => {
return getFn();
};
});

# Screencshots

cy.screenshot();

# Config

`https://docs.cypress.io/api/cypress-api/config

# Baseurl

import { defineConfig } from "cypress";

export default defineConfig({
e2e: {
baseUrl: 'http://localhost:5173',
setupNodeEvents(on, config) {
// implement node event listeners here
},
},
});`

---

`cy.visit('/about')`

# Beforeeach, before, afterEach, after

beforeEach(() => {
//runs only once,before all test
})
beforeEach(() => {
//runs before each test
cy.visit('/about');
})

// TODO: rEAD https://docs.cypress.io/guides/references/best-practices

# task()

https://docs.cypress.io/api/commands/task#Examples
https://glebbahmutov.com/blog/powerful-cy-task/
cy.task() provides an escape hatch for running arbitrary Node code, so you can take actions necessary for your tests outside of the scope of Cypress. This is great for:

Read a file that might not exist
Return number of files in the folder
Seeding your test database.
Storing state in Node that you want persisted between spec files.
Performing parallel tasks, like making multiple http requests outside of Cypress.
Running an external process.

# Stubs

- replace for existing functions or methods
- returns a callback
  ` cy.visit('/').then((win) => {
    cy.stub(win.navigator.geolocation, 'getCurrentPosition').as(
      'getUserPosition',
    ).callsFake((cb)=>{
      setTimeout(() => {
        cb({
          coords: {
            latitude: -12.9698108,
            longitude: -38.5211215,
          },
        });
      }, 100);
    }); // replace the getCurrentPosition function from the browser
  });
  cy.get('[data-cy="get-loc-btn"]').click();
  cy.get('@getUserPosition').should('have.been.called');`
- returns a promise
  cy.stub(win.navigator.clipboard, 'writeText').as('saveToClipboard').resolves()

# Fixtures e regex

- '.\*': This part of the regular expression matches any sequence of characters (except for a newline).
  cy.fixture('user-location.json').as('userLocation');

cy.get('@userLocation').then((fakePosition) => {
const { latitude, longitude } = fakePosition.coords;
cy.get('@saveToClipboard').should(
'have.been.calledWithMatch',
new RegExp(`${latitude}.*${longitude}.*${encodeURI('Jane Doe')}`),
);
});

# Spy

      cy.spy(win.localStorage, 'setItem').as('storeLocation');

cy.get('@storeLocation').should('have.been.calledWith');
cy.get('@storeLocation').should(
'have.been.calledWithMatch',
/Jane Doe/,
new RegExp(`${latitude}.*${longitude}.*${encodeURI('Jane Doe')}`),
);

# Manipulating the clock
  beforeEach(() => {
    cy.clock();
})
cy.tick(2000); //advance 2 seconds
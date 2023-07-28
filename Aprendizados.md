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
# Selector

- `cy.get('img')` procura por todas as img
- `cy.get("[alt='A list']")` procura pelo alt

# get() x find()
- Get after get doesn't not work, use find instead:
`cy.get('.main-header').find('img')`

# User interaction
It forces cypress to click in the backdrop, even if that is a textarea in front, but would causes a false positive, so will need a second check
`cy.get('.backdrop').click({ force: true });`
`cy.get('.backdrop').should('not.exist');`
`cy.get('.modal').should('not.exist')`
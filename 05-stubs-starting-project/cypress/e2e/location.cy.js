describe('share location', () => {
  beforeEach(() => {
    cy.clock();
    cy.fixture('user-location.json').as('userLocation');
    //at visit yields thw window object
    cy.visit('/').then((win) => {
      cy.get('@userLocation').then((fakePosition) => {
        cy.stub(win.navigator.geolocation, 'getCurrentPosition')
          .as('getUserPosition')
          .callsFake((cb) => {
            setTimeout(() => {
              cb(fakePosition);
            }, 100);
          }); // replace the getCurrentPosition function from the browser
      });
      cy.stub(win.navigator.clipboard, 'writeText')
        .as('saveToClipboard')
        .resolves();

      cy.spy(win.localStorage, 'setItem').as('storeLocation');
      cy.spy(win.localStorage, 'getItem').as('getStoredLocation');
    });
  });
  it('should fetch the user location', () => {
    cy.get('[data-cy="get-loc-btn"]').click();
    cy.get('@getUserPosition').should('have.been.called');
    cy.get('[data-cy="get-loc-btn"]').should('be.disabled');
    cy.get('[data-cy="actions"]').contains('Location fetched');
  });
  it('should share a location url', () => {
    cy.get('[data-cy="name-input"]').type('Jane Doe');
    cy.get('[data-cy="get-loc-btn"]').click();
    cy.get('[data-cy="share-loc-btn"]').click();
    cy.get('@saveToClipboard').should('have.been.called');
    // cy.get('@saveToClipboard').should('have.been.be.calledWith', 'https://www.bing.com/maps?cp=-12.9698108~-38.5211215&lvl=15&style=r&sp=point.-12.9698108_-38.5211215_Jane%20Doe');
    cy.get('@userLocation').then((fakePosition) => {
      const { latitude, longitude } = fakePosition.coords;
      cy.get('@saveToClipboard').should(
        'have.been.calledWithMatch',
        new RegExp(`${latitude}.*${longitude}.*${encodeURI('Jane Doe')}`),
      );
      cy.get('@storeLocation').should('have.been.calledWith');
      cy.get('@storeLocation').should(
        'have.been.calledWithMatch',
        /Jane Doe/,
        new RegExp(`${latitude}.*${longitude}.*${encodeURI('Jane Doe')}`),
      );
    });
    cy.get('[data-cy="share-loc-btn"]').click();
    cy.get('@getStoredLocation').should('have.been.called');
    cy.get('[data-cy="info-message"]').should('be.visible');
    cy.get('[data-cy="info-message"]').should('have.class', 'visible');
    cy.tick(2000);
    cy.get('[data-cy="info-message"]').should('not.be.visible');
  });
});

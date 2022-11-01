describe('load homepage', () => {
  it('passes', () => {
    cy.visit('http://localhost:8080')
    cy.get('.v-carousel').should('exist')
    cy.get('.logo').should('have.text', 'CoderBot')
    cy.get('a[href*="program"]').should('exist')
    cy.get('a[href*="control"]').should('exist')
    cy.get('a[href*="settings"]').should('exist')
  })

  it('checks sidebar contents', () => {
    cy.visit('http://localhost:8080')
    cy.get('.v-carousel').should('exist')
    cy.get('button.v-app-bar-nav-icon').should('exist').click()
    cy.get('a[href="#/"]').should('exist')
    cy.get('a[href*="/docs"]').should('exist')
    cy.get('a[href*="/activity/manage"]').should('exist')
    cy.get('a[href*="/program"]').should('exist')
    cy.get('a[href*="/control"]').should('exist')
    cy.get('a[href*="/gallery"]').should('exist')
    cy.get('a[href*="/settings"]').should('exist')
  })
})
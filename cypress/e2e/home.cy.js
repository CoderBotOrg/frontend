describe('load homepage', () => {
  it('passes', () => {
    cy.visit('http://localhost:8080')
    cy.get('.logo').should('have.text', 'CoderBot')
    cy.get('a[href*="program"]').should('exist')
    cy.get('a[href*="control"]').should('exist')
    cy.get('a[href*="settings"]').should('exist')
  })
})
describe('load homepage', () => {
  it('checks sidebar contents', () => {
    cy.visit('http://localhost:8080')
    cy.get('.v-carousel').should('exist')
    cy.get('button.v-app-bar-nav-icon').should('exist').click()
    cy.get('a.v-list-item[href*="/docs"]').should('exist')
    cy.get('a.v-list-item[href*="/docs"]').invoke('removeAttr', 'target').click()
    cy.url().should('include', '/docs')
  })
})
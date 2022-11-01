describe('load homepage', () => {
  it('checks sidebar contents', () => {
    cy.visit('http://localhost:8080')
    cy.get('button.v-app-bar-nav-icon').should('exist').click()
    cy.get.v-list-item('a[href*="/gallery"]').click()
    cy.get('h3').should('exist')
  })
})
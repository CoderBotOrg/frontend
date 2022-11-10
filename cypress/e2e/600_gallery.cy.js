describe('load homepage', () => {
  it('checks sidebar contents', () => {
    cy.visit('http://localhost:8080')
    cy.get('.v-carousel').should('exist')
    cy.get('button.v-app-bar-nav-icon').should('exist').click()
    cy.get('a.v-list-item[href*="/gallery"]').should('exist')
    cy.get('a.v-list-item[href*="/gallery"]').click()
    cy.get('h3').should('exist')
  })

  it('checks photo exists, sees details', () => {
  })

  it('checks video exists, plays it', () => {
  })

  it('deletes existing photo', () => {
  })

  it('deletes existing vide', () => {
  })
})
describe('load homepage', () => {
  it('checks sidebar contents', () => {
    cy.visit('http://localhost:8080')
    cy.get('.v-carousel').should('exist')
    cy.get('button.v-app-bar-nav-icon').should('exist').click()  
    cy.get('a.v-list-item[href*="control"]').click()
    cy.get('img[src*="video/stream"]').should('exist')
  })

  it('takes picture', () => {
  })

  it('say a phrase', () => {
  })

  it('record a video', () => {
  })

  it('opens gallery', () => {
  })
})
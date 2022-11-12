describe('load control page, verify stream is there', () => {
  it('checks sidebar contents', () => {
    cy.visit('http://localhost:8080')
    cy.get('.v-carousel').should('exist')
    cy.get('button.v-app-bar-nav-icon').should('exist').click()  
    cy.get('a.v-list-item[href*="control"]').click()
    cy.get('img[src*="video/stream"]').should('exist')
  })

  it('move', () => {
    cy.visit('http://localhost:8080')
    cy.get('.v-carousel').should('exist')
    cy.get('button.v-app-bar-nav-icon').should('exist').click()  
    cy.get('a.v-list-item[href*="control"]').click()
    cy.get('#app').click()
    cy.get('button.up').click()
    cy.get('button.left').click()
    cy.get('button.right').click()
    cy.get('button.down').click()
  })

  it('takes a picture', () => {
    cy.visit('http://localhost:8080')
    cy.get('.v-carousel').should('exist')
    cy.get('button.v-app-bar-nav-icon').should('exist').click()  
    cy.get('a.v-list-item[href*="control"]').click()
    cy.get('#app').click()
    cy.get('button.photo').click()
  })

  it('record a video', () => {
    cy.visit('http://localhost:8080')
    cy.get('.v-carousel').should('exist')
    cy.get('button.v-app-bar-nav-icon').should('exist').click()  
    cy.get('a.v-list-item[href*="control"]').click()
    cy.get('#app').click()
    cy.get('button.video').click()
    cy.get('button.video').click()
  })

  it('say a phrase', () => {
    cy.visit('http://localhost:8080')
    cy.get('.v-carousel').should('exist')
    cy.get('button.v-app-bar-nav-icon').should('exist').click()  
    cy.get('a.v-list-item[href*="control"]').click()
    cy.get('#app').click()
    cy.get('button.speak').click()
    cy.get('#control_text_to_speech').clear().type('hello world!')
    cy.get('#dialog_control_speak_title').find('button.ok').click()
  })

  it('opens gallery', () => {
    cy.visit('http://localhost:8080')
    cy.get('.v-carousel').should('exist')
    cy.get('button.v-app-bar-nav-icon').should('exist').click()  
    cy.get('a.v-list-item[href*="control"]').click()
    cy.get('#app').click()
    cy.get('a.gallery').click()
    cy.url().should('include', '/gallery')
  })
})
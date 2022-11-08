describe('load homepage', () => {
  it('checks toolbar bar contents', () => {
    cy.visit('http://localhost:8080')
    cy.get('.v-carousel').should('exist')
    cy.get('button.v-app-bar-nav-icon').should('exist').click()
    cy.get('a.v-list-item[href*="/program"]').should('exist')
    cy.get('a.v-list-item[href*="/program"]').click()
    cy.get('#app').click()
    cy.get('button#clearProgramDlg').should('exist')
    cy.get('button#saveProgram').should('exist')
    cy.get('button#toggleSaveAs').should('exist')
    cy.get('button#loadProgramList').should('exist')
    cy.get('button#runProgram').should('exist')
    cy.get('button#getProgramCode').should('exist')
    cy.get('button#exportProgram').should('exist')
    cy.get('button#pickFile').should('exist')
  })

  it('checks blockly loaded', () => {
    cy.visit('http://localhost:8080')
    cy.get('.v-carousel').should('exist')
    cy.get('button.v-app-bar-nav-icon').should('exist').click()
    cy.get('a.v-list-item[href*="/program"]').should('exist')
    cy.get('a.v-list-item[href*="/program"]').click()
    cy.get('#app').click()
    cy.get('.blocklyTotal').should('exist')
    cy.get('.blocklyToolboxDiv').should('exist')
    cy.get('.blocklyWorkspace').should('exist')
  })

  it('loads an existing program', () => {
    cy.visit('http://localhost:8080')
    cy.get('.v-carousel').should('exist')
    cy.get('button.v-app-bar-nav-icon').should('exist').click()
    cy.get('a.v-list-item[href*="/program"]').should('exist')
    cy.get('a.v-list-item[href*="/program"]').click()
    cy.get('#app').click()
    cy.get('button#loadProgramList').should('exist')
    cy.get('button#loadProgramList').click()
    cy.contains('test_sonars').should('exist')
    cy.contains('test_sonars').click()
    cy.get('.blocklyPath').should('exist')
    cy.get('button#clearProgramDlg').click()
    cy.get('button.text-green').should('exist')
    cy.get('button.text-green').click()
  })

  it('create a new program, save it', () => {
  })  

  it('create a new program, save as new', () => {
  })  

  it('create a new program, save as existing, verify check confirm', () => {
  })  

  it('create a new program, save as existing default, verify not possiblr', () => {
  })  

  it('create a new program, run, stop, delete', () => {
  })  
})
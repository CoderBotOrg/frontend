describe('activities page', () => {
  it('loads the default activity', () => {
    cy.visit('http://localhost:8080')
    cy.get('.v-carousel').should('exist')
    cy.get('button.v-app-bar-nav-icon').should('exist').click()  
    cy.get('a.v-list-item[href*="activity/manage"]').click()
    cy.get('#activity_list').should('exist')
    cy.get('div#default').should('exist')
    cy.get('div#default i.mdi-star').should('exist')
    cy.get('div#default .v-list-item-title').should('have.text', 'default')
    cy.get('div#default a[href*="activity/edit/default"]').should('exist')
    cy.get('#app').click()
    cy.get('div#default a[href*="activity/edit/default"]').click()
  })

  it('creates a new activity', () => {
    cy.visit('http://localhost:8080')
    cy.get('.v-carousel').should('exist')
    cy.get('button.v-app-bar-nav-icon').should('exist')
    cy.get('button.v-app-bar-nav-icon').click()  
    cy.get('a.v-list-item[href*="activity/manage"]').click()
    cy.get('#app').click()
    cy.get('a.v-btn[href*="activity/new"]').should('exist')
    cy.get('a.v-btn[href*="activity/new"]').click()
    cy.get('input#name').should('exist')
    cy.get('input#desc').should('exist')
    cy.get('input#name').type("test-activity-name")
    cy.get('input#desc').type("Test activity description")
    cy.get('button#toolbox').should('exist')
    cy.get('button#toolbox').click()
    cy.get('button#add_category').should('exist')
    cy.get('button#add_category_all').should('exist')
    cy.get('button#add_category_all').click()
    cy.get('button#save').should('exist')
    cy.get('button#save').click()
  })
  it('deletes an existing activity', () => {
    cy.visit('http://localhost:8080')
    cy.get('.v-carousel').should('exist')
    cy.get('button.v-app-bar-nav-icon').should('exist')
    cy.get('button.v-app-bar-nav-icon').click()  
    cy.get('a[href*="activity/manage"]').click()
    cy.get('#app').click()
    cy.get('div#test-activity-name').find('i.mdi-delete').should("exist")
    cy.get('div#test-activity-name').find('i.mdi-delete').click()
    cy.get('button#confirmDeleteDlg_ok').should("exist")
    cy.get('button#confirmDeleteDlg_ok').click({ force: true, multiple: true })
  })
  it('creates activity, open default view', () => {
    cy.visit('http://localhost:8080')
    cy.get('.v-carousel').should('exist')
    cy.get('button.v-app-bar-nav-icon').should('exist')
    cy.get('button.v-app-bar-nav-icon').click()  
    cy.get('a.v-list-item[href*="activity/manage"]').click()
    cy.get('#app').click()
    cy.get('a.v-btn[href*="activity/new"]').should('exist')
    cy.get('a.v-btn[href*="activity/new"]').click()
    cy.get('input#name').type("test-default-activity-name")
    cy.get('input#desc').type("Test default activity description")
    cy.get('input#is_default').check()
    cy.get('button#toolbox').click()
    cy.get('button#add_category_all').click()
    cy.get('button#save').click()
    cy.visit('http://localhost:8080')
    cy.get('.v-carousel').should('exist')
    cy.get('button.v-app-bar-nav-icon').should('exist')
    cy.get('button.v-app-bar-nav-icon').click()  
    cy.get('a.v-list-item[href*="activity/manage"]').click()
    cy.get('#app').click()
    cy.get('#activity_list').find('.mdi-star').should('have.length', 1)
    cy.get('button.v-app-bar-nav-icon').should('exist')
    cy.get('button.v-app-bar-nav-icon').click()  
    cy.get('a.v-list-item[href*="program"]').click()
    cy.get('#app').click()
    cy.contains('test-default-activity-name').should('exist')    
    cy.get('button.v-app-bar-nav-icon').should('exist')
    cy.get('button.v-app-bar-nav-icon').click()  
    cy.get('a.v-list-item[href*="activity/manage"]').click()
    cy.get('#app').click()
    cy.get('div#test-default-activity-name').find('i.mdi-delete').click()
    cy.get('button#confirmDeleteDlg_ok').click({ force: true, multiple: true })
  })
})
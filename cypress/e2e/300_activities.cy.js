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
    cy.get('button#activity_save').should('exist')
    cy.get('button#activity_save').click()
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
    cy.get('button#activity_save').click()
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

  it('creates activity, define specific buttons, verify', () => {
    cy.visit('http://localhost:8080')
    cy.get('.v-carousel').should('exist')
    cy.get('button.v-app-bar-nav-icon').should('exist')
    cy.get('button.v-app-bar-nav-icon').click()  
    cy.get('a.v-list-item[href*="activity/manage"]').click()
    cy.get('#app').click()
    cy.get('a.v-btn[href*="activity/new"]').should('exist')
    cy.get('a.v-btn[href*="activity/new"]').click()
    cy.get('input#name').type("test-basic-activity-name")
    cy.get('input#desc').type("Test basic activity description")
    cy.get('input#is_default').check()
    cy.get('button#toolbar').click()
    cy.get('#button_index_7').find('button.remove').click()
    cy.get('#button_index_6').find('button.remove').click()
    cy.get('#button_index_5').find('button.remove').click()
    cy.get('#button_index_3').find('button.remove').click()
    cy.get('#button_index_2').find('button.remove').click()
    cy.get('#button_index_1').find('button.remove').click()
    cy.get('button#toolbox').click()
    cy.get('.blockly-toolbox-editor').find('#blockly-9').click()
    cy.get('.blocklyDraggable').click({ force: true, multiple: true })
    cy.get('button#activity_save').click()
    cy.visit('http://localhost:8080')
    cy.get('.v-carousel').should('exist')
    cy.get('button.v-app-bar-nav-icon').should('exist')
    cy.get('button.v-app-bar-nav-icon').click()  
    cy.get('a.v-list-item[href*="activity/manage"]').click()
    cy.get('#app').click()
    cy.get('#activity_list').find('.mdi-star').should('have.length', 1)
    cy.get('#activity_list').contains('test-basic-activity-name').should('exist')
    cy.get('#activity_list').contains('test-basic-activity-name').click()
    cy.url().should('include', 'activity/open/test-basic-activity-name')
    cy.get('.v-toolbar__content').find('button#clearProgramDlg').should('exist')
    cy.get('.v-toolbar__content').find('button#runProgram').should('exist')
    cy.get('.v-toolbar__content').find('button#saveProgram').should('not.exist')
    cy.get('button.v-app-bar-nav-icon').should('exist')
    cy.get('button.v-app-bar-nav-icon').click()  
    cy.get('a.v-list-item[href*="activity/manage"]').click()
    cy.get('#app').click()
    cy.get('div#test-basic-activity-name').find('i.mdi-delete').click()
    cy.get('button#confirmDeleteDlg_ok').click({ force: true, multiple: true })
  })

  it('creates activity, define specific fonts, verify', () => {
    cy.visit('http://localhost:8080')
    cy.get('.v-carousel').should('exist')
    cy.get('button.v-app-bar-nav-icon').should('exist')
    cy.get('button.v-app-bar-nav-icon').click()  
    cy.get('a.v-list-item[href*="activity/manage"]').click()
    cy.get('#app').click()
    cy.get('a.v-btn[href*="activity/new"]').should('exist')
    cy.get('a.v-btn[href*="activity/new"]').click()
    cy.get('input#name').type("test-font-activity-name")
    cy.get('input#desc').type("Test font activity description")
    cy.get('#card_font_ui').find('input[value*="opensans"]').click()
    cy.get('#card_font_editor').find('input[value*="robotomono"]').click()
    cy.get('button#toolbox').click()
    cy.get('.blockly-toolbox-editor').find('#blockly-3').click()
    cy.get('.blocklyDraggable').click({ force: true, multiple: true })
    cy.get('button#activity_save').click()
    cy.visit('http://localhost:8080')
    cy.get('.v-carousel').should('exist')
    cy.get('button.v-app-bar-nav-icon').should('exist')
    cy.get('button.v-app-bar-nav-icon').click()  
    cy.get('a.v-list-item[href*="activity/manage"]').click()
    cy.get('#app').click()
    cy.get('#activity_list').find('.mdi-star').should('have.length', 1)
    cy.get('#activity_list').contains('test-font-activity-name').should('exist')
    cy.get('#activity_list').contains('test-font-activity-name').click()
    cy.url().should('include', 'activity/open/test-font-activity-name')
    cy.get('button.v-app-bar-nav-icon').should('exist')
    cy.get('button.v-app-bar-nav-icon').click()  
    cy.get('a.v-list-item[href*="activity/manage"]').click()
    cy.get('#app').click()
    cy.get('div#test-font-activity-name').find('i.mdi-delete').click()
    cy.get('button#confirmDeleteDlg_ok').click({ force: true, multiple: true })
  })

  it('creates activity, define specific toolbox, verify', () => {
    cy.visit('http://localhost:8080')
    cy.get('.v-carousel').should('exist')
    cy.get('button.v-app-bar-nav-icon').should('exist')
    cy.get('button.v-app-bar-nav-icon').click()  
    cy.get('a.v-list-item[href*="activity/manage"]').click()
    cy.get('#app').click()
    cy.get('a.v-btn[href*="activity/new"]').should('exist')
    cy.get('a.v-btn[href*="activity/new"]').click()
    cy.get('input#name').type("test-spec-activity-name")
    cy.get('input#desc').type("Test spec activity description")
    cy.get('input#is_default').check()
    cy.get('button#toolbox').click()
    cy.get('button#add_category').click()
    cy.get('input#category_name').type("Test category")
    cy.get('button#save_category').click()
    cy.get('.v-list-item-title').contains('Test category').click()
    cy.get('.blockly-toolbox-editor').find('#blockly-1').click()
    cy.get('.blocklyDraggable').click({ force: true, multiple: true })
    cy.get('button#activity_save').click()
    cy.visit('http://localhost:8080')
    cy.get('.v-carousel').should('exist')
    cy.get('button.v-app-bar-nav-icon').should('exist')
    cy.get('button.v-app-bar-nav-icon').click()  
    cy.get('a.v-list-item[href*="activity/manage"]').click()
    cy.get('#app').click()
    cy.get('#activity_list').find('.mdi-star').should('have.length', 1)
    cy.get('#activity_list').contains('test-spec-activity-name').should('exist')
    cy.get('#activity_list').contains('test-spec-activity-name').click()
    cy.url().should('include', 'activity/open/test-spec-activity-name')
    cy.get('.blocklyToolboxDiv').contains('Test category').should('exist')
    cy.get('button.v-app-bar-nav-icon').should('exist')
    cy.get('button.v-app-bar-nav-icon').click()  
    cy.get('a.v-list-item[href*="activity/manage"]').click()
    cy.get('#app').click()
    cy.get('div#test-spec-activity-name').find('i.mdi-delete').click()
    cy.get('button#confirmDeleteDlg_ok').click({ force: true, multiple: true })
  })  
})
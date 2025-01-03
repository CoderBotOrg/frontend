describe('load homepage', () => {
  it('checks tabs', () => {
    cy.intercept('http://localhost:5000/wifi/v1/connection_status', (req) => {
      req.reply({"wifi": false, "internet": true})
    })
    cy.intercept('http://localhost:5000/wifi/v1/list_access_points', (req) => {
      req.reply({"ssids": [{"ssid": "wifi-home", "conn_type": "WPA2", "strength": 99}]})
    })
    cy.visit('http://localhost:8080')
    cy.get('.v-carousel').should('exist')
    cy.get('button.v-app-bar-nav-icon').should('exist').click()
    cy.get('a.v-list-item[href*="/settings"]').click()
    cy.get('#app').click()
    cy.get('button#0').should('exist')
    cy.get('button#1').should('exist')
    cy.get('button#2').should('exist')
    cy.get('button#3').should('exist')
    cy.get('button#4').should('exist')
    cy.get('button#5').should('exist')
    cy.get('button#6').should('exist')
    cy.get('button#7').should('exist')
    cy.get('button#8').should('exist')
  })

  it('checks password', () => {
    cy.intercept('http://localhost:5000/wifi/v1/connection_status', (req) => {
      req.reply({"wifi": false, "internet": true})
    })
    cy.intercept('http://localhost:5000/wifi/v1/list_access_points', (req) => {
      req.reply({"ssids": [{"ssid": "wifi-home", "conn_type": "WPA2", "strength": 99}]})
    })
    cy.visit('http://localhost:8080')
    cy.get('.v-carousel').should('exist')
    cy.get('button.v-app-bar-nav-icon').should('exist').click()
    cy.get('a.v-list-item[href*="/settings"]').click()
    cy.get('#app').click()
    cy.get('button#0').should('exist')
    cy.get('button#0').click()
    cy.wait(500)
    cy.get('#settings_password').should('exist')
    cy.get('#settings_password').type('secret')
    cy.get('#save').should('exist')
    cy.get('#save').click()
    cy.get('.v-snackbar__content').should('exist')
    cy.visit('http://localhost:8080')
    cy.get('.v-carousel').should('exist')
    cy.get('button.v-app-bar-nav-icon').should('exist').click()
    cy.get('a.v-list-item[href*="/settings"]').click()
    cy.get('#settings_password_verify').should('exist')
    cy.get('#settings_password_verify').type('secret')
    cy.get('#settings_password_verify_ok').click()
    cy.get('#app').click()
    cy.get('button#0').should('exist')
    cy.get('button#0').click()
    cy.wait(500)
    cy.get('#settings_password').clear()
    cy.get('#save').click()
    cy.get('.v-snackbar__content').should('exist')
  })

  it('modifies most settings, valid values, save', () => {
    cy.intercept('http://localhost:5000/wifi/v1/connection_status', (req) => {
      req.reply({"wifi": false, "internet": true})
    })
    cy.intercept('http://localhost:5000/wifi/v1/list_access_points', (req) => {
      req.reply({"ssids": [{"ssid": "wifi-home", "conn_type": "WPA2", "strength": 99}]})
    })
    cy.visit('localhost:8080')
    cy.wait(1000)
    cy.get('.v-carousel').should('exist')
    cy.get('button.v-app-bar-nav-icon').should('exist').click()
    cy.get('a.v-list-item[href*="/settings"]').click()
    cy.get('#app').click()
    cy.get('button#1').click()
    cy.wait(1000)
    cy.get('input#settings_movement_control_forward_speed').type('{selectAll}90')
    cy.get('input#settings_movement_control_forward_elapse').type('{selectAll}1')
    cy.get('input#settings_movement_control_turn_speed').type('{selectAll}90')
    cy.get('input#settings_movement_control_turn_elapse').type('{selectAll}1')
    cy.get('input#settings_movement_program_forward_speed').type('{selectAll}90')
    cy.get('input#settings_movement_program_forward_elapse').type('{selectAll}1')
    cy.get('input#settings_movement_program_turn_speed').type('{selectAll}90')
    cy.get('input#settings_movement_program_turn_elapse').type('{selectAll}1')
    cy.get('button#save').click()
    cy.get('#snackId').should('exist')
    cy.visit('http://localhost:8080')
    cy.get('.v-carousel').should('exist')
    cy.get('button.v-app-bar-nav-icon').should('exist').click()
    cy.get('a.v-list-item[href*="/settings"]').click()
    cy.get('#app').click()
    cy.get('button#1').click()
    cy.get('input#settings_movement_control_forward_speed').should('have.value', '90')
    cy.get('input#settings_movement_control_forward_elapse').should('have.value', '1')
    cy.get('input#settings_movement_control_turn_speed').should('have.value', '90')
    cy.get('input#settings_movement_control_turn_elapse').should('have.value', '1')
    cy.get('input#settings_movement_program_forward_speed').should('have.value', '90')
    cy.get('input#settings_movement_program_forward_elapse').should('have.value', '1')
    cy.get('input#settings_movement_program_turn_speed').should('have.value', '90')
    cy.get('input#settings_movement_program_turn_elapse').should('have.value', '1')
  })

  it('modifies most settings, invalid values, verify error message', () => {
    cy.intercept('http://localhost:5000/wifi/v1/connection_status', (req) => {
      req.reply({"wifi": false, "internet": true})
    })
    cy.intercept('http://localhost:5000/wifi/v1/list_access_points', (req) => {
      req.reply({"ssids": [{"ssid": "wifi-home", "conn_type": "WPA2", "strength": 99}]})
    })
    cy.visit('http://localhost:8080')
    cy.get('.v-carousel').should('exist')
    cy.get('button.v-app-bar-nav-icon').should('exist').click()
    cy.get('a.v-list-item[href*="/settings"]').click()
    cy.get('#app').click()
    cy.get('button#1').click()
    cy.get('input#settings_movement_control_forward_speed').clear().type('1000')
    cy.get('input#settings_movement_control_forward_speed').parents('.v-input').find('.v-messages')
  })

  it('modifies some settings, leave page whithout saving, verify "dirty" message', () => {
    cy.intercept('http://localhost:5000/wifi/v1/connection_status', (req) => {
      req.reply({"wifi": false, "internet": true})
    })
    cy.intercept('http://localhost:5000/wifi/v1/list_access_points', (req) => {
      req.reply({"ssids": [{"ssid": "wifi-home", "conn_type": "WPA2", "strength": 99}]})
    })
    cy.visit('http://localhost:8080')
    cy.get('.v-carousel').should('exist')
    cy.get('button.v-app-bar-nav-icon').should('exist').click()
    cy.get('a.v-list-item[href*="/settings"]').click()
    cy.get('#app').click()
    cy.get('button#1').click()
    cy.get('input#settings_movement_control_forward_speed').clear().type('99')
    cy.get('button.v-app-bar-nav-icon').should('exist').click()
    cy.get('a.v-list-item[href*="/control"]').click()
    cy.get('#confirm_exit_dialog').should('exist')
  })
})

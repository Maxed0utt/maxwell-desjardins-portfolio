/// <reference types="cypress" />
// TODO: make one for the home page

describe('Submit the Hire Me Form', () => {
  it('passes', () => {
    cy.visit('localhost:3000/hire-me')
    cy.get('#name').type('Max')
    cy.get('#email').type('max.power@example.com')
    cy.get('#phone').type('7059892772')
    cy.get('#position').type('Software Developer')
    cy.get('#budget').invoke('val', 100).trigger('change')
    cy.get('#positionDescription').type('You will make software for me.')
    cy.get('#sendMessage').click()
  })

  // TODO: test with incorrect phone type
  // TODO: test with incorrect email type
  // TODO: test with error
})

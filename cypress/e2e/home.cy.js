describe('Test all of the A Tags', () => {
  beforeEach(() => {
    cy.visit('localhost:3000')
  })

  it('passes', () => {
    cy.get('#hire-me').click()
    cy.url().should('eq', 'http://localhost:3000/hire-me')
  })

  it('passes', () => {
    cy.get('#rep-app', {timeout: 10000}).should('be.visible').then(link => {
      const href = link.prop('href')
      const target = link.prop('target')
      expect(href).to.equal('https://app.rephealth.com/login')
      if (target === '_blank') assert.isTrue(true)
      else assert.isTrue(false)
    })
  })

})

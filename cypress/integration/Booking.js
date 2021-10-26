describe('customer, I should be able to make a booking ‘groom my cat‘', () => {
    beforeEach(() =>{
        cy.visit('/')
        
        cy.url().should('contain', "/?countryCode=AU")
        cy.get("div.hidden.spinnerOutter", {timeout:10000}).should('not.exist')
        cy.intercept({
            method: "POST",
            url: "https://dc.services.visualstudio.com/v2/track**",
          }).as("dataGetFirst");
        cy.wait("@dataGetFirst");
        

    })
    // test scenario 1
    it('should have a working search box', () => {
        cy.get('.navbar').should('contain', 'Select Service - 1/4') // verify the page number
        cy.get('.card-header > .form-group > .form-control')
        .type("groom my cat")
        cy.get('.medium-device div > .btn').should(($result) => {
            expect($result).to.have.lengthOf(12) // expect the total number of results
            expect($result).to.contain('Dog Wash')
        })
    })
    // test scenario 2
    it('should have a working sort button', () => {
        cy.get('.navbar').should('contain', 'Select Service - 1/4') // verify the page number
        // verify the first category after visiting the url
        cy.get('.medium-device > :nth-child(1) > :nth-child(1)').should('contain', 'Mowing')
        // now click the A-Z sort button
        cy.get('.col-4 > .btn')
            .should('contain', 'Sort A-Z')
            .click()
        // verify the first category
        cy.get('.medium-device > :nth-child(1) > :nth-child(1)').should('contain', 'Antennas')
        // then go back to sort by popularity
        cy.get('.col-4 > .btn')
        .should('contain', 'Sort Popular')
        .click()
        cy.get('.medium-device > :nth-child(1) > :nth-child(1)').should('contain', 'Mowing')
    })
     // test scenario 3
     it('should be able to select the correct categories and move to the next pages', () => {
        cy.get('.navbar').should('contain', 'Select Service - 1/4') // verify the page number
        cy.get('.medium-device > :nth-child(2)').contains('Dog Wash', {timeout: 20000}).should(($button) => {
            // do some css/visual assertions
            expect($button).to.be.visible
            expect($button).to.have.css("font-family",  '"Helvetica Neue", Helvetica, Arial, sans-serif')
            expect($button).to.have.css("padding",  '8px 1.6px')
        })
        cy.get('.medium-device > :nth-child(2)').contains('Dog Wash').click()
        cy.url().should('contain',  '/subServicesChoose/2?countryCode=AU') // verify the new url
        cy.get('.navbar').should('contain', 'Select Services - 2/4') // verify the page number
        // select then click the next button
        cy.get('.subServiceCheckbox > .form-check > .form-check-label')
        .contains('Cat Grooming')
        .click()
        cy.get(':nth-child(3) > :nth-child(2) > .next-btn > .btn').contains('Next').click()
    })  

    it('test the form', () => {
        cy.get('.navbar').should('contain', 'Select Service - 1/4') 
        cy.get('.medium-device > :nth-child(2)').contains('Dog Wash').click()
        cy.url().should('contain',  '/subServicesChoose/2?countryCode=AU') // verify the new url
        cy.get('.navbar').should('contain', 'Select Services - 2/4')
        cy.get('.subServiceCheckbox > .form-check > .form-check-label')
        .contains('Cat Grooming')
        .click()
        cy.get(':nth-child(3) > :nth-child(2) > .next-btn > .btn').contains('Next').click()
        cy.get('.progress-bar').should('have.css', 'width', '688.09375px')
        // check all required fields
        // cy.get('.next-btn').click()
        // cy.get('label[for="firstName"] > span[class="error"]').contains("Enter first name.").should('be.visible')
        cy.get('input[id=firstName]')
        .type('johnny', {force: true})
        .should('have.attr', 'required')

        cy.get('.next-btn').click()
        cy.get('.card-body').scrollTo('top', {ensureScrollable: false}     )
        cy.get('label[for="phoneNumber"] > span[class="error"]').contains("Invalid phone number.").should('be.visible')
        cy.get('label[for="emailAddress"] > span[class="error"]').contains("Enter email address.").should('be.visible')

        cy.get('#lastName').type('Bravo').should('have.value', 'Bravo')
        cy.get('#phoneNumber').type('0000000000').should('have.value', '0000000000')
        cy.get('#emailAddress').type('johnyBravo{enter}')
        cy.get('.next-btn').click()
        cy.get('.w-100 > .error').contains("Invalid email address.").should('be.visible')
        cy.get('.w-100 > .error').contains("Invalid phone number.").should('be.visible')
        cy.get('#emailAddress').clear().type('johnyBravo@email.com{enter}').should('have.value', 'johnyBravo@email.com')

        cy.get(':nth-child(7) > :nth-child(1) > :nth-child(1)').should('contain', "Are you or anybody in the household currently unwell?")
        cy.get(':nth-child(7) > :nth-child(1) > :nth-child(2)').contains('Yes').click()
        cy.get('textarea[type="text"]').type('Testing only', {force: true})
        cy.get('input[type="checkbox"]').should('be.checked') // Remind me is checked as default
        cy.get('.next-btn').contains('Complete').should('be.visible')
    })
})

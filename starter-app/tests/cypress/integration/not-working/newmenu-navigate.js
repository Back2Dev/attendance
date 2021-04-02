Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are using
  return false
})

describe('goes to the new platform menu and navigates to different webpages', () => {
  it('goes to the new platform homepage', () => {
    cy.visit('/login')

    cy.get('#signup-nav-item').should('exist').click()

    // logs in to the new platform
    cy.get('#login-nav-item').click()

    cy.get('h1').contains('Log in')

    cy.get('.MuiFormHelperText-root > .MuiTypography-root')
      .contains('Forgot your password')
      .click()

    cy.get('#login-nav-item').click()

    cy.get('[data-cy=email-input] > .MuiInputBase-root > .MuiInputBase-input').type(
      'super.mario@mario.com'
    )

    cy.get('[data-cy=password-input] > .MuiInputBase-root > .MuiInputBase-input')
      .clear()
      .type('i-like-turTles-27')

    cy.get('[data-cy=login-btn]').contains('Sign in').click()

    cy.get('.MuiTypography-alignCenter').contains('Welcome').should('exist')

    cy.get('[data-cy=add-btn]').contains('Add property').should('exist')

    cy.get('button[type="button"]').contains('Invite user').should('exist')

    cy.get('#properties-nav-item').click()

    cy.get('h4').contains('Listings').should('exist')

    // cy.get('.MuiToolbar-root > [href="/"]').click()

    //clicks on the user avatar and goes to the profile page
    cy.get(
      '[data-cy=primary-search-account-menu] > .MuiIconButton-label > .MuiAvatar-root'
    ).click()
    cy.get(
      '#primary-search-account-menu > .MuiPaper-root > .MuiList-root > a.MuiButtonBase-root'
    )
      .should('exist')
      .click()
    cy.get('.MuiTypography-h1').contains('User account').should('exist')

    cy.get('#scrollable-auto-tab-1').contains('Password').click()

    cy.get('h5').contains('Change your password').should('exist')

    cy.get('#scrollable-auto-tab-2').contains('Photo').should('exist').click()

    //checks if the script is on the avatar tab in the user preferences
    cy.get(':nth-child(3) > label > .MuiButtonBase-root')
      .contains('Upload')
      .should('exist')

    // goes to the signature tab on user preferences
    cy.get('#scrollable-auto-tab-3').contains('Signature').click()

    //checks if the script is on the signature tab on the user preferences page
    cy.get('h6').contains('Editing')

    //settle easy logo button
    cy.get('.MuiToolbar-root > [href="/"]').should('exist').click()

    cy.get('#support-nav-item').click()

    cy.get('.MuiTypography-h1').contains('Contact the support team').should('exist')

    cy.get('#dashboard-nav-item').click()

    //clicks the side bar button
    cy.get('.MuiToolbar-root > :nth-child(1)').click()
    cy.get('#admin-menu-subheader').contains('Admin Menu')
    //hacks dropdown
    cy.get('.makeStyles-sideDrawer-74 > :nth-child(3)').contains('Hacks').click()

    //email button
    cy.get('[href="/hacks/transporter"] > .MuiButtonBase-root')
      .contains('Messages')
      .click()
    cy.get('h2').contains('Messages')

    // clicks the side bar button
    cy.get('.MuiToolbar-root > :nth-child(1)').click()
    //hacks dropdown
    cy.get('.makeStyles-sideDrawer-47 > :nth-child(2) > .MuiButtonBase-root')
      .contains('Hacks')
      .click()

    // workflows
    cy.get('div').contains('Workflows').click()

    // cy.get('h2').contains('Workflows')

    cy.get('.tabulator-table > :nth-child(1) > [tabulator-field="name"]')
      .contains('NSW Buying')
      .should('exist')

    cy.get(
      '[data-cy=adm-drawer] > .MuiIconButton-label > .MuiSvgIcon-root > path'
    ).click()
    //hacks dropdown
    cy.get('.makeStyles-sideDrawer-47 > :nth-child(2) > .MuiButtonBase-root')
      .contains('Hacks')
      .click()
    // launch
    cy.get('div').contains('Launch').click()
    cy.get('h1').contains('Job launcher page')
    // clicks the side bar button
    cy.get('.MuiToolbar-root > :nth-child(1)').click()

    // //hacks dropdown
    // cy.get('.makeStyles-sideDrawer-47 > :nth-child(2) > .MuiButtonBase-root')
    //   .contains('Hacks')
    //   .click()

    // // clicks the side bar button
    // cy.get('.MuiToolbar-root > :nth-child(1)').click()
    // //hacks dropdown

    cy.get('.makeStyles-sideDrawer-47 > :nth-child(2) > .MuiButtonBase-root')
      .contains('Hacks')
      .click()
    //notes
    cy.get('[href="/hacks/notes"] > .MuiButtonBase-root > .MuiListItemText-root')
      .contains('Notes')
      .click()

    cy.get('.MuiGrid-root > :nth-child(1) > :nth-child(2)')
      .contains('No data found')
      .should('exist')

    // // clicks the side bar button
    // cy.get(
    //   '[data-cy=adm-drawer] > .MuiIconButton-label > .MuiSvgIcon-root > path'
    // ).click()
    // //hacks dropdown
    // cy.get('.makeStyles-sideDrawer-47 > :nth-child(2) > .MuiButtonBase-root')
    //   .contains('Hacks')
    //   .click()
    // cy.get('[href="/hacks/aws"] > .MuiButtonBase-root').contains('AWS').click()

    // clicks the side bar button
    cy.get(
      '[data-cy=adm-drawer] > .MuiIconButton-label > .MuiSvgIcon-root > path'
    ).click()
    //hacks dropdown
    cy.get('.makeStyles-sideDrawer-47 > :nth-child(2) > .MuiButtonBase-root')
      .contains('Hacks')
      .click()
    cy.get('[href="/hacks/voi"] > .MuiButtonBase-root')
      .contains('VOI')
      .should('exist')
      .click()

    // clicks the side bar button
    cy.get('.MuiToolbar-root > :nth-child(1)').click()
    //hacks dropdown
    cy.get('.makeStyles-sideDrawer-47 > :nth-child(2) > .MuiButtonBase-root')
      .contains('Hacks')
      .click()
    cy.get('[href="/hacks/timeline"] > .MuiButtonBase-root > .MuiListItemText-root')
      .should('exist')
      .click()
    cy.get('h3').contains('Notifications page')
    // clicks the side bar button
    cy.get('.MuiToolbar-root > :nth-child(1)').click()

    // old code
    // cy.get('.makeStyles-sideDrawer-47 > :nth-child(2) > .MuiButtonBase-root')
    //   .contains('Hacks')
    //   .click()

    // cy.get('[href="/hacks/releases"] >.MuiButtonBase-root > .MuiListItemText-root')
    //   .contains('Release notes')
    //   .click()

    // cy.get('.MuiToolbar-root > :nth-child(1)').click()

    // clicks the admin dropdown
    cy.get('.makeStyles-sideDrawer-47 > :nth-child(3)')
      .contains('Admin')
      .should('exist')
      .click()
    // gets and clicks the listings button
    cy.get(
      ':nth-child(3) > .MuiCollapse-container > .MuiCollapse-wrapper > .MuiCollapse-wrapperInner > .MuiList-root > [href="/admin/listings"] > .MuiButtonBase-root'
    )
      .contains('Listings')
      .click()

    cy.get('.MuiToolbar-root > :nth-child(1)').click()

    cy.get('.makeStyles-sideDrawer-47 > :nth-child(3) > .MuiButtonBase-root')
      .contains('Admin')
      .click()
    cy.get('[href="/admin/practices"] > .MuiButtonBase-root')
      .contains('Practices')
      .click()

    //checks if test script is on practices web page
    cy.get('.tabulator-row-odd > [tabulator-field="name"]')
      .contains('Settle Easy VIC')
      .should('exist')

    //sidebar
    cy.get(
      '.MuiToolbar-root > :nth-child(1) > .MuiIconButton-label > .MuiSvgIcon-root'
    ).click()

    cy.get('.makeStyles-sideDrawer-47 > :nth-child(3)').contains('Admin').click()

    cy.get('[href="/admin/settings"] > .MuiButtonBase-root > .MuiListItemText-root')
      .contains('Settings')
      .click()

    // checks if on settings page
    cy.get('h1').contains('Settings list').should('exist')

    // bad code

    // //side bar
    // cy.get(
    //   '.MuiToolbar-root > :nth-child(1) > .MuiIconButton-label > .MuiSvgIcon-root'
    // ).click()

    // cy.get('.makeStyles-sideDrawer-47 > :nth-child(3)').contains('Admin').click()

    // cy.get('[href="/reports"] > .MuiButtonBase-root > .MuiListItemText-root')
    //   .contains('Reports')
    //   .click()

    cy.get('[data-cy=adm-drawer]').should('exist').click()

    //admin dropdown
    cy.get('.makeStyles-sideDrawer-47 > :nth-child(3)').contains('Admin').click()

    cy.get('[href="/admin/users"] > .MuiButtonBase-root > .MuiListItemText-root')
      .contains('Users')
      .click()

    // checks if script is on users page
    cy.get('h1').contains('Account admin').should('exist')

    cy.get(
      '.MuiToolbar-root > :nth-child(1) > .MuiIconButton-label > .MuiSvgIcon-root'
    ).click()

    // gets and clicks api-admin button
    cy.get('.makeStyles-sideDrawer-47 > :nth-child(4) > :nth-child(1)')
      .contains('API Admin')
      .click()

    cy.get('[href="/api-admin/field-maps"] > .MuiButtonBase-root > .MuiListItemText-root')
      .contains('Field Mapping')
      .click()

    //  side bar
    cy.get('.MuiToolbar-root > :nth-child(1)').click()

    // gets and clicks api-admin button
    cy.get('.makeStyles-sideDrawer-47 > :nth-child(4) > :nth-child(1)')
      .contains('API Admin')
      .click()

    cy.get(
      '[href="/api-admin/listing-imports"] > .MuiButtonBase-root > .MuiListItemText-root'
    )
      .contains('Incoming')
      .click()
    //checks if script is on incoming page
    cy.get('h1').contains('Listings-imports').should('exist')

    // clicks the side bar button
    cy.get(
      '.MuiToolbar-root > :nth-child(1) > .MuiIconButton-label > .MuiSvgIcon-root'
    ).click()
    // gets and clicks the api-admin button

    cy.get('.makeStyles-sideDrawer-47 > :nth-child(4) > :nth-child(1)')
      .contains('API Admin')
      .click()

    cy.get(
      '[href="/api-admin/source-systems"] > .MuiButtonBase-root > .MuiListItemText-root'
    )
      .contains('Remote systems')
      .click()

    //checks if script is on source systems page
    cy.get('h1').contains('Source Systems').should('exist')

    // side bar button
    cy.get(
      '.MuiToolbar-root > :nth-child(1) > .MuiIconButton-label > .MuiSvgIcon-root > path'
    ).click()

    // gets and clicks the api-admin button
    cy.get('.makeStyles-sideDrawer-47 > :nth-child(4) > :nth-child(1)')
      .contains('API Admin')
      .click()

    cy.get('[href="/api-admin/webhooks"] > .MuiButtonBase-root > .MuiListItemText-root')
      .contains('Webhooks')
      .click()

    //checks if script is on webhooks page
    cy.get('h1').contains('Webhooks list').should('exist')
  })
})

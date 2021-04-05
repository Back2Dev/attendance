import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import { CssBaseline, Container } from '@material-ui/core'

import Header from '/imports/ui/components/header'
import Footer from '/imports/ui/components/footer'
export default function DefaultLayout({ children }) {
  return (
    <div className="default-layout">
      <CssBaseline />
      <Header />
      <Container maxWidth={false} disableGutters>
        {children}
      </Container>
      {/* <Footer /> */}
    </div>
  )
}

DefaultLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

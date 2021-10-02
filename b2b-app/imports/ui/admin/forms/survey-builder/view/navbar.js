import React from 'react'
import PropTypes from 'prop-types'
import { Button, Grid, Typography } from '@material-ui/core'
import { styled } from '@material-ui/styles'
import { compose, typography, palette, sizing, spacing } from '@material-ui/system'
import debug from 'debug'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'

const log = debug('builder:navbar')
const StyledGrid = styled(Grid)(compose(typography, palette, sizing, spacing))

const StyledNavButton = styled(Button)(({ align = 'center' }) => ({
  '& .MuiButton-label': {
    justifyContent: { left: 'flex-start', center: 'center', right: 'flex-end' }[align],
    textTransform: 'capitalize',
  },
}))

const Label = styled(Typography)({
  textTransform: 'capitalize',
})

const Navbar = ({ left, middle, right, onBack, backTitle }) => {
  const renderLeft = () => {
    if (left) {
      return left
    }

    if (onBack) {
      return (
        <Navbar.Button startIcon={<ArrowBackIosIcon />} onClick={onBack} align="left">
          {backTitle}
        </Navbar.Button>
      )
    }
  }

  return (
    <StyledGrid container alignItems="center" bgcolor="grey.100" height={46}>
      <StyledGrid item xs textAlign="left">
        {renderLeft()}
      </StyledGrid>
      <StyledGrid item xs textAlign="center">
        {middle && typeof middle === 'string' ? <Label>{middle}</Label> : middle}
      </StyledGrid>
      <StyledGrid item xs textAlign="right">
        {right}
      </StyledGrid>
    </StyledGrid>
  )
}

Navbar.propTypes = {
  left: PropTypes.node,
  middle: PropTypes.node,
  right: PropTypes.node,
  onBack: PropTypes.func,
  backTitle: PropTypes.string,
}

Navbar.Button = ({ align, startIcon, children, onClick }) => {
  return (
    <StyledNavButton
      size="large"
      color="primary"
      fullWidth
      disableRipple
      disableFocusRipple
      startIcon={startIcon}
      onClick={onClick}
      align={align}
    >
      <Label>{children}</Label>
    </StyledNavButton>
  )
}

Navbar.Button.propTypes = {
  align: PropTypes.oneOf(['left', 'center', 'right']),
  startIcon: PropTypes.element,
  children: PropTypes.node,
  onClick: PropTypes.func,
}

Navbar.Button.displayName = 'Navbar.Button'

export default Navbar

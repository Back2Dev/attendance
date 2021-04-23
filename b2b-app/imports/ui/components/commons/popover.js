import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Popover } from '@material-ui/core'

const StyledPopoverUtil = styled.div``
const StyledPopover = styled.div`
  padding: 5px 10px;
`

function PopoverUtil({
  children,
  popContent,
  anchorOrigin,
  transformOrigin,
  showOnHover,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = (e) => {
    e.preventDefault()
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  return (
    <StyledPopoverUtil>
      <div
        onClick={handlePopoverOpen}
        onMouseEnter={(e) => {
          if (showOnHover) {
            handlePopoverOpen(e)
          }
        }}
        onMouseLeave={(e) => {
          if (showOnHover) {
            console.log('mouse leave')
            handlePopoverClose(e)
          }
        }}
      >
        {children}
      </div>
      <Popover
        className="popover"
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        onClose={handlePopoverClose}
        disableRestoreFocus
        style={{ pointerEvents: 'none' }}
      >
        <StyledPopover>{popContent}</StyledPopover>
      </Popover>
    </StyledPopoverUtil>
  )
}

PopoverUtil.propTypes = {
  children: PropTypes.node.isRequired,
  popContent: PropTypes.node.isRequired,
  anchorOrigin: PropTypes.shape({
    vertical: PropTypes.string,
    horizontal: PropTypes.string,
  }),
  transformOrigin: PropTypes.shape({
    vertical: PropTypes.string,
    horizontal: PropTypes.string,
  }),
  showOnHover: PropTypes.bool,
}

PopoverUtil.defaultProps = {
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'left',
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'left',
  },
  showOnHover: true,
}

export default PopoverUtil

import React from 'react'
import styled from 'styled-components'

import PopoverUtil from '/imports/ui/components/commons/popover.js'
import CONSTANTS from '/imports/api/constants.js'

const StyledBadge = styled.div`
  float: left;
  margin: 10px;
  img {
    height: 50px;
  }
`

function Badges({ badges = [] }) {
  if (!badges || !badges.length) {
    return null
  }

  const renderBadge = (item) => {
    const theBadge = CONSTANTS.BADGES.find((elm) => elm.code === item.code)
    if (!theBadge) {
      return null
    }
    return (
      <StyledBadge key={theBadge.code} className={`badge ${theBadge.code}`}>
        <PopoverUtil popContent={theBadge.title}>
          <img src={theBadge.icon} alt={theBadge.title} />
        </PopoverUtil>
      </StyledBadge>
    )
  }

  return badges.map((item) => renderBadge(item))
}

export default Badges

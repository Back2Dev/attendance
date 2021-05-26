import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Link as RouterLink } from 'react-router-dom'

import { Link } from '@material-ui/core'

import CONSTANTS from '/imports/api/constants'

const StyledAvatar = styled.div`
  border-radius: 50%;
  border: 2px solid #44120029;
  overflow: hidden;
  box-sizing: content-box;
  display: inline-block;
  img {
    width: 100%;
    height: 100%;
  }
  svg {
    width: 100%;
    height: 100%;
  }
`
/**
 * Display avatar
 * if url or alt were not available then display an account icon
 * @param {string} url - the url of the avatar image
 * @param {string} alt - the alt of the avatar image, should be user's name
 * @param {number} size - the size of image
 * @param {Object} styles - custom styles applied to the container
 */
const Avatar = ({ url = null, alt = null, size = 80, styles = {}, linkUrl = null }) => {
  const style = {
    width: size,
    height: size,
    minWidth: size,
    minHeight: size,
    ...styles,
  }

  const renderImage = () => {
    if (url && alt) {
      let realUrl = url
      const patt = /^http/
      if (!patt.test(url)) {
        realUrl = `/images/avatars/${url}`
      }
      return <img loading="lazy" className="avatar-image" src={realUrl} alt={alt} />
    }

    return (
      <img
        loading="lazy"
        className="avatar-image"
        src={CONSTANTS.DEFAULT_AVATAR}
        alt="no-avatar"
      />
    )
  }

  if (linkUrl) {
    return (
      <StyledAvatar className="avatar" style={style}>
        <Link component={RouterLink} to={linkUrl}>
          {renderImage()}
        </Link>
      </StyledAvatar>
    )
  }

  return (
    <StyledAvatar className="avatar" style={style}>
      {renderImage()}
    </StyledAvatar>
  )
}

Avatar.propTypes = {
  url: PropTypes.string,
  alt: PropTypes.string,
  size: PropTypes.number,
  styles: PropTypes.object,
  linkUrl: PropTypes.string,
}

Avatar.defaultProps = {
  url: null,
  alt: null,
  size: 80,
  styles: {},
  linkUrl: null,
}

export default Avatar

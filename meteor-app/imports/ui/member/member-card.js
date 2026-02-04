import React from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Stack,
  Typography
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import SchoolIcon from '@mui/icons-material/School'
import StarHalfIcon from '@mui/icons-material/StarHalf'
import StarIcon from '@mui/icons-material/Star'
import { humaniseDate } from '/imports/helpers/dates'
import '/imports/ui/member/member-card.css'

const colorMap = {
  orange: 'warning',
  green: 'success',
  blue: 'info',
  red: 'error',
  grey: 'default'
}

const iconMap = {
  student: SchoolIcon,
  trophy: EmojiEventsIcon,
  'star half full': StarHalfIcon,
  star: StarIcon,
  check: CheckCircleIcon
}

const getIcon = icon => {
  const IconComponent = iconMap[icon] || StarIcon
  return <IconComponent fontSize="small" />
}

const MyBadge = props => {
  const color = colorMap[props.color] || 'warning'
  if (!props.content)
    return (
      <IconButton size="small" color={color} aria-label={props.icon || 'badge'}>
        {getIcon(props.icon)}
      </IconButton>
    )
  return (
    <Chip
      size="small"
      icon={getIcon(props.icon)}
      label={props.content}
      color={color}
      variant="outlined"
    />
  )
}
const MemberCard = props => {
  const {
    _id,
    name,
    avatar,
    isSuper,
    list,
    isHere,
    sessionCount,
    subsType,
    wwccOk,
    isSlsa,
    remaining,
    sessions = [],
    lastIn = null,
    status,
    expiry
  } = props
  const rookie = sessionCount <= 5
  const isExpired = status === 'expired'

  const subsColor = isExpired ? 'error' : 'warning'
  const togo = subsType === 'pass' ? `(${remaining})` : ''
  const expiryText = props.expiry ? moment(props.expiry).format('DD/MM/YY') : ''
  return (
    <Card
      className={`member-card ${props.className || ''}`}
      key={_id}
      sx={{ textAlign: 'center', position: 'relative' }}
    >
      <CardMedia
        component="img"
        image={`/images/avatars/${avatar}`}
        alt={name}
        sx={{ opacity: isExpired ? 0.25 : 1 }}
      />
      {isSuper && (
        <Box sx={{ position: 'absolute', top: 8, left: 8 }}>
          <SchoolIcon color="warning" fontSize="small" />
        </Box>
      )}
      {wwccOk && (
        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
          <CheckCircleIcon color="success" fontSize="small" />
        </Box>
      )}
      <CardContent>
        <Typography variant="subtitle1" component="div">
          {isSlsa && (
            <Box
              component="img"
              src="/images/slsa.png"
              alt="Surf Life Saving"
              sx={{ width: 25, verticalAlign: 'middle', mr: 0.5 }}
            />
          )}
          {name}
        </Typography>
        {isExpired && (
          <Typography variant="caption" color="error">
            (expired {expiryText})
          </Typography>
        )}

        <Stack direction="row" spacing={1} sx={{ py: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Chip
            size="small"
            color={rookie ? 'success' : isSuper ? 'warning' : 'info'}
            icon={rookie ? <StarHalfIcon fontSize="small" /> : <EmojiEventsIcon fontSize="small" />}
            label={sessionCount}
          />
          {rookie && <Chip size="small" color="success" label="rookie" />}
          {props.subsType && (
            <Chip size="small" color={subsColor} label={`${props.subsType} ${togo}`.trim()} />
          )}
          {props.badges && props.badges.map(badge => <MyBadge key={`${_id}-${badge.icon}-${badge.content || ''}`} {...badge} />)}
        </Stack>
        <Box>{props.children}</Box>
      </CardContent>
      {lastIn && (
        <CardContent sx={{ pt: 0 }}>
          <Typography variant="body2" color="text.secondary">
            {isHere ? 'Arrived:' : 'Last Seen'} {humaniseDate(lastIn)} ago
          </Typography>
        </CardContent>
      )}
    </Card>
  )
}

MemberCard.propTypes = {
  className: PropTypes.string,
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  isHere: PropTypes.bool.isRequired,
  sessions: PropTypes.array.isRequired,
  lastIn: PropTypes.object,
  sessionCount: PropTypes.number.isRequired
}

export default MemberCard

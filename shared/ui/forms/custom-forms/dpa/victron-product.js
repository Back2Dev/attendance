import React from 'react'
import { styled } from '@mui/material/styles'
import { capitalCase } from 'change-case'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import Box from '@mui/material/Box'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import CheckIcon from '@mui/icons-material/Check'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Typography from '@mui/material/Typography'

const sampleData = {
  dealer: {
    address: '4/273 Williamstown Rd, 3207, PORT MELBOURNE, AU ',
    email: 'purchasing@dpasolar.com.au',
    id: 783,
    name: 'DPA Energy Pty Ltd',
    phone: '+61-396961119',
    serial_number: 'HQ2049YREN5',
    sku: 'CEP121621000',
    support_request_phone_numbers: '+61-396961119',
    warranty_period_years: 5,
    warranty_until: '2026-03-26',
    website: 'http://dpasolar.com.au',
  },
  image: {
    id: 932,
    url: 'https://www.victronenergy.com/upload/products/EasySolar%20%282023%29.png',
    thumbnail_url:
      'https://www.victronenergy.com/upload/products/thumbnail_EasySolar%20%282023%29.png',
  },
  is_eol: false,
  name: 'EasySolar',
  short_name: 'EasySolar',
  url: 'https://www.victronenergy.com/inverters-chargers/easysolar',
  with_victron_connect: false,
}

const ExpandMore = styled((props) => {
  const { expand, ...other } = props
  return <IconButton {...other} />
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}))

const ProductCard = ({ name, is_eol, short_name, url, image, dealer }) => {
  const [expanded, setExpanded] = React.useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }
  const fields = 'address email phone website'.split(/\s+/)
  const isDPA = dealer.name.match(/DPA/i)
  return (
    <Card sx={{ maxWidth: 345, marginTop: '6px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardHeader
          avatar={<img src={image?.thumbnail_url} alt={name} />}
          title={`${short_name} ${dealer.sku}`}
          subheader={`Warranty until: ${dealer?.warranty_until}`}
        />

        <CardContent>
          {isDPA && (
            <Typography variant="h4" color="text.secondary">
              Dealer: {dealer.name} <CheckIcon />
            </Typography>
          )}
        </CardContent>
        {!isDPA && (
          <CardActions disableSpacing>
            <Typography variant="h4" color="text.secondary">
              Dealer: {dealer.name}
            </Typography>
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </CardActions>
        )}
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography variant="h4">Dealer information</Typography>
            <hr />
            {fields.map((f) => {
              let link = dealer[f]
              switch (f) {
                case 'website':
                  link = <a href="{dealer[f]}">{dealer[f]}</a>
                  break
                case 'email':
                  link = <a href="mailto:{dealer[f]}">{dealer[f]}</a>
                  break
              }
              return (
                <p>
                  {capitalCase(f)}: {link}
                </p>
              )
            })}
          </CardContent>
        </Collapse>
      </Box>
    </Card>
  )
}

export default ProductCard

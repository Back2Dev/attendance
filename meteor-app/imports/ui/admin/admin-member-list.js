import PropTypes from 'prop-types'
import React from 'react'
import { Avatar, Box, Button, Stack, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import ChildCareIcon from '@mui/icons-material/ChildCare'
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety'
import './admin-member-list.css'
import { shorten_name } from '/imports/api/utils'
import CartList from './cart-list'
import PurchaseList from './purchase-list'
import { expires, humaniseDate, isPast } from '/imports/helpers/dates'

const debug = require('debug')('b2b:admin')

const Admin = (props) => {
  const [showCarts, setCart] = React.useState(false)
  const { members, carts, purchases, removeCart } = props

  const memberClick = (id) => {
    debug(`memberClick(${id})`)
    props.history.push(`/admin/userprofiles/${id}`)
  }

  const rows = members.map((member) => {
    const memberCarts = carts.filter((cart) => cart.memberId === member._id)
    const memberPurchases = purchases.filter((purchase) => purchase.memberId === member._id)
    return {
      id: member._id,
      member,
      memberCarts,
      memberPurchases
    }
  })

  const columns = [
    {
      field: 'member',
      headerName: 'Member',
      flex: 1,
      minWidth: 320,
      sortable: false,
      renderCell: (params) => {
        const member = params.value
        const expired = isPast(member.expiry)
        return (
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              src={`/images/avatars/${member.avatar}`}
              alt={member.name}
              sx={{ cursor: 'pointer', border: '3px solid white' }}
              onClick={() => memberClick(member._id)}
            />
            <Box onClick={() => memberClick(member._id)} sx={{ cursor: 'pointer' }}>
              <Typography variant="subtitle1">{shorten_name(member.name)}</Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 0.5 }}>
                {member.paymentCustId && <CreditCardIcon color="success" fontSize="small" />}
                {member.wwccOk && <ChildCareIcon color="success" fontSize="small" />}
                {member.isSlsa && <HealthAndSafetyIcon color="success" fontSize="small" />}
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {member.isHere ? 'Arrived:' : 'Last Seen'} {humaniseDate(member.lastIn)} ago
              </Typography>
              <Typography variant="body2" sx={{ color: expired ? 'error.main' : 'text.primary' }}>
                {member.subsType} {expires(member.expiry)}
              </Typography>
            </Box>
          </Stack>
        )
      }
    },
    {
      field: 'memberPurchases',
      headerName: 'Purchases',
      flex: 1,
      minWidth: 260,
      sortable: false,
      renderCell: (params) => {
        const list = params.value || []
        if (!list.length) return <Typography variant="body2">No previous purchases</Typography>
        return <PurchaseList purchases={list} />
      }
    },
    ...(showCarts
      ? [
          {
            field: 'memberCarts',
            headerName: 'Carts',
            flex: 1,
            minWidth: 280,
            sortable: false,
            renderCell: (params) => <CartList carts={params.value || []} removeCart={removeCart} />
          }
        ]
      : []),
    {
      field: 'actions',
      headerName: 'Actions',
      minWidth: 220,
      sortable: false,
      renderCell: (params) => {
        const member = params.row.member
        return (
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              color="primary"
              onClick={(e) => {
                e.preventDefault()
                props.addProduct(member._id, member.name)
              }}
            >
              Add...
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={(e) => {
                e.preventDefault()
                props.removeMember(member._id)
              }}
            >
              Delete
            </Button>
          </Stack>
        )
      }
    }
  ]

  return (
    <Box sx={{ width: '100%' }} data-testid="members-list">
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
        <Button
          size="small"
          variant="outlined"
          onClick={() => setCart(!showCarts)}
        >
          {showCarts ? 'Hide carts' : 'Show carts'}
        </Button>
      </Box>
      <DataGrid
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        autoHeight
        getRowHeight={() => 'auto'}
        sx={{
          '& .MuiDataGrid-cell': { py: 1, alignItems: 'flex-start' },
          '& .MuiDataGrid-row': { maxHeight: 'none' }
        }}
      />
    </Box>
  )
}

Admin.propTypes = {
  members: PropTypes.array.isRequired,
  carts: PropTypes.array.isRequired,
  purchases: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  removeMember: PropTypes.func.isRequired,
  extendMember: PropTypes.func.isRequired,
  removeCart: PropTypes.func.isRequired,
  addProduct: PropTypes.func.isRequired,
}

export default Admin

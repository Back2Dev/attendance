import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import makeStyles from '@mui/styles/makeStyles';
import Paper from '@mui/material/Paper'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import Input from '@mui/material/Input'
import SearchIcon from '@mui/icons-material/Search'
import UserTable from './components/user-table.js'
import { obj2Search } from '/imports/api/util'

const debug = require('debug')('app:user-admin')

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '36px',
    marginBottom: '36px',
  },
  paper: {
    padding: '20px 50px',
  },
}))

const ListUsers = (props) => {
  const [users, setUsers] = useState([])
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')

  const classes = useStyles()

  useEffect(() => {
    const results = props.userMembers?.filter((doc) => {
      const string = obj2Search(doc)
      return string.toLowerCase().includes(search.toLowerCase())
    })
    setUsers(results)
  }, [search])

  const handleSearch = (e) => {
    setSearch(e.target.value)
  }

  const searchField = () => {
    return (
      <FormControl className={classes.searchField}>
        <InputLabel htmlFor="standard-adornment-password">Search</InputLabel>
        <Input
          id="standard-adornment-password"
          value={search}
          onChange={handleSearch}
          endAdornment={
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          }
          variant="outlined"
        />
      </FormControl>
    )
  }

  return (
    <Container maxWidth="lg" className={classes.root}>
      <Paper className={classes.paper} elevation={5}>
        <Typography variant="h1">Edit users</Typography>
        {searchField()}
        <UserTable
          users={users}
          selected={selected}
          setSelected={setSelected}
          search={search}
        />
      </Paper>
    </Container>
  )
}

ListUsers.propTypes = {
  userMembers: PropTypes.array.isRequired,
}

export default ListUsers

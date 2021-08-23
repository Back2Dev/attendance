import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import 'react-tabulator/lib/styles.css'
import 'react-tabulator/lib/css/materialize/tabulator_materialize.min.css'
import { ReactTabulator } from 'react-tabulator'
import CONSTANTS from '/imports/api/constants'
import { showSuccess, showInfo, showError } from '/imports/ui/utils/toast-alerts'
import AddUser from '/imports/ui/components/add-user'
import { TabAppbar } from '/imports/ui/utils/generic'
import Container from '@material-ui/core/Container'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import Input from '@material-ui/core/Input'
import InputBase from '@material-ui/core/InputBase'
import SearchIcon from '@material-ui/icons/Search'
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
      <Paper className={classes.paper}>
        <Typography variant="h1">Edit users</Typography>
        {searchField()}
        <Grid container spacing={3}>
          <Grid item md={12}>
            <UserTable
              users={users}
              selected={selected}
              setSelected={setSelected}
              search={search}
            />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  )
}

ListUsers.propTypes = {
  userMembers: PropTypes.array.isRequired,
}

export default ListUsers

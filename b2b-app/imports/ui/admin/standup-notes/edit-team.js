import React from 'react'
import { Button } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import DataGrid from 'react-data-grid'

const columns = [
  {
    field: 'firstName',
    headerName: 'First name',
    width: 150,
    editable: true,
  },
  {
    field: 'handle',
    headerName: 'Handle',
    width: 150,
    editable: true,
  },
  {
    field: 'joined',
    headerName: 'Joined',
    type: 'date',
    width: 110,
    editable: true,
  },
  {
    field: 'active',
    headerName: 'Active',
    width: 1,
    editable: true,
  },
  {
    field: 'delete',
    headerName: 'Delete',
    width: 1,
    editable: true,
  },
]

const rows = [
  {
    firstName: 'Mike King',
    handle: 'mikkel',
    joined: '1/02/2021',
    active: 'Y',
    delete: <Button>x</Button>,
  },
  {
    firstName: 'Patrick Carmelt',
    handle: 'pato',
    joined: '1/2/2021',
    active: 'Y',
    delete: <Button>x</Button>,
  },
  {
    firstName: 'Chris Tri',
    handle: 'ct',
    joined: '1/12/2021',
    active: 'N',
    delete: <Button>x</Button>,
  },
  {
    firstName: 'Minh Ngyuen',
    handle: 'minster',
    joined: '1/12/2021',
    active: 'Y',
    delete: <Button>x</Button>,
  },
]

const EditTeam = () => {
  return (
    <div>
      <h1>Edit Team </h1>
      <Typography
        variant="caption"
        component="div"
        gutterBottom
        style={{
          order: 0,
          alignContent: 'flex-start',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        Team name
      </Typography>

      {/* <Autocomplete
        id="team-input"
        freesolo
        options={['The dream team', 'Peaky Blinders', 'Gary and the pacemakers']}
        renderInput={(params) => (
          <TextField {...params} label="team name" margin="normal" variant="outlined" />
        )}
        style={{
          width: '180px',
          height: '70px',
          order: 10,
          alignSelf: 'flex-start',
          justifyContent: 'space-around',
        }}
      ></Autocomplete>

      <IconButton
        name="add-to-team"
        style={{
          width: '200px',
          height: '60px',
          order: 100,
          rowGap: '45px',
          columnGap: '23px',
          alignSelf: 'center',
          flexFlow: 'wrap-reverse',
          backgroundColor: 'magenta',
          justifyContent: 'space-around',
        }}
      >
        <AddIcon />
      </IconButton> */}

      <DataGrid
        rows={[]}
        columns={[]}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
      ></DataGrid>
    </div>
  )
}

export default EditTeam

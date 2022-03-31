import { Button } from '@material-ui/core'
import { DataGrid } from '@mui/x-data-grid'
import { rows, columns } from './edit-team.stories.js'
import IconButton from '@material-ui/core/IconButton'
import React from 'react'

const editTeam = () => {
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

      <Autocomplete
        id="team-input"
        freesolo
        options={['The dream team', 'Peaky Blinders', 'Gary and the pacemakers']}
        renderInput={(params) => (
          <TextField {...params} label="member name" margin="normal" variant="outlined" />
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
      </IconButton>

      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
      ></DataGrid>
    </div>
  )
}

export default editTeam

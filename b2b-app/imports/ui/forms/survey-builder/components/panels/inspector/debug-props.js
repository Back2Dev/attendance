import React from 'react'
import {
  useSelectedPartData,
  useSelectedPartValue,
} from '/imports/ui/forms/survey-builder/recoil/hooks'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles({
  root: {
    // minWidth: 275,
    overflowX: 'scroll',
  },

  title: {
    fontSize: 14,
  },
})

const DebugProps = () => {
  const classes = useStyles()
  const part = useSelectedPartData()
  const selectedPart = useSelectedPartValue()
  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography
          variant="h5"
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          Inspect part: {selectedPart}
        </Typography>

        <Typography variant="h5" component="pre" className={classes.title}>
          {JSON.stringify(part, null, 2)}
        </Typography>
      </CardContent>
    </Card>

    // <div style={{ overflowX: 'scroll' }}>
    //   Inspect part: {selectedPart}
    //   <pre>{JSON.stringify(part, null, 2)}</pre>
    // </div>
  )
}

export { DebugProps }

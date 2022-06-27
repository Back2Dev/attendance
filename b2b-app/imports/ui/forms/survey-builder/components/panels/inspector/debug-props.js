import React from 'react'
import {
  useSelectedPartData,
  useSelectedPartValue,
  usePartsValue,
} from '/imports/ui/forms/survey-builder/recoil/hooks'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
// import { EditorContext } from '/imports/ui/forms/framework/framework'
import Typography from '@material-ui/core/Typography'
import ReactJson from 'react-json-view'

const useStyles = makeStyles({
  root: {
    // minWidth: 275,
    overflowX: 'scroll',
  },

  title: {
    fontSize: 14,
  },
})

const jsonViewConfig = {
  displayDataTypes: false,
  quotesOnKeys: false,
}

const DebugProps = () => {
  const classes = useStyles()
  const part = useSelectedPartData()
  const selectedPart = useSelectedPartValue()
  // const editorCtx = useContext(EditorContext)
  const parts = usePartsValue()

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
          <ReactJson src={part || {}} {...jsonViewConfig} />
        </Typography>
      </CardContent>
    </Card>
  )
}

export { DebugProps }

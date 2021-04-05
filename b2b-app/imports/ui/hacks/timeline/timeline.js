import React from 'react'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import {
  Timeline,
  TimelineItem as MuiTimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
  TimelineDot,
} from '@material-ui/lab'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import BuildIcon from '@material-ui/icons/Build'
import timelineData from './timeline-data'

const TimelineItem = withStyles({
  missingOppositeContent: {
    '&:before': {
      display: 'none',
    },
  },
})(MuiTimelineItem)

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '20px 30px',
  },
  dot: {
    fontFamily: 'GothamRoundedMedium',
    textAlign: 'center',
    backgroundColor: '#4794fc',
    padding: '10px',
  },
}))

const MyTimeline = (props) => {
  const classes = useStyles()
  // <Timeline lineColor={'#ddd'}>
  //   {timelineData &&
  //     timelineData.map((item) => (
  //       <TimelineItem key={item.id} {...item}>
  //         {item.h3 && <h3>{item.h3}</h3>}
  //         {item.h4 && <h4>{item.h4}</h4>}
  //         {item.paragraphs && item.paragraphs.map((p) => <p>{p}</p>)}
  //         {item.markdown && <Markdown source={item.markdown} />}
  //       </TimelineItem>
  //     ))}
  // </Timeline>
  return (
    <Timeline classes={classes.timeline}>
      {timelineData &&
        timelineData.map((item) => (
          <TimelineItem key={item.id}>
            <TimelineSeparator>
              <TimelineDot className={classes.dot}>{item.dateText}</TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Paper elevation={3} className={classes.paper}>
                <Typography>
                  {item.markdown && (
                    <ReactMarkdown plugins={[gfm]}>{item.markdown}</ReactMarkdown>
                  )}
                </Typography>
              </Paper>
            </TimelineContent>
          </TimelineItem>
        ))}
    </Timeline>
  )
}

export default MyTimeline

import { Meteor } from 'meteor/meteor'
import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from 'react'
import PropTypes from 'prop-types'
import { useTracker } from 'meteor/react-meteor-data'

import { showError, showSuccess } from '/imports/ui/utils/toast-alerts.js'

import { AccountContext } from '/imports/ui/contexts/account-context.js'
import Events from '/imports/api/events/schema.js'
import Members from '/imports/api/members/schema.js'
import Sessions from '/imports/api/sessions/schema.js'
import Courses from '/imports/api/courses/schema.js'

export const BookingsContext = React.createContext('bookings')

export const BookingsProvider = (props) => {
  const { children } = props

  const { member } = useContext(AccountContext)

  const mounted = useRef(true)
  useEffect(() => () => (mounted.current = false), [])

  // const [ids, setIds] = useState({ eventIds: [], coachIds: [], courseIds: [] })

  const [eventsWithExtraData, setEventsWithExtraData] = useState([])

  const getCoachByCoachId = (coachId) => {
    return Members.findOne({ _id: coachId })
  }

  const getCourseByCourseId = (courseId) => {
    return Courses.findOne({ _id: courseId })
  }

  const getMySessionByEventId = (eventId) => {
    return Sessions.findOne({
      memberId: member?._id,
      eventId,
    })
  }

  const { loading, events } = useTracker(() => {
    // console.log('subscribe future.events')
    const sub = Meteor.subscribe('future.events')
    return {
      loading: !sub.ready(),
      events: Events.find({ active: true, when: { $gt: new Date() } }).fetch(),
    }
  }, [])

  const { eventIds, coachIds, courseIds } = useMemo(() => {
    const newEventIds = []
    const newCoachIds = []
    const newCourseIds = []
    events.map((item) => {
      if (!newEventIds.includes(item._id)) {
        newEventIds.push(item._id)
      }
      if (!newCoachIds.includes(item.coachId)) {
        newCoachIds.push(item.coachId)
      }
      if (!newCourseIds.includes(item.courseId)) {
        newCourseIds.push(item.courseId)
      }
      if (item.backupCourseId && !newCourseIds.includes(item.backupCourseId)) {
        newCourseIds.push(item.backupCourseId)
      }
    })
    return {
      eventIds: newEventIds,
      coachIds: newCoachIds,
      courseIds: newCourseIds,
    }
  }, [events.length ? events : null])

  useEffect(() => {
    // console.log('coachIds changed', coachIds)
  }, [coachIds.length ? coachIds : null])

  const { loading: loadingCoaches, coaches = [] } = useTracker(() => {
    // console.log('subscribe members.byIds', coachIds)
    const sub = Meteor.subscribe('members.byIds', coachIds)
    return {
      loading: !sub.ready(),
      coaches: Members.find({ _id: { $in: coachIds } }).fetch(),
    }
  }, [coachIds.length ? coachIds : null])

  const { loading: loadingSessions, sessions = [] } = useTracker(() => {
    const sub = Meteor.subscribe('sessions.mineByEventIds', eventIds)
    return {
      loading: !sub.ready(),
      sessions: Sessions.find({ eventId: { $in: eventIds } }).fetch(),
    }
  }, [eventIds.length ? eventIds : null])

  const { loading: loadingCourses, courses = [] } = useTracker(() => {
    const sub = Meteor.subscribe('courses.byIds', courseIds)
    return {
      loading: !sub.ready(),
      courses: Courses.find({ _id: { $in: courseIds } }).fetch(),
    }
  }, [courseIds.length ? courseIds : null])

  const buildDataTimeout = useRef(null)
  useEffect(() => {
    Meteor.clearTimeout(buildDataTimeout.current)
    buildDataTimeout.current = Meteor.setTimeout(() => {
      // console.log('build eventsWithExtraData')
      setEventsWithExtraData(
        events?.map((item) => {
          return {
            ...item,
            coach: getCoachByCoachId(item.coachId),
            session: getMySessionByEventId(item._id),
            course: getCourseByCourseId(item.courseId),
            backupCourse: getCourseByCourseId(item.backupCourseId),
          }
        })
      )
    }, 100)
  }, [
    events.length ? events : null,
    courses.length ? courses : null,
    sessions.length ? sessions : null,
    coaches.length ? coaches : null,
  ])

  const [submiting, setSubmiting] = useState(false)
  // book action
  const book = ({ eventId, toolId }) => {
    setSubmiting(true)
    Meteor.call('book.events', { eventId, toolId }, (error, result) => {
      if (!mounted.current) {
        return
      }
      setSubmiting(false)
      if (error) {
        showError(error.message)
      }
      if (result) {
        if (result.status === 'success') {
          showSuccess('Event booked successfully')
        } else {
          showError(result.message || 'Unknown error')
        }
      }
    })
  }
  // cancel action
  const cancel = ({ sessionId }) => {
    setSubmiting(true)
    Meteor.call('cancel.events', { sessionId }, (error, result) => {
      if (!mounted.current) {
        return
      }
      setSubmiting(false)
      if (error) {
        showError(error.message)
      }
      if (result) {
        if (result.status === 'success') {
          showSuccess('Event booking cancelled successfully')
        } else {
          showError(result.message || 'Unknown error')
        }
      }
    })
  }

  return (
    <BookingsContext.Provider
      value={{
        loading,
        loadingCoaches,
        loadingSessions,
        loadingCourses,
        events: eventsWithExtraData,
        getCoachByCoachId,
        getMySessionByEventId,
        getCourseByCourseId,
        book,
        cancel,
        submiting,
      }}
    >
      {children}
    </BookingsContext.Provider>
  )
}

BookingsProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const BookingsConsumer = BookingsContext.Consumer

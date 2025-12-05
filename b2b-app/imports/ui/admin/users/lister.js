import React, { useMemo } from 'react'
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'
import LinearProgress from '@mui/material/LinearProgress'
import Members from '/imports/api/members/schema'
import ListUsers from './list'

export default function UsersContainer() {
  const { userMembers, loading } = useTracker(() => {
    const usersSubscription = Meteor.subscribe('getAllUsers', {
      onError: (err) => console.error('getAllUsers subscription error', err),
    })
    const members = Members.find({}).fetch()
    const users = Meteor.users.find({}).fetch()
    const merged = users.map((user) => ({
      ...user,
      ...members.find((member) => member.userId === user._id),
    }))
    return {
      userMembers: merged,
      loading: !usersSubscription.ready(),
    }
  }, [])

  const memoized = useMemo(
    () => ({ userMembers: userMembers || [], loading }),
    [userMembers, loading]
  )

  if (memoized.loading) return <LinearProgress />
  return <ListUsers {...memoized} />
}

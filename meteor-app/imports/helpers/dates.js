import moment from 'moment'

export function humaniseDate(lastIn) {
  const then = moment(lastIn)
  const now = moment(new Date())
  const hours = Math.floor(moment.duration(now.diff(then)).as('minutes'))
  return moment.duration(hours, 'minutes').humanize()
}

export function fromNow(when) {
  return moment(when).fromNow()
}

export function expires(when) {
  return `expire${moment().diff(when) < 0 ? 's' : 'd'} ${moment(when).fromNow()}`
}

export function isPast(when) {
  return moment().diff(when) > 0
}

export function humaniseDateDay(updatedAt) {
  const date = moment(updatedAt).format('dddd, MMMM Do YYYY, h a')
  return date
}
export function dateOnly(date) {
  return moment(date).format('DD/MM/YYYY')
}

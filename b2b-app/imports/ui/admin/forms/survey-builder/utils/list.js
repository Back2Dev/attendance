import { makeId } from './makeId'

const isValidIndex = (list, index) =>
  Number.isInteger(index) && index >= 0 && index < list.length

export const makeListItem = (value = {}) => ({ ...value, _id: makeId() })

const add = (list, value, index) => {
  if (index !== undefined && !isValidIndex(list, index)) {
    throw new TypeError('invalid index arg')
  }
  const l = [...list]
  l.splice(index === undefined ? list.length : index + 1, 0, makeListItem(value))
  return l
}

const update = (list, value, index) => {
  if (value === undefined || index === undefined) {
    throw new TypeError('value or index args missing')
  }
  if (!isValidIndex(list, index)) {
    throw new TypeError('invalid index arg')
  }
  return list.map((item, i) => (i === index ? value : item))
}

const move = (list, index, direction) => {
  if (index === undefined || direction === undefined) {
    throw new TypeError('index or direction arg missing')
  }
  if (!['up', 'down'].includes(direction)) {
    throw new TypeError('invalid direction arg')
  }
  if (!isValidIndex(list, index)) {
    throw new TypeError('invalid index arg')
  }

  if (
    (direction === 'up' && index === 0) ||
    (direction === 'down' && index === list.length - 1)
  ) {
    return list
  }

  const l = [...list]
  if (direction === 'up') {
    ;[l[index], l[index - 1]] = [l[index - 1], l[index]]
  }
  if (direction === 'down') {
    ;[l[index + 1], l[index]] = [l[index], l[index + 1]]
  }
  return l
}

const moveById = (list, id, direction) => {
  const l = [...list]
  const index = l.findIndex((v) => v._id === id)
  if (index === -1) {
    throw new TypeError('id not found')
  }
  return move(list, index, direction)
}

const remove = (list, index) => {
  if (index === undefined) {
    throw new TypeError('index arg missing')
  }
  if (!isValidIndex(list, index)) {
    throw new TypeError('invalid index arg')
  }
  return list.filter((_, i) => i !== index)
}

const removeById = (list, id) => {
  if (id === undefined) {
    throw new TypeError('id arg missing')
  }
  const index = list.findIndex((v) => v._id === id)
  if (index === -1) {
    throw new TypeError('id not found')
  }
  return remove(list, index)
}

const findById = (list, id) => {
  return list.find(({ _id }) => _id === id)
}

export { add, update, remove, removeById, move, moveById, findById }

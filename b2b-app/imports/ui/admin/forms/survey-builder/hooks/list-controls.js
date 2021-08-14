import { useState, useRef } from 'react'

const useListControls = (initialList = []) => {
  const id = useRef(0)
  const [list, setList] = useState(() => initialList.map((value) => makeItem(value)))

  function makeItem(value) {
    return { id: id.current++, value }
  }
  const isValidIndex = (index) =>
    Number.isInteger(index) && index >= 0 && index < list.length

  const add = (value, index) => {
    if (value === undefined) {
      throw new TypeError('value arg missing')
    }
    if (index !== undefined && !isValidIndex(index)) {
      throw new TypeError('invalid index arg')
    }
    const l = [...list]
    l.splice(index === undefined ? list.length : index + 1, 0, makeItem(value))
    setList(l)
  }

  const remove = (index) => {
    if (index === undefined) {
      throw new TypeError('index arg missing')
    }
    if (!isValidIndex(index)) {
      throw new TypeError('invalid index arg')
    }
    setList(list.filter((_, i) => i !== index))
  }

  const move = (index, direction) => {
    if (index === undefined || direction === undefined) {
      throw new TypeError('index or direction arg missing')
    }
    if (!['up', 'down'].includes(direction)) {
      throw new TypeError('invalid direction arg')
    }
    if (!isValidIndex(index)) {
      throw new TypeError('invalid index arg')
    }

    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === list.length - 1)
    ) {
      return
    }

    const l = [...list]
    if (direction === 'up') {
      ;[l[index], l[index - 1]] = [l[index - 1], l[index]]
    }
    if (direction === 'down') {
      ;[l[index + 1], l[index]] = [l[index], l[index + 1]]
    }
    setList(l)
  }

  const update = (value, index) => {
    if (value === undefined || index === undefined) {
      throw new TypeError('value or index args missing')
    }
    if (!isValidIndex(index)) {
      throw new TypeError('invalid index arg')
    }
    setList(list.map((item, i) => (i === index ? { ...item, value } : item)))
  }

  const values = list.map((item) => item.value)

  return { values, all: list, remove, add, update, move }
}

export default useListControls

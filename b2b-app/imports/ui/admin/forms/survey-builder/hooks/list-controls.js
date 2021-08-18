import { useRef, useCallback, useMemo } from 'react'
import { useRecoilState, atomFamily } from 'recoil'

let initDefault

export const listControlsState = atomFamily({
  key: 'listControls',
  default: () => initDefault(),
})

const useListControls = (stateId, initialList = []) => {
  const id = useRef(0)
  initDefault = useCallback(() => {
    return initialList?.length > 0 ? initialList.map((value) => makeItem(value)) : []
  }, [])
  const [list, setList] = useRecoilState(listControlsState(stateId))

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

  const removeById = (id) => {
    if (id === undefined) {
      throw new TypeError('id arg missing')
    }
    const index = list.findIndex((v) => v.id === id)
    if (index === -1) {
      throw new TypeError('id not found')
    }
    remove(index)
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

  const moveById = (id, direction) => {
    const l = [...list]
    const index = l.findIndex((v) => v.id === id)
    if (index === -1) {
      throw new TypeError('id not found')
    }
    move(index, direction)
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

  const values = useMemo(() => list.map((item) => item.value), [list])

  return { values, all: list, remove, add, update, move, removeById, moveById }
}

export default useListControls

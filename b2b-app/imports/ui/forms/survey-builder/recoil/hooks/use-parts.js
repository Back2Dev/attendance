import {
  useRecoilCallback,
  useRecoilState,
  useRecoilTransaction_UNSTABLE,
  useRecoilValue,
} from 'recoil'
import debug from 'debug'
import { list, makeId } from '../../utils'
import { partsAtom, partAtom, partAnswers, partGridColumns, partGridRows } from '../atoms'

const log = debug('builder:use-parts')

export const defaultPart = {
  prompt: 'new Question',
  type: 'single',
  answers: [{ name: '', _id: makeId() }],
}

export const usePartsValue = () => {
  return useRecoilValue(partsAtom)
}

export const usePartValue = (pid) => {
  return useRecoilValue(partAtom(pid))
}

export const useParts = () => {
  const addPart = useRecoilCallback(({ set }) => (index) => {
    const newPart = list.makeListItem(defaultPart)

    set(partsAtom, (parts) => {
      const l = [...parts]
      l.splice(index + 1, 0, newPart)

      return l
    })
    set(partAtom(newPart.pid), () => newPart)
  })

  const copyPart = useRecoilCallback(({ set, snapshot }) => (pid, index) => {
    const part = snapshot.getLoadable(partAtom(pid)).contents
    const newPart = list.makeListItem(part)

    set(partsAtom, (parts) => {
      const l = [...parts]
      l.splice(index + 1, 0, newPart)

      return l
    })
    set(partAtom(newPart.pid), () => newPart)
  })

  const removePart = useRecoilTransaction_UNSTABLE(({ set, reset, get }) => (pid) => {
    const atomState = partAtom(pid)
    reset(atomState)
    set(partsAtom, (parts) => list.removeById(parts, pid))
  })

  const movePart = useRecoilCallback(({ set }) => (id, direction) => {
    set(partsAtom, (parts) => list.moveById(parts, id, direction))
  })

  return { addPart, removePart, movePart, copyPart }
}

export const usePartsState = () => {
  return useRecoilState(partsAtom)
}

export const usePartAnswers = (pid) => {
  const [answers, setAnswers] = useRecoilState(partAnswers(pid))

  const add = (index) => {
    setAnswers(list.add(answers, defaultPart.answers[0], index))
  }

  const update = (value, index) => {
    setAnswers(list.update(answers, value, index))
  }

  const remove = (index) => {
    setAnswers(list.remove(answers, index))
  }

  return {
    all: answers,
    add,
    update,
    remove,
  }
}

export const getDefaultColumn = () => ({
  field: '',
  id: makeId(),
  width: 200,
  editable: true,
})
export const getDefaultRow = () => ({ id: makeId(), name: '' })

export const usePartGrid = (pid) => {
  const [columns, setColumns] = useRecoilState(partGridColumns(pid))
  const [rows, setRows] = useRecoilState(partGridRows(pid))

  const add = (list, value, index = list.length - 1) => {
    const l = [...list]
    l.splice(index + 1, 0, { ...value, id: makeId() })
    return l
  }

  const addColumn = (index) => {
    setColumns(add(columns, { ...getDefaultColumn() }, index))
  }

  const removeColumn = (index) => {
    setColumns(list.remove(columns, index))
  }

  const addRow = (index) => {
    setRows(add(rows, getDefaultRow(), index))
  }

  const removeRow = (index) => {
    setRows(list.remove(rows, index))
  }

  return {
    // all: columns,
    addColumn,
    removeColumn,
    addRow,
    removeRow,
  }
}

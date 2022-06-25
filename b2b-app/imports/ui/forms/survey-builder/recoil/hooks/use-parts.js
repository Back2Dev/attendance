import {
  useRecoilCallback,
  useRecoilState,
  useRecoilTransaction_UNSTABLE,
  useRecoilValue,
} from 'recoil'
import debug from 'debug'
import { list, makeId } from '../../utils'
import { partsAtom, partAtom, partAnswers } from '../atoms'

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
    set(partsAtom, (parts) => list.add(parts, defaultPart, index))
  })

  const copyPart = useRecoilCallback(({ set, snapshot }) => (pid, index) => {
    const parts = snapshot.getLoadable(partsAtom).contents
    const part = list.findById(parts, pid)
    set(partsAtom, (parts) => list.add(parts, part, index))
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

import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { selectedPartAtom, selectedPartData } from '../atoms'

export const useSelectedPartValue = () => {
  return useRecoilValue(selectedPartAtom)
}

export const useSetSelectedPart = () => {
  return useSetRecoilState(selectedPartAtom)
}

export const useSelectedPartState = () => {
  return useRecoilState(selectedPartAtom)
}

export const useSelectedPartData = () => {
  return useRecoilValue(selectedPartData)
}

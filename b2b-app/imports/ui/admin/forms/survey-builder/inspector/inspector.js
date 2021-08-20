import { Box } from '@material-ui/core'
import React, { createElement } from 'react'
import { selector, useRecoilValue } from 'recoil'
import { selectedPartState } from '../canvas'
import { singleState } from '../single/single'
import EditProperty from './edit-property'
import Section from './section'

const inspectorState = selector({
  key: 'inspector',
  get: ({ get }) => {
    const selectedPart = get(selectedPartState)
    if (selectedPart === null) return null
    const single = get(singleState(selectedPart))
    return single
  },
})

const Inspector = () => {
  const single = useRecoilValue(inspectorState)
  const selectedPart = useRecoilValue(selectedPartState)
  return (
    <Box
      position="absolute"
      top={0}
      right={0}
      bottom={0}
      width="20%"
      border="1px solid lightgrey"
    >
      Inspect part: {selectedPart}
      <pre>{JSON.stringify(single, null, 2)}</pre>
      {selectedPart !== null && (
        <div>
          <Section heading="Question">
            <EditProperty id={selectedPart} path="question.+id" label="+id" />
          </Section>
          <Section heading="Answers">
            <EditProperty id={selectedPart} path="answers" />
            {/* <ul>
              {single.answers.map(({ label }, i) => {
                return (
                  <>
                    <li key={i}>
                      <div>{label || 'New choice'}</div>
                    </li>
                    <ul>
                      <li>
                        <EditProperty
                          id={selectedPart}
                          path={`answers[${i}].+val`}
                          label="+val"
                        />
                      </li>
                    </ul>
                  </>
                )
              })}
            </ul> */}
          </Section>
        </div>
      )}
    </Box>
  )
}

export default Inspector

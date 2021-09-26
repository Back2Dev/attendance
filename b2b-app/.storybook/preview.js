import React from 'react'
import { RecoilRoot } from 'recoil'
import { StylesProvider } from '@material-ui/core/styles'
import DndProvider, {
  DndDroppable,
} from '../imports/ui/admin/forms/survey-builder/context/dnd'
import BuilderProvider from '../imports/ui/admin/forms/survey-builder/context/builder'
import { MyThemeProvider } from '../imports/ui/contexts/theme-context'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const decorators = [
  (Story, { kind }) => {
    let story = <Story />
    const titleSegments = kind.split('/').length
    // mock DND Droppable for question type stories as they all render a Frame
    if (titleSegments === 3 && kind.startsWith('Survey Builder/Types/')) {
      story = <DndDroppable pid="part id">{() => <Story />}</DndDroppable>
    }

    return (
      <StylesProvider injectFirst>
        <MyThemeProvider>
          <RecoilRoot>
            <BuilderProvider>
              <DndProvider>{story}</DndProvider>
            </BuilderProvider>
          </RecoilRoot>
        </MyThemeProvider>
      </StylesProvider>
    )
  },
]

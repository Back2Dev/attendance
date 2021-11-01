import React from 'react'
import { RecoilRoot } from 'recoil'

import { StylesProvider } from '@material-ui/core/styles'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'

import { DndProvider, DndDroppable } from '$sb/context/dnd'
import { BuilderProvider } from '$sb/context/builder'
import { MyThemeProvider } from '../imports/ui/contexts/theme-context'
import { RecoilDevtools } from '$sb/utils'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  viewport: {
    viewports: INITIAL_VIEWPORTS,
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
            <RecoilDevtools />
            <BuilderProvider>
              <DndProvider>{story}</DndProvider>
            </BuilderProvider>
          </RecoilRoot>
        </MyThemeProvider>
      </StylesProvider>
    )
  },
]

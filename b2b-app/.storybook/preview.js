import React from 'react'
import { RecoilRoot } from 'recoil'
import DndProvider from '../imports/ui/admin/forms/survey-builder/context/dnd'
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
  (Story) => (
    <MyThemeProvider>
      <RecoilRoot>
        <DndProvider>
          <Story />
        </DndProvider>
      </RecoilRoot>
    </MyThemeProvider>
  ),
]

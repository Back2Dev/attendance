import React from 'react'
import DailyStandupPage from './daily-standup'

export default {
  title: 'DailyStandup/Demo',
  component: DailyStandupPage,
  parameters: {
    viewport: {
      // defaultviewport:'iphone6'
    },
    layout: 'fullscreen',
  },
  decorators: [(Story) => <Story />],
}

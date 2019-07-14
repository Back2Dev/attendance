/**
 * Runs StoryShots tests.
 * Snapshot testing of all Storybook Stories.
 */

import initStoryshots, { snapshotWithOptions } from '@storybook/addon-storyshots'
import {TextArea, Input} from 'semantic-ui-react'

initStoryshots({
  // storyKindRegex: /^((?!.*?nosnap).)*$/gm,
  test: snapshotWithOptions({
    createNodeMock: (element) => {
      if (element.type === 'input' || element.type === 'textarea') {
        return {
          focus(){},
        }
      }
    },
  }),
})
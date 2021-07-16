/**
 * Runs StoryShots tests.
 * Snapshot testing of all Storybook Stories.
 */
import initStoryshots from '@storybook/addon-storyshots'
import { render } from '@testing-library/react'

const reactTestingLibrarySerializer = {
  print: (val, serialize) => serialize(val.container.firstChild),
  /* eslint-disable-next-line no-prototype-builtins */
  test: (val) => val && val.hasOwnProperty('container'),
}

initStoryshots({
  renderer: render,
  snapshotSerializers: [reactTestingLibrarySerializer],
})

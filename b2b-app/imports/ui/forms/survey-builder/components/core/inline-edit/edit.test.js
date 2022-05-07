import React from 'react'
import { render, screen } from '@testing-library/react'
import { composeStories } from '@storybook/testing-react'
import userEvent from '@testing-library/user-event'
import * as InlineEditStories from './edit.stories'

const { Default, PrefilledText } = composeStories(InlineEditStories)

/** jest uses jsdom to render elements but doesn't implement innerText so we mock it to use
 * textContent instead. For our simple test cases it should suffice since there's no markup/line
 * breaks in the component we're testing.
 * https://github.com/jsdom/jsdom/issues/1245
 * https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
 * */

/*
beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'innerText', {
    get() {
      return this.textContent
    },
  })
})

it('on initial render, do not call onTextChange', () => {
  const f = jest.fn()
  render(<Default onTextChange={f} />)
  expect(f).not.toHaveBeenCalled()
})

describe('type something and', () => {
  it('press enter makes it blur and show new text', () => {
    const f = jest.fn()
    const NEW_VALUE = 'a'
    render(<PrefilledText onTextChange={f} />)
    userEvent.click(screen.getByText(PrefilledText.args.text))
    userEvent.type(screen.getByText(PrefilledText.args.text), `${NEW_VALUE}{enter}`)
    expect(screen.getByText(PrefilledText.args.text + NEW_VALUE)).not.toHaveFocus()
    expect(f).toBeCalledWith(PrefilledText.args.text + NEW_VALUE)
  })

  it('press escape makes it blur and show old text', () => {
    const f = jest.fn()
    const NEW_VALUE = 'a'
    render(<PrefilledText onTextChange={f} />)
    userEvent.click(screen.getByText(PrefilledText.args.text))
    userEvent.type(screen.getByText(PrefilledText.args.text), `${NEW_VALUE}{esc}`)
    expect(screen.getByText(PrefilledText.args.text)).not.toHaveFocus()
    expect(f).not.toHaveBeenCalled()
  })

  it.todo("if text hasn't changed and enter pressed, onTextChange should not be called")
  it.todo("if text hasn't changed and tab pressed, onTextChange should not be called")
  it.todo(
    'if text has changed and escape pressed, value should revert and onTextChange should not be called'
  )
})
*/

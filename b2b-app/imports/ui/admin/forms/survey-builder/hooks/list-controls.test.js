import React from 'react'
import { render, act } from '@testing-library/react'

import { useListControls } from '.'

function setup(...args) {
  const res = {}
  function TestComponent() {
    Object.assign(res, useListControls(...args))
    return null
  }
  render(<TestComponent />)
  return res
}

describe('hook args', () => {
  test('no args sets up empty list', () => {
    const lcData = setup()
    expect(Array.isArray(lcData.all)).toBe(true)
    expect(Array.isArray(lcData.values)).toBe(true)
    expect(lcData.all.length).toBe(0)
    expect(lcData.values.length).toBe(0)
  })

  test('initial list arg', () => {
    const expected = [
      { id: 0, value: 1 },
      { id: 1, value: 2 },
    ]
    let lcData = setup([1, 2])
    expect(lcData.values).toEqual([1, 2])
    expect(lcData.all).toEqual(expected)

    // ids should reset to 0 for new instance
    lcData = setup([1, 2])
    expect(lcData.all).toEqual(expected)
  })
})

describe('add item', () => {
  test('with no args throws error', () => {
    const lcData = setup()
    expect(() => lcData.add()).toThrow('value arg missing')
  })

  test('with value adds to list', () => {
    /** note to self: don't do const { all } = setup() then do expect(all). setup() assigns an
     * object as the return value for the hook we're testing. By destructuring it, all you do is
     * hold onto the original value despite any updates that may occur inside act() */
    const lcData = setup([1, 2, 3])
    act(() => lcData.add(4))
    expect(lcData.values).toEqual([1, 2, 3, 4])
  })

  test('with value and index adds to list', () => {
    const lcData = setup([1, 2, 3])
    act(() => lcData.add(4, 1))
    expect(lcData.values).toEqual([1, 2, 4, 3])
  })

  test('with value and invalid index throws error', () => {
    const lcData = setup([1, 2, 3])
    expect(() => act(lcData.add(4, -1))).toThrow('invalid index arg')
    expect(() => act(lcData.add(4, 3))).toThrow('invalid index arg')
  })
})

describe('remove item', () => {
  test('with no args throws error', () => {
    const lcData = setup()
    expect(() => act(() => lcData.remove())).toThrow('index arg missing')
  })

  test('with index deletes the item', () => {
    const lcData = setup([1, 2, 3])
    act(() => lcData.remove(1))
    expect(lcData.values).toEqual([1, 3])
  })

  test('with invalid index throws error', () => {
    const lcData = setup([1, 2, 3])
    expect(() => act(() => lcData.remove(-1))).toThrow('invalid index')
    expect(() => act(() => lcData.remove(3))).toThrow('invalid index')
  })
})

describe('update item', () => {
  test('with no args throws error', () => {
    const lcData = setup()
    expect(() => act(() => lcData.update())).toThrow('value or index args missing')
  })

  test('with value arg throws error', () => {
    const lcData = setup([1, 2, 3])
    expect(() => act(() => lcData.update(4))).toThrow('value or index args missing')
  })

  test('with index arg throws error', () => {
    const lcData = setup([1, 2, 3])
    expect(() => act(() => lcData.update(undefined, 1))).toThrow(
      'value or index args missing'
    )
  })

  test('with valid args updates list', () => {
    const lcData = setup([1, 2, 3])
    act(() => lcData.update(4, 1))
    expect(lcData.values).toEqual([1, 4, 3])
  })

  test('with invalid index arg throws error', () => {
    const lcData = setup([1, 2, 3])
    expect(() => act(() => lcData.update(4, -1))).toThrow('invalid index arg')
    expect(() => act(() => lcData.update(4, 3))).toThrow('invalid index arg')
  })
})

describe('move item', () => {
  test('with no args throws error', () => {
    const lcData = setup()
    expect(() => act(() => lcData.move())).toThrow('index or direction arg missing')
  })

  test('with index arg throws error', () => {
    const lcData = setup()
    expect(() => act(() => lcData.move(0))).toThrow('index or direction arg missing')
  })

  test('with direction arg throws error', () => {
    const lcData = setup()
    expect(() => act(() => lcData.move(undefined, 'up'))).toThrow(
      'index or direction arg missing'
    )
  })

  test('with valid args moves item up', () => {
    const lcData = setup([1, 2, 3])
    act(() => lcData.move(2, 'up'))
    expect(lcData.values).toEqual([1, 3, 2])
  })

  test('with valid args moves item down', () => {
    const lcData = setup([1, 2, 3])
    act(() => lcData.move(0, 'down'))
    expect(lcData.values).toEqual([2, 1, 3])
  })

  test('with invalid direction arg throws error', () => {
    const lcData = setup([1, 2, 3])
    expect(() => act(() => lcData.move(1, 'left'))).toThrow('invalid direction arg')
  })

  test('with invalid index arg throws error', () => {
    const lcData = setup([1, 2, 3])
    expect(() => act(() => lcData.move(-1, 'up'))).toThrow('invalid index arg')
    expect(() => act(() => lcData.update(3, 'down'))).toThrow('invalid index arg')
  })

  test('move first item up does nothing', () => {
    const lcData = setup([1, 2, 3])
    act(() => lcData.move(0, 'up'))
    expect(lcData.values).toEqual([1, 2, 3])
  })

  test('move last item down does nothing', () => {
    const lcData = setup([1, 2, 3])
    act(() => lcData.move(2, 'down'))
    expect(lcData.values).toEqual([1, 2, 3])
  })
})

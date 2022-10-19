import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  10
)

export { nanoid as makeId }

export const slugify = (text) => {
  if (!text || typeof text !== 'string') return 'no-name'
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
}

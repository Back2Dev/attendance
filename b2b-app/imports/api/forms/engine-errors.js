// Errors file

const parseErr = {
  en: {
    'e-unk': 'I could not understand',
    'e-no-ans': 'No answer allowed without a question',
    'e-no-obj': 'Found qualifier without a valid section/question/answer',
    'w-bad-option': 'Malformed option',
    'e-unk-attrib': 'Unknown attribute',
    'e-bad-letter': 'Unknown directive',
  },
}

export const getError = ({ code, lang = 'en' }) => {
  if (!code)
    throw new Error(
      'Call to getError did not provide a code - did you do: getError({code: "xxx"})'
    )
  if (!parseErr[lang]) throw new Error(`Unsupported language: ${lang}`)
  return parseErr[lang][code]
    ? parseErr[lang][code]
    : `Could not lookup error code for ${lang}/${code}`
}

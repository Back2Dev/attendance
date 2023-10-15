const keywords = {
  question:
    'id description type condition optional tooltip required note populate plus'.split(
      /[\s,]+/
    ),
  step: 'id description type custom form'.split(/[\s,]+/),
  // section: 'id description type custom form'.split(/[\s,]+/),
  grid: 'id type'.split(/[\s,]+/),
  answer:
    'id type value specify specifyType freesolo placeholder optional regex note category heading footer'.split(
      /[\s,]+/
    ),
}
export default keywords

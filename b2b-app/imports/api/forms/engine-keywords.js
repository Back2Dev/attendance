const keywords = {
  question:
    'id description type condition optional tooltip required note populate minCount maxCount max variant plus custom expand'.split(
      /[\s,]+/
    ),
  step: 'id description type custom form'.split(/[\s,]+/),
  section: 'id description type'.split(/[\s,]+/),

  grid: 'id type'.split(/[\s,]+/),
  answer:
    'id type value specify specifyType freesolo placeholder optional regex note explain category heading footer min max'.split(
      /[\s,]+/
    ),
  element: 'style data-cy'.split(/[\s,]+/),
}

export default keywords

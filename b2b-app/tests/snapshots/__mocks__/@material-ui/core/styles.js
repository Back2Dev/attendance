/** https://github.com/mui-org/material-ui/issues/14357#issuecomment-470324935
 * Changes snapshots with more useful styling serializing to make reading regression tests easier.
 *
 * Example from:
 *  <div className="makeStyles-smallLabel-62">
 *
 * to:
 *  <div className={
      Object {
        "alignItems": "center",
        "borderBottom": "1px solid rgba(0, 0, 0, 0.1)",
      }
    }>
 */
const originalExports = jest.requireActual('@material-ui/core/styles')
const theme = originalExports.createMuiTheme()

const makeStyles = (style) => (props) => {
  // Apply theme to classes
  const classes = typeof style === 'function' ? style(theme) : style

  // Apply props to every key of each class, which is every key of classes
  const classesByProps = {}
  Object.keys(classes).forEach((classKey) => {
    const classByProps = {}

    Object.keys(classes[classKey]).forEach((key) => {
      classByProps[key] =
        typeof classes[classKey][key] === 'function'
          ? classes[classKey][key](props)
          : classes[classKey][key]
    })

    classesByProps[classKey] = classByProps
  })

  return classesByProps
}

const withStyles = (style) => (component) => {
  const classes = typeof style === 'function' ? style(theme) : style
  component.defaultProps = { ...component.defaultProps, classes }

  return component
}

module.exports = {
  ...originalExports,
  makeStyles,
  withStyles,
}

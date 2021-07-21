import * as React from 'react'
import { useScript } from './use-script'

const Blocker = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '50px',
        backgroundColor: 'white',
        position: 'absolute',
        top: '150px',
      }}
    ></div>
  )
}
export default Calendar = () => {
  const [loaded, error] = useScript('https://tidycal.com/js/embed.js')

  React.useEffect(() => {
    if (!loaded) return
    TidyCal.init(document.getElementById('tidycal-embed'))
  }, [loaded, error])

  console.log(loaded, error)

  return (
    <span>
      <div id="tidycal-embed" data-path="mikkelking/15-minute-meeting">
        {loaded && !error ? <div /> : <b>Something went wrong!</b>}
      </div>
    </span>
  )
}

/**
 * <script src="https://tidycal.com/js/embed.js"></script>
<div id="tidycal-embed" data-path="mikkelking/15-minute-meeting"></div>
 */

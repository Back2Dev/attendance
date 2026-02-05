import React, { useContext } from 'react'
import { Button } from '@mui/material'

import { MyThemeContext } from '/imports/ui/contexts/theme-context.js'

function TestComponent() {
  const { theme, setTheme } = useContext(MyThemeContext)

  const toggleTheme = () => {
    setTheme(theme === 'default' ? 'dark' : 'default')
  }

  return (
    <div>
      <div>Test Themes</div>
      <div>
        <Button onClick={toggleTheme} variant="contained">
          Toggle theme (context)
        </Button>
      </div>
    </div>
  )
}

export default TestComponent

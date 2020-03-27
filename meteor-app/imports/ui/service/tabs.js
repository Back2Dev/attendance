import React from 'react'
import { Tab } from 'semantic-ui-react'
import client from './customer'
import serviceDetails from './service'

{
  /*
Can add a Component directly into the Tab, Services is currently in there for example purpose only
this should be changed to a serviceDetails.js which has the Services and SearchBar within it.
*/
}

const panes = [
  {
    menuItem: 'Tab 1',
    render: () => <Tab.Pane>Tab 1 Content</Tab.Pane>
  },
  { menuItem: 'Tab 2', render: () => <Tab.Pane>Tab 2 Content</Tab.Pane> },
  { menuItem: 'Tab 3', render: () => <Tab.Pane>Tab 3 Content</Tab.Pane> }
]

const tabbedPages = () => <Tab panes={panes} />

export default tabbedPages

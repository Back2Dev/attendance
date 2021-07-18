import React from 'react'

const styles = {
  greyBox: {
    background: '#ddd',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0.5rem 0.5rem 2rem 0 rgba(0, 0, 0, 0.2)',
  },
  redTag: { background: '#61b8ff', color: '#000' },
  blackTag: { background: '#000', color: '#fff' },
  blueTag: { background: 'rgb(97, 184, 255)', color: '#fff' },
  redTag: { background: '#e86971', color: '#fff' },
}

const timeData = [
  {
    id: '010',
    dateText: 'Sprint #10',
    style: { color: '#e86971' },
    markdown: `
###  Notifications page

##### Background

The existing platform notifications page is dysfunctional, for a number of reasons

  * No ability to search by property
  * All data is loaded onto page - creeping performance problem
  * Data structure means searching is not possible
  * Data displayed is constructed dynamically (ie it is not a record of what was sent out)
  * Emails and SMS triggers are stored in different locations
  * Recording of triggers is not centralised in the code (many places to change the code)
    
    
##### Objectives

The objectives of this sprint are to rebuild the data structures, 
and also to provide a usable way of viewing/searching/sorting them.

Attention will be drawn to new notifications with an bell icon in the top
nav bar, and a number of unread messages in a red bubble. Clicking on the bell
will display a drop down list of notifications in time order. Clicking on a notification
will acknowledge it, and also take the user to the relevant page in the app 
for display/action

##### Deliverables

  * New database structure for messages (in a different structure)
  * Navbar icon to attract attention
  * Drop down list of notifications
  * Click through to action page

`,
  },

  {
    id: '015',
    dateText: 'Sprint #15',
    style: { color: '#e86971' },
    markdown: `
### Migration / testing

##### Background

The existing data is missing some key features (eg audit trail), transactional history.
This will make any migration limited, so our aim is to bring the data across to the new format
without losing any data. Transactions that are in-flight on the current system will most
likely be left there to run their course, and then migrated on completion.

##### Objectives

  * User migration
    * All users appear on new platform
    * Login details are preserved (passwords) where possible
  * Property migration
    * Property details migrated across (as far as possible)
    * Transactional history migrated across (as far as possible)
  * Reporting functions to include historical data

    `,
  },
]

export default timeData

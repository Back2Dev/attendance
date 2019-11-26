import React from 'react'
import PropTypes from 'prop-types'
import { Button, Segment, Menu } from 'semantic-ui-react'
import Markdown from '/imports/ui/utils/markdown-plantuml'

const View = props => {
  const { item, loading } = props
  if (loading) return <div>Loading...</div>
  return (
    <Segment>
      <Menu>
        <Menu.Item content={item.name} />
        <Menu.Menu position="right">
          <Menu.Item
            onClick={() => props.history.push(`/admin/service-items/edit/{item._id}`)}
            content="Edit"
            icon="pencil"
            id="edit-btn"
          />
          <Menu.Item
            onClick={() => props.history.push(`/admin/service-items`)}
            content="Back"
            icon="chevron left"
            id="back-btn"
          />
        </Menu.Menu>
      </Menu>
      <Markdown source={item.markdown} />
    </Segment>
  )
}

View.propTypes = {
  item: PropTypes.object.isRequired
}

export default View

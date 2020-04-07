import React from 'react'
import PropTypes from 'prop-types'
import Tag from './tag'
import { Label, Icon, Header } from 'semantic-ui-react'

export default TagList = ({ removeTag, toggleTag, majorMinorTotal, totalCost, toggleExpand, tags, adjustPrice }) => {
  return (
    <div id="pill-container" style={{ marginTop: '10px' }}>
      {tags &&
        tags.map((tag, index) =>
          tag.items ? (
            <>
              <Label id="item-pill" key={index} style={{ margin: '5px' }} size="big" color="blue">
                <Icon
                  id="collapse-icon"
                  name={tag.expanded ? 'angle double left' : 'angle double right'}
                  style={{ cursor: 'pointer' }}
                  onClick={() => toggleExpand(tag, index)}
                />
                {tag.name}
                <Label.Detail>${majorMinorTotal(tag.items)}</Label.Detail>
                <Icon id="delete-icon" name="delete" onClick={() => removeTag(tag, index)} />
              </Label>
              {tag.expanded &&
                tag.items.map((item) => (
                  <Label
                    id="item-pill-small"
                    key={item.name}
                    style={{ margin: '5px' }}
                    size="large"
                    color={item.greyed ? null : 'teal'}
                  >
                    {item.name}
                    <Label.Detail>${item.price}</Label.Detail>
                    <Label.Detail>
                      <Icon
                        id="plus-icon"
                        name={item.greyed ? 'plus' : 'minus'}
                        style={{ cursor: 'pointer' }}
                        onClick={() => toggleTag(item, tag)}
                      />
                    </Label.Detail>
                  </Label>
                ))}
            </>
          ) : (
            <Tag index={index} tag={tag} adjustPrice={adjustPrice} removeTag={removeTag} />
          )
        )}
      <Header style={{ margin: '10px' }} id="total-price">
        {'Total: $' + totalCost}
      </Header>
    </div>
  )
}

TagList.propTypes = {
  removeTag: PropTypes.func.isRequired,
  toggleTag: PropTypes.func.isRequired,
  majorMinorTotal: PropTypes.func.isRequired,
  totalCost: PropTypes.number.isRequired,
  tags: PropTypes.array.isRequired,
}

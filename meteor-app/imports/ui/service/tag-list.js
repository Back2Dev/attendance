import React from 'react'
import PropTypes from 'prop-types'
import Tag from './tag'
import { Container, Label, Icon, Header } from 'semantic-ui-react'

export default TagList = ({ removeTag, toggleTag, majorMinorTotal, totalPrice, toggleExpand, tags, adjustPrice }) => {
  return (
    <Container id="pill-container" style={{ marginTop: '10px' }}>
      {tags &&
        tags.map((tag, index) =>
          tag.items ? (
            <Container>
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
                tag.items.map(item => (
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
            </Container>
          ) : (
            <Tag index={index} tag={tag} adjustPrice={adjustPrice} removeTag={removeTag} />
          )
        )}
      <Header style={{ margin: '10px' }} id="total-price">
        {'Total: $' + (tags ? totalPrice(tags) : '0')}
      </Header>
    </Container>
  )
}

TagList.propTypes = {
  removeTag: PropTypes.func.isRequired,
  toggleTag: PropTypes.func.isRequired,
  majorMinorTotal: PropTypes.func.isRequired,
  totalPrice: PropTypes.number.isRequired,
  tags: PropTypes.array.isRequired
}

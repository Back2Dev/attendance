import React from 'react'
import { Label, Icon, Input } from 'semantic-ui-react'

export default Tag = ({ index, tag, adjustPrice, removeTag }) => {
  const [disableToggle, setDisableToggle] = React.useState(false)

  return (
    <>
      <Label id="item-pill" key={index} style={{ margin: '5px' }} size="big" color="blue">
        {tag.name}
        {!disableToggle ? (
          <Label.Detail
            onClick={() => {
              setDisableToggle(!disableToggle)
            }}
            className="item-name"
            key={'b'}
          >
            ${tag.price}
          </Label.Detail>
        ) : (
          <>
            &nbsp;$
<<<<<<< HEAD
            <input
              type="number"
=======
            <Input
              type="number"
              size="mini"
>>>>>>> ee97bcf9e55d185bdecc0d6e6e7e35dfa8479c7f
              defaultValue={tag.price}
              onChange={e => adjustPrice(tag._id, e.target.value)}
              onBlur={() => setDisableToggle(!disableToggle)}
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  setDisableToggle(!disableToggle)
                }
              }}
            />
          </>
        )}
        <Icon name="delete" onClick={() => removeTag(tag, index)} />
      </Label>
    </>
  )
}

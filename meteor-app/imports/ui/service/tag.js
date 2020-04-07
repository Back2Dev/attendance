import React from 'react'
import { Label, Icon, Input } from 'semantic-ui-react'
// import 'imports/ui/service/Service.css'
import './Service.css'

export default Tag = ({ index, tag, adjustPrice, newTagName, removeTag }) => {
  const [disableToggle, setDisableToggle] = React.useState(false)

  return (
    <>
      <Label key={index} style={{ margin: '5px' }} size="big" color="blue">
        {!disableToggle ? (
          <span
            onClick={() => {
              setDisableToggle(!disableToggle)
            }}
          >
            {tag.name}
          </span>
        ) : (
          <input
            className="tag-input"
            defaultValue={tag.name}
            style={{ width: `${(tag.name.length + 1) * 8.5}px` }}
            onBlur={() => setDisableToggle(!disableToggle)}
            onChange={(e) => newTagName(tag._id, e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                setDisableToggle(!disableToggle)
              }
            }}
          />
        )}

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
            <input
              type="number"
              className="tag-number-input"
              defaultValue={tag.price}
              onChange={(e) => adjustPrice(tag._id, e.target.value)}
              onBlur={() => setDisableToggle(!disableToggle)}
              onKeyPress={(e) => {
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

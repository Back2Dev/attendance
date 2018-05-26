import React from 'react'
import { Image } from 'semantic-ui-react'

const avatarWidget = (props) => {
  // 1: read filesystem and generate a list of files that are in there
  // 2: have a predetermined range of them
  return (
    // need to somehow map over them and generate some custom radio checkboxes
    <div>
      <Image src="/images/avatars/1.jpg" />
      <input type="select"
        className="custom"
        value={props.value}
        required={props.required}
        onChange={(event) => props.onChange(event.target.value)} />
    </div>
  );
}

export default {
  avatarWidget,
};
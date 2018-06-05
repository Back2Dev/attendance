import React from 'react'
import PropTypes from 'prop-types';
import { Button, Header, Input } from 'semantic-ui-react'
import '/imports/ui/member/member-visit-pin.css'
import { times } from 'lodash'

const MemberVisitPin = (props) => {
  return (
    <div className='member-visit-pin'>
      <Header>

        <input placeholder='Enter your pin' type="password" pattern="[0-9]*" inputMode="numeric"
          style={{ width: '100px' }}
          onChange={props.onPinInput}
        />
      </Header>
      <div className='keypad'>
        {
          times(10, (i) => {
            return (
              <button value={i}>{i</button>
            )
          })
        }
      </div>
    </div>
      )
    }
    
MemberVisitPin.propTypes = {
          onPinInput: PropTypes.func.isRequired,
      };
      
export default MemberVisitPin
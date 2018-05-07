import React from 'react'
import { Grid, Input, Icon } from 'semantic-ui-react'
import PeopleList from '../containers/people-list'

export default class SearchablePeople extends React.PureComponent {
  constructor(props, context) {
    super(props)
    this.state = {searchTerm: ''}
  }
  
  handleInput(e, o) {
    if (e.type === 'change') {  
      this.setState({searchTerm: o.value})
    }
  }

  render () {

    return (

      <Grid relaxed='very' columns='equal' style={{ marginTop: '7em', backgroundColor: this.props.backgroundColor }}>
  
        <Grid.Row stretched padded='horizontally' >
         <Grid.Column>
          <Input
                value={this.state.searchTerm}
                onChange={this.handleInput.bind(this)}
                icon={
                  <Icon name='delete' onClick={()=>this.setState({searchTerm: ''})} inverted circular link />
                }
                placeholder='Search...'
              />  
         </Grid.Column>

        </Grid.Row>  

        <Grid.Row stretched padded='horizontally'  >
          <Grid.Column>
            <PeopleList searchTerm={this.state.searchTerm} isCheckedIn={this.props.isCheckedIn} onTapAction={this.props.onTapAction}/>
          </Grid.Column>
        </Grid.Row>
  
      </Grid>
    )
  }

}
import React from 'react'
import { withRouter } from 'react-router-dom'
import { Grid, Segment, Header, Input, Button, Dimmer, Loader, Image, Message} from 'semantic-ui-react'
import Alert from 'react-s-alert';
import PartCard from '/imports/ui/ordering/ordering-part-card'
import PartList from '/imports/ui/ordering/ordering-part-list'
import CartIcon from '/imports/ui/ordering/cart-icon'
import UploadXL from '/imports/ui/ordering/uploadXL'

class Ordering extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      addParts: true,
  
    };
    this.toggleAddPart = this.toggleAddPart.bind(this)
  }
  toggleAddPart(){
    this.setState({ addParts: !this.state.addParts })

  }
  render() {
    if(this.props.loading){
      return(
     
        <div>
            <Dimmer active inverted>
              <Loader size='large'>Loading</Loader>
            </Dimmer>

          <Image src='/images/wireframe/short-paragraph.png' />
       </div>

      )
    }
  const { activeOrder, uploadXL } = this.props
  let noOfParts = 0
  
    return (
      
      <Grid centered columns={1}>
  
      <Header as='h2' textAlign='center'> <div>Parts</div> </Header>
     <Grid columns={3} width={3}>
        <Grid.Row centered verticalAlign='middle'>
       <Grid.Column>
            {(!this.props.loading && activeOrder) && activeOrder.orderedParts.forEach(part => {
              noOfParts += part.qty
              return noOfParts
            }) }
             <CartIcon noOfParts={noOfParts} /> 
        </Grid.Column>
 <Grid.Column>
        <Input
        placeholder='Search Part Number'
        onChange={this.props.onSearchInput}
        value={this.props.partSearchQuery}
        icon={'search'}
      />
          </Grid.Column>
         <Grid.Column >
          {this.state.addParts 
          ? 
          <Button content="Upload parts data file now!" onClick={this.toggleAddPart}/>
          : 
          <UploadXL uploadXL={uploadXL} toggleAddPart={this.toggleAddPart}/>}
         
          {(this.props.parts < 1 ? <Message
                error
                header='There is no Parts Data'
                list={[
                  'Please upload your data file above'
                ]}
              /> : '')}
       
 
         

             </Grid.Column>
             </Grid.Row>
     </Grid>
          <Grid.Row>
          <Grid.Column>

            <PartList
              title={'Part Title:'}
              parts={this.props.parts}
              activeOrder={this.props.activeOrder}
              addToCart={this.props.addToCart}
              Component={PartCard}
              componentClassName='part-card-main'
              loading={this.props.loading}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

export default withRouter(Ordering)

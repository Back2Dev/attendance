import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { Grid, Label, Header, Input, Button, Dimmer, Loader, Image, Message, Segment, Icon } from 'semantic-ui-react'
import UploadXL from '/imports/ui/ordering/uploadXL'
import PartCard from '/imports/ui/ordering/ordering-part-card'
import PartList from '/imports/ui/ordering/ordering-part-list'
import CartIcon from '/imports/ui/ordering/cart-icon'

const Ordering = props => {
  const [addParts, setAdd] = React.useState(true)
  const [searchFor, setSearch] = React.useState('')
  const [virgin, setVirgin] = React.useState(true)

  toggleAddPart = () => {
    setAdd(!addParts)
  }

  onSearchInput = e => {
    setSearch(e.target.value)
  }

  search = e => {
    // e.preventDefault()
    props.onSearchInput(searchFor)
  }

  onKeyPress = target => {
    if (target.key === 'Enter') {
      props.onSearchInput(searchFor)
      setVirgin(false)
    }
  }

  if (props.loading) {
    return (
      <div>
        <Dimmer active inverted>
          <Loader size="huge">Loading... </Loader>
        </Dimmer>

        <Image src="/images/wireframe/short-paragraph.png" />
      </div>
    )
  }

  const { activeOrder, uploadXL } = props
  let noOfParts = 0
  const { parts = [] } = props
  const cartClick = () => {
    props.history.push('/parts/ordering/cart')
  }

  return (
    <Grid container columns="equal">
      {!props.loading &&
        activeOrder &&
        activeOrder.orderedParts.forEach(part => {
          noOfParts += part.qty
          return noOfParts
        })}

      <Grid.Row columns={1}>
        <Grid.Column width={16}>
          <Header as="h2" textAlign="center">
            {' '}
            <div>Parts Search</div>{' '}
          </Header>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row columns={1} centered>
        <CartIcon noOfParts={noOfParts} onClick={cartClick} />
        <br />
        <Input
          placeholder="Part number or name"
          className="member-search"
          onChange={onSearchInput}
          defaultValue={searchFor}
          onKeyPress={onKeyPress}
          size="huge"
          fluid
        >
          <input />
          {parts.length > 0 && !virgin && (
            <Label color="yellow" floating>
              {parts.length}
            </Label>
          )}
          <Button type="submit" icon labelPosition="right" color="green" size="huge" onClick={search}>
            <Icon name="search" />
            Search
          </Button>
        </Input>
      </Grid.Row>

      <Grid.Row columns={1} centered>
        {!searchFor && (
          <Message icon="info" header="Please enter part number or name" content="and press ENTER to search" />
        )}

        {parts < 1 ? (
          <>
            <Message icon="blind" header="Nothing found" content="Please try again" />
            <Button
              onClick={toggleAddPart}
              style={{
                height: '100px',
                marginTop: '20px',
                marginBottom: '20px'
              }}
              color="grey"
            >
              <h1>Add updated pricelist</h1>
            </Button>

            {addParts ? '' : <UploadXL uploadXL={props.uploadXL} toggleAddPart={toggleAddPart} />}
          </>
        ) : (
            ''
          )}
      </Grid.Row>

      {searchFor && !virgin && (
        <Grid.Row>
          <Grid.Column>
            <PartList
              title={'Part Title:'}
              parts={parts}
              activeOrder={props.activeOrder}
              addToCart={props.addToCart}
              Component={PartCard}
              componentClassName="part-card-main"
              loading={props.loading}
            />
          </Grid.Column>
        </Grid.Row>
      )}
    </Grid>
  )
}

export default withRouter(Ordering)

Ordering.propTypes = {
  activeOrder: PropTypes.object,
  addToCart: PropTypes.func.isRequired,
  parts: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  partSearchQuery: PropTypes.string,
  onSearchInput: PropTypes.func,
  uploadXL: PropTypes.func.isRequired
}

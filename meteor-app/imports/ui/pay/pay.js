import React from 'react'
import PropTypes from 'prop-types'
import { Container, Header, Button, Message, Item } from 'semantic-ui-react'
import Price from '/imports/ui/utils/price'

const Payment = ({ job, ccUrl }) => {
  const [showBank, setBank] = React.useState(false)
  const [showPP, setPP] = React.useState(false)

  const toggleBank = () => {
    setBank(!showBank)
  }

  const togglePP = () => {
    setPP(!showPP)
  }

  const paypal = () => {
    window.location.href = `https://paypal.me/back2bikes?locale.x=en_AU&amount=200&description=Bike+Service&reference=C6`
  }

  const creditCard = () => {
    // history.push(ccUrl)
    window.location.href = ccUrl
  }
  if (!job) return <h3>Job not found</h3>
  return (
    <Container>
      <Header as="h2" textAlign="center">
        Your bike service is complete
      </Header>
      <h3>
        Job no {job.jobNo}, price: <Price cents={job.totalCost}></Price>
      </h3>
      <p>
        In order to maintain sufficient social distance, we are asking our customers to pay electronically prior to
        picking up their bike.
      </p>
      <p>This means that bike pick-up is simpler, and less personal interaction is required.</p>
      <h3> Payment options</h3>
      <Item.Group>
        <Item onClick={toggleBank}>
          <Item.Image size="tiny" src="/images/cc-generic.png" />
          <Item.Content>
            <Item.Header as="a">Bank transfer</Item.Header>
            <Item.Meta>(click to show details)</Item.Meta>
            <Item.Description>
              {showBank && (
                <Message
                  header="Direct Bank Transfer"
                  key="2"
                  content={
                    <div>
                      Commonwealth Bank,
                      <br />
                      BSB: 063 000 <br />
                      A/C: 1221 4326<br></br>
                      <i>Please use {job.jobNo} for the payment reference</i>
                    </div>
                  }
                />
              )}
            </Item.Description>
          </Item.Content>
        </Item>
        <Item onClick={creditCard}>
          <Item.Image size="tiny" src="/images/cc-card.png" />
          <Item.Content>
            <Item.Header as="a">Credit card</Item.Header>
            <Item.Meta>Click to go to secure payment site</Item.Meta>
            <Item.Description></Item.Description>
          </Item.Content>
        </Item>
        {/* <Item onClick={paypal}>
          <Item.Image size="tiny" src="/images/paypal.png" />
          <Item.Content>
            <Item.Header as="a">Paypal</Item.Header>
            <Item.Meta>(click to show details)</Item.Meta>
            <Item.Description>
              {showPP && (
                <Message
                  header="Paypal"
                  key="2"
                  content={
                    <div>
                      Pay to: admin@back2bikes.com.au<br></br>
                      <i>Please use {job.jobNo} for the payment reference</i>
                    </div>
                  }
                />
              )}
            </Item.Description>
          </Item.Content>
        </Item> */}
      </Item.Group>
    </Container>
  )
}

Payment.propTypes = {
  job: PropTypes.object.isRequired
}

export default Payment

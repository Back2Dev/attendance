import React from 'react'
import PropTypes from 'prop-types'
import {
  Container,
  Header,
  Image,
  Message,
  Item,
  Table,
  Segment,
} from 'semantic-ui-react'
import Price from '/imports/ui/utils/price'
import { Address } from '/imports/ui/utils'

const Receipt = ({ job, logo, org }) => {
  const bike = `${job.bikeDetails.color} ${job.bikeDetails.make} ${job.bikeDetails.model}`
  const expires = `(expires ${job.card.expiry_month}/${job.card.expiry_year})`
  const items = [
    { name: 'Bike', value: ` ${bike}` },
    { name: 'Amount', value: <Price cents={job.totalCost} /> },
    { name: 'Name', value: job.card.name },
    {
      name: 'Card',
      value: `${job.card.scheme} ${job.card.display_number} ${expires}`,
    },
    {
      name: 'Country of issue',
      value: job.card.issuing_country,
    },
    {
      name: 'Billing address',
      value: (
        <Address
          fields={'line1 line2 city state postcode country'.split(
            /\s+/
          )}
          card={job.card}
        />
      ),
    },
    {
      name: 'Transaction Date',
      value: moment(job.paidAt).format('DD/MM/YYYY HH:MM:SS'),
    },
  ]
  return (
    <Container text textAlign="center">
      <Segment textAlign="center">
        <Header as="h2">
          <Image src={logo} />
        </Header>
        <Header as="h5">{org}</Header>
        <Header as="h2">
          You have paid for bike service {job.jobNo}
        </Header>
        <Table basic="very" celled collapsing>
          <Table.Body>
            {items.map((item) => (
              <Table.Row key={item.name}>
                <Table.Cell valign="top">
                  <Header as="h4">{item.name}</Header>
                </Table.Cell>
                <Table.Cell>{item.value}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Segment>
    </Container>
  )
}
const Payment = ({ job, ccUrl, logo, org }) => {
  const [allowBank, setAllowBank] = React.useState(false)
  const [allowPaypal, setAllowPaypal] = React.useState(false)
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
  if (job.paid && job.card && job.charge_token)
    return <Receipt job={job} logo={logo} org={org}></Receipt>
  return (
    <Container>
      <Header as="h2" textAlign="center">
        Your bike service is complete
      </Header>
      <h3>
        Job no {job.jobNo}, price:{' '}
        <Price cents={job.totalCost}></Price>
      </h3>
      <p>
        In order to maintain sufficient social distance, we are asking
        our customers to pay electronically prior to picking up their
        bike.
      </p>
      <p>
        This means that bike pick-up is simpler, and less personal
        interaction is required.
      </p>
      <h3> Payment options</h3>
      <Item.Group>
        <Item onClick={creditCard}>
          <Item.Image size="tiny" src="/images/cc-card.png" />
          <Item.Content>
            <Item.Header as="a">Credit card</Item.Header>
            <Item.Meta>Click to go to secure payment site</Item.Meta>
            <Item.Description></Item.Description>
          </Item.Content>
        </Item>
        {allowBank && (
          <Item onClick={toggleBank}>
            <Item.Image size="tiny" src="/images/cc-generic.png" />
            <Item.Content>
              <Item.Header as="a">Bank transfer</Item.Header>
              <Item.Meta>click to show details</Item.Meta>
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
                        <i style={{ color: 'red' }}>
                          Please use <b>{job.jobNo}</b> for the
                          payment reference
                        </i>
                      </div>
                    }
                  />
                )}
              </Item.Description>
            </Item.Content>
          </Item>
        )}
        {allowPaypal && (
          <Item onClick={paypal}>
            <Item.Image size="tiny" src="/images/paypal.png" />
            <Item.Content>
              <Item.Header as="a">Paypal</Item.Header>
              <Item.Meta>click to go to Paypal</Item.Meta>
              <Item.Description>
                {showPP && (
                  <Message
                    header="Paypal"
                    key="2"
                    content={
                      <div>
                        Pay to: admin@back2bikes.com.au<br></br>
                        <i>
                          Please use {job.jobNo} for the payment
                          reference
                        </i>
                      </div>
                    }
                  />
                )}
              </Item.Description>
            </Item.Content>
          </Item>
        )}
      </Item.Group>
    </Container>
  )
}

Payment.propTypes = {
  job: PropTypes.object.isRequired,
  logo: PropTypes.string.isRequired,
  org: PropTypes.string.isRequired,
}

export default Payment

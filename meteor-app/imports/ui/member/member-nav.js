import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { Meteor } from 'meteor/meteor'
import { Menu, Image, Button } from 'semantic-ui-react'
import Search from '/imports/ui/member/member-search-container'
import Payment from '/imports/ui/member/member-payment'

const Nav = props => {
  const logoFile = Meteor.settings.public.logo || '/images/logo-tiny.jpg'
  const memberWord = Meteor.settings.public.member || 'Volunteer'
  const register = Meteor.settings.public.register || 'Register'
  const admin = Meteor.settings.public.admin || false
  const memberWords = memberWord + 's'
  const showParts = Meteor.settings.public.parts || false
  const showServicing = Meteor.settings.public.servicing || false
  const showShop = Meteor.settings.public.shop || false

  return (
    <Menu fixed="top" stackable>
      <Menu.Item
        onClick={() => {
          props.history.push('/')
        }}
      >
        <Image src={logoFile} height="35px" />
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          props.history.push('/add')
        }}
      >
        <Button id="add_member" color="green" content={`${register}`} icon="add user" />
      </Menu.Item>
      {admin && (
        <Menu.Item
          onClick={() => {
            props.history.push('/userprofiles')
          }}
        >
          <Button id="list_members" color="blue" content={memberWords} icon="group" />
        </Menu.Item>
      )}
      <Menu.Item>
        <Payment />
      </Menu.Item>
      {showShop && (
        <Menu.Item
          onClick={() => {
            props.history.push('/shop')
          }}
        >
          <Button id="shop" color="blue" content="Shop" icon="shop" />
        </Menu.Item>
      )}
      {showServicing && (
        <>
          <Menu.Item>
            <Button
              id="add_assessmentr"
              color="orange"
              icon="wrench"
              content="Service"
              onClick={() => {
                props.history.push('/assessment')
              }}
            />
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              props.history.push('/jobs')
            }}
          >
            <Button color="orange" icon="tasks" content="Jobs" />
          </Menu.Item>
        </>
      )}
      {showParts && (
        <Menu.Item
          onClick={() => {
            props.history.push('/ordering')
          }}
        >
          <Button color="violet" icon="cogs" content="Parts" />
        </Menu.Item>
      )}
      <Menu.Item position="right">
        <Search memberWords={memberWords} />
      </Menu.Item>
    </Menu>
  )
}

Nav.propTypes = {}

export default withRouter(Nav)

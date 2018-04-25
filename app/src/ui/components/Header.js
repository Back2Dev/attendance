import React from 'react'
import { Menu, Segment } from 'semantic-ui-react'

export default class Header extends React.PureComponent {
  constructor(props, context) {
    super(props)
    this.state = {activeItem: this.props.match.location}
  }

  static getDerivedStateFromProps(nextProps, prevState) {

    let activeItem = ''

    if (nextProps.match.url.endsWith('people/list')) {activeItem = 'vols'}
    if (nextProps.match.url.endsWith('attendance')) {activeItem = 'attend'}
    if (nextProps.match.url.endsWith('people/checkIn')) {activeItem = 'checkin'}
    if (nextProps.match.url.endsWith('people/whosIn')) {activeItem = 'whosin'}

    if (nextProps.match.url.endsWith('confirmCheckin') ) 
      {activeItem = 'checkin'}

    if (nextProps.match.url.endsWith('confirmCheckin') ) 
      {activeItem = 'attend'}

    if (nextProps.match.url.endsWith('confirmCheckout') ) 
      {activeItem = 'whosin'}

    if (nextProps.match.url.endsWith('confirmCheckout') )
      {activeItem = 'attend'}    

    return { activeItem }
  }

  onApp = () => this.props.history.push('/attendance')
  onWhosIn = () => this.props.history.push('/people/whosIn')
  onCheckin = () => this.props.history.push('/people/checkIn')
  onPeopleList = () => this.props.history.push('/people/list')
  onHome = () => this.props.history.push('/')

  handleItemClick = (e, { name }) => {

    this.setState({ activeItem: name })

    if (name==='logo') {this.onHome()}
    if (name==='vols') {this.onPeopleList()}
    if (name==='attend') {this.onApp()}
    if (name==='checkin') {this.onCheckin()}
    if (name==='whosin') {this.onWhosIn()}

  }
  
  render () {

    const { activeItem } = this.state

    return (
      <Segment>
        <Menu fixed='top' inverted borderless color='green'>
          <Menu.Item as='h1' 
            name='logo' 
            content='BACK 2 BIKES' 
            active={activeItem === 'logo'}
            onClick={this.handleItemClick}/>
          <Menu.Item 
            name='attend'
            content='Attendance' 
            active={activeItem === 'attend'}
            onClick={this.handleItemClick}/>
          <Menu.Item 
            name='whosin'
            content="Who's In Today" 
            active={activeItem === 'whosin'}
            onClick={this.handleItemClick}/>
          <Menu.Item 
            name='checkin' 
            content='Check In' 
            active={activeItem === 'checkin'}
            onClick={this.handleItemClick}/>
          <Menu.Item 
            name='vols' 
            content='Volunteers' 
            active={activeItem === 'vols'}
            onClick={this.handleItemClick}/>
        </Menu> 
      </Segment>
    )
  }
}
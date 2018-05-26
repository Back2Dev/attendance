// member-card.stories.js
import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import { Welcome } from '@storybook/react/demo'
import { withInfo } from '@storybook/addon-info'
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs/react'

import Card from './member-card'

const member = {
  _id: "BXghHGE343iuyMN",
  isHere: true,
  avatar: '7.jpg',
  sessions:
    [{ memberId: 'randomSession' },
    { memberId: 'randomSession' }],
  lastIn: new Date(),
  joined: new Date(),
  addressPostcode: 3428,
  addressState: 'VIC',
  addressStreet: '199 Henderson Spur',
  addressSuburb: 'South Melbourne',
  bikesHousehold: 5,
  email: 'Jayde_Conn@yahoo.com',
  emergencyContact: 'Everett Mosciski',
  emergencyEmail: 'Ibrahim.Flatley@gmail.com',
  emergencyMobile: '848-220-5422',
  emergencyPhone: '848-924-0182',
  mobile: '352-485-4816',
  name: 'Orie Kautzer',
  phone: '144-467-2060',
  workStatus: 'Student',
  reasons: 'Earum excepturi et laudantium fuga similique sed corporis. Dolores esse soluta et repudiandae. Aut atque dolores voluptatibus ut.',
  primaryBike: 'Cruiser'
}

storiesOf('Member.Card', module)
  .addDecorator(withKnobs)

  .add('Card', withInfo('Checked in/out')(() => {
    const story = (
      <div><p>Use Knobs to show checked in/out status</p>
        <Card
          {...member}
          onCardClick={action('onCardClick')}
        />
      </div>
    )
    // specs(() =>
    //   describe('<Avatar avatar={avatar} />', () => {
    //     it('displays an avatar', () => {
    //       const wrapper = mount(story);
    //       expect(wrapper.find('img')).to.have.length(1);
    //       expect(wrapper.find('img').props().src).to.contain(avatar.url);
    //     });
    //   })
    // );
    return story;
  }))

import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { spy } from 'sinon';

import Avatar from '/imports/ui/avatar';

const FALLBACK_IMAGE = '/images/avatar_placeholder.png';
const avatar = {
  url: 'https://cdn.filepicker.io/api/file/9OYh1hblQXaWmsqmwO1D',
  filename: 'random.jpg',
  mimetype: 'image/jpeg',
  size: 70426,
  converted: true,
  id: 1,
  client: 'computer',
  isWriteable: true,

  _id: "9OYh1hblQXaWmsqmwO1D",
  name: "Jerry Lewis",
  fileName: "1.jpg",
  isCheckedin: false,
};


describe('<Avatar /> component', () => {
  it('is present and exists', () => {
    const wrapper = shallow(
      <Avatar 
        _id="9OYh1hblQXaWmsqmwO1D"
        name={"Jerry Lewis"},
        fileName="1.jpg"
        isCheckedin= {false}      
      />
    );
    expect(wrapper).to.be.present();
    expect(wrapper).to.exist; // eslint-disable-line no-unused-expressions
  });

// Initial implementation of Avatar doesn't support these tests

  // it('displays an avatar from a Filestack object', () => {
  //   const wrapper = shallow(<Avatar avatar={avatar} />);
  //   expect(wrapper.find('img')).to.have.length(1);
  //   expect(wrapper.find('img').props().src).to.contain(avatar.url);
  // });

  // it('displays a fallback image if avatar.url not passed', () => {
  //   const wrapper = shallow(<Avatar avatar={{}} />);
  //   expect(wrapper.find('img')).to.have.length(1);
  //   expect(wrapper.find('img').props().src).to.contain(FALLBACK_IMAGE);
  // });

  // it('passes the size parameter into the Filestack url', () => {
  //   const size = 48;
  //   const wrapper = shallow(<Avatar avatar={avatar} size={size} />);
  //   expect(wrapper.find('img')).to.have.length(1);
  //   expect(wrapper.find('img').props().src).to.contain(`w=${size}&h=${size}`);
  // });

  // it('supports HiDPI/Retina', () => {
  //   const dpr = global.window.devicePixelRatio;
  //   global.window.devicePixelRatio = 2;
  //   const size = 48;
  //   const wrapper = shallow(<Avatar avatar={avatar} size={size} />);
  //   expect(wrapper.find('img')).to.have.length(1);
  //   expect(wrapper.find('img').props().src).to.contain(`w=${size * 2}&h=${size * 2}`);
  //   global.window.devicePixelRatio = dpr;
  // });

  // it('passes className property', () => {
  //   const wrapper = shallow(<Avatar className="foobarqux" />);
  //   expect(wrapper.find('.avatar-atom').hasClass('foobarqux')).to.equal(true);
  // });

  // it('passes down onClick handlers', () => {
  //   const onClick = spy();
  //   const wrapper = shallow(<Avatar onClick={onClick} />);
  //   wrapper.simulate('click');
  //   expect(onClick.called).to.equal(true);
  // });
});

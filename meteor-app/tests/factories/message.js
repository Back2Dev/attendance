// Message factory

const message = () => ({
  loopId: 'T9EsZ7kMfBcaadEC3',   // Use a real looking id
  profileId: 'abcdefgh',
});

const text = () => Object.assign(message(), {
  type: 'text',
  text: 'This is a text message from the test factory',
});

const event = () => ({
  type: 'event',
  title: 'This is an event message from the test factory',
  description: 'And this is the description for the event',
  startDateTime: new Date(),
  endDateTime: new Date(),
  location: 'foobar street',
});

export default {
  // text message
  text(props) {
    return Object.assign({}, text(), props);
  },

  // event message
  event(props) {
    return Object.assign({}, event(), props);
  },
};

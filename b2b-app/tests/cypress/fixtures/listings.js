module.exports = {
  easy: {
    address: '1 Easy St, Nirvana VIC 3999, Australia',
    transactionType: 'buy',
    persons: [
      {
        userId: 'pYPHQdeas9ggwpF97',
        name: 'Charlie Customer',
        email: 'charlie.customer@test.com',
        role: 'CUS',
        mobile: '040010012001',
        primary: true,
        assignedAt: new Date(),
      },
      {
        userId: 'pYPHQdeas9ggwpF97',
        name: 'Constantine Veya',
        email: 'Constantine.Veya@test.com',
        mobile: '040010012002',
        role: 'CON',
        assignedAt: new Date(),
      },
      {
        userId: 'pYPHQdeas9ggwpF97',
        name: 'Geronimo',
        email: 'geronimo.yawns@test.com',
        mobile: '040010012003',
        role: 'PM',
        assignedAt: new Date(),
      },
    ],
    docs: [
      {
        type: 'cdc',
        surveyId: 'xxx',
        formData: {
          'practice-name': 'Back2bikes NSW',
          'practice-license': '001632L',
          'practice-address': '1 George St, Sydney, NSW 2000',
          'practice-abn': '20 625 000 651',

          customer: {
            'customer-name': 'Charlie Customer',
          },
          costs: {
            'invoice-cost': '660',
            'invoice-gst': '500',
          },
          property: {
            'property-address': '1 Easy St, Nirvana VIC 3999, Australia',
          },
        },
        formStatus: 'progress',
        who: 'pYPHQdeas9ggwpF97',
      },
    ],
    status: 'active',
  },
  buy: {
    address: '123 Buy St, Nirvana VIC 3999, Australia',
    transactionType: 'buy',
    persons: [
      {
        userId: 'pYPHQdeas9ggwpF97',
        name: 'Charlie Customer',
        email: 'charlie.customer@test.com',
        role: 'CUS',
        primary: true,
        assignedAt: new Date(),
      },
      {
        userId: 'pYPHQdeas9ggwpF97',
        name: 'Geronimo',
        email: 'geronimo.yawns@test.com',
        role: 'PM',
        assignedAt: new Date(),
      },
    ],
    docs: [],
    status: 'active',
  },
}

// export default listings
// module.exports = listings

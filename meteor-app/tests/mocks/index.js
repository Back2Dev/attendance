export const Meteor = {
  methods: jest.fn(),
  users: {
    findOne: jest.fn().mockImplementation(() => usersQueryResult),
    find: jest.fn().mockImplementation(() => ({
      fetch: jest.fn().mockReturnValue(usersQueryResult),
      count: jest.fn(),
    })),
  },
}
export const Mongo = {
  Collection: jest.fn().mockImplementation(() => ({
    createIndex: jest.fn(),
    attachSchema: jest.fn(),
  })),
}

export const createContainer = jest.fn(
  (options = {}, component) => component
)
export const withTracker = jest.fn((Op) =>
  jest.fn((C) => createContainer(Op, C))
)

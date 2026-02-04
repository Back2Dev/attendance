export const Meteor = {
  methods: jest.fn(),
  users: {
    findOne: jest.fn().mockImplementation(() => usersQueryResult),
    find: jest.fn().mockImplementation(() => ({
      fetch: jest.fn().mockReturnValue(usersQueryResult),
      count: jest.fn(),
    })),
  },
};
export const Mongo = {
  Collection: jest.fn().mockImplementation(() => ({
    _ensureIndex: (jest.fn()),
    rawCollection: jest.fn().mockImplementation(() => ({
      createIndex: jest.fn().mockResolvedValue(undefined)
    })),
    attachSchema: jest.fn(),
    insertAsync: jest.fn().mockResolvedValue(undefined),
    updateAsync: jest.fn().mockResolvedValue(1),
    removeAsync: jest.fn().mockResolvedValue(1),
    findOneAsync: jest.fn().mockResolvedValue(undefined),
    find: jest.fn().mockImplementation(() => ({
      fetchAsync: jest.fn().mockResolvedValue([]),
      countAsync: jest.fn().mockResolvedValue(0),
      fetch: jest.fn().mockReturnValue([]),
      count: jest.fn().mockReturnValue(0)
    }))
  })),
};

export const createContainer = jest.fn((options = {}, component) => component );
export const withTracker = jest.fn(Op => jest.fn(C => createContainer(Op, C)));

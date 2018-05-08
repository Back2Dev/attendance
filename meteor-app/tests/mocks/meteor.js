class FakeMeteor {
  constructor() {
    this.isServer = false;
    this.isClient = true;
    this.mockUserId = false;
  }

  fakeLogin(userId) {
    this.mockUserId = userId;
  }

  fakeLogout() {
    this.mockUserId = false;
  }

  user() {
    return this.mockUserId ? { _id: this.mockUserId } : undefined;
  }

  userId() {
    return this.mockUserId;
  }
}

export const Meteor = new FakeMeteor();

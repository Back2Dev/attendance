class FakeCollection {
  constructor(name) {
    this.name = name;
  }

  find() {
    return { fetch: () => [] };
  }

  findOne() {
    return undefined;
  }

  insert() {}

  update() {}
}

export const Mongo = {
  Collection: FakeCollection,
};

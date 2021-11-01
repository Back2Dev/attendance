class TypeRegistry {
  static #types = {}

  static get(type) {
    return TypeRegistry.#types[type]
  }

  static register(type, component, source, mapDataToAtom, atom) {
    if (!(type && component && source && mapDataToAtom && atom)) {
      throw new Error('Must provide all args when registering a type')
    }

    TypeRegistry.#types[type] = { component, source, mapDataToAtom, atom }
  }
}

export { TypeRegistry }

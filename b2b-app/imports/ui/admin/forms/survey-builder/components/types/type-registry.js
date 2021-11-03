class TypeRegistry {
  static #types = {}

  static get(type) {
    return TypeRegistry.#types[type]
  }

  static register(type, component, source, mapDataToAtom, atom, inspectorProperties) {
    if (!(type && component && source && mapDataToAtom && atom && inspectorProperties)) {
      throw new Error('Must provide all args when registering a type')
    }
    if (type in TypeRegistry.#types) {
      throw new Error(
        `Question type with name '${type}' already in use. Choose another name`
      )
    }

    TypeRegistry.#types[type] = {
      component,
      source,
      mapDataToAtom,
      atom,
      inspectorProperties,
    }
  }
}

export { TypeRegistry }

import Vue from 'vue'

// https://hisk.io/javascript-snake-to-camel/
const snakeToCamel = str => str.replace(
  /([-_][a-z])/g,
  group => group.toUpperCase()
    .replace('-', '')
    .replace('_', '')
)

// https://stackoverflow.com/a/37616104
// const objectFilter = (obj, predicate) => Object.fromEntries(Object.entries(obj).filter(predicate));

// fails if can't find any value by predicate
// const objectFilter = (obj, predicate) =>
//   Object.assign(...Object.keys(obj)
//     .filter(key => predicate(obj[key]))
//     .map(key => ({ [key]: obj[key] })))

const objectFilter = (obj, predicate) =>
  Object.keys(obj)
    .filter(key => predicate(obj[key]))
    .reduce((res, key) => Object.assign(res, { [key]: obj[key] }), {})

// TODO make as separated npm package
class DataSchema {
  constructor (schemePath = '../data-schema.js') {
    this.schemePath = schemePath
  }

  install (Vue, options) {
    // todo
    // console.log('===== DataSchema install ======')
  }

  // todo более легковесный импорт
  // TODO !!! возможно нужно будет транспилировать, т к this.schemePath не работает
  async loadResource (resourceName) {
    const preparedResourceName = snakeToCamel(resourceName)

    const dataSchemaModule = await import('../data-schema.js')
    // eslint-disable-next-line no-prototype-builtins
    if (dataSchemaModule.default.resources.hasOwnProperty(preparedResourceName)) {
      return Object.assign({}, dataSchemaModule.default.resources[preparedResourceName])
    }
  }

  async loadFullSchema () {
    const dataSchemaModule = await import('../data-schema.js')
    return Object.assign({}, dataSchemaModule.default)
  }

  async loadRelatedResources (resource) {
    // eslint-disable-next-line prefer-const
    let fieldsWithRelations = {}

    // find all fields of type "relation"
    const editableFieldsWithRelations = objectFilter(
      resource.editableFields,
      field => field.fieldType === 'relation' && !!field.relation && !!field.relation.entity
    )
    Object.assign(fieldsWithRelations, editableFieldsWithRelations)

    // get resource names from fields
    const resourceNames = []
    for (const key in fieldsWithRelations) {
      // eslint-disable-next-line no-prototype-builtins
      if (fieldsWithRelations.hasOwnProperty(key)) {
        resourceNames.push(fieldsWithRelations[key].relation.entity)
      }
    }

    // load resources from schema
    const relatedResources = {}
    for (const resourceName of resourceNames) {
      relatedResources[resourceName] = await this.loadResource(resourceName)
    }

    return relatedResources
  }
}

Vue.use(new DataSchema())

export default ({ app }, inject) => {
  inject('dataSchema', new DataSchema())
}

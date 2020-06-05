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
  async loadResource (resourceName, extraData = {}) {
    const preparedResourceName = snakeToCamel(resourceName)

    const dataSchemaModule = await import('../data-schema.js')
    // eslint-disable-next-line no-prototype-builtins
    if (dataSchemaModule.default.resources.hasOwnProperty(preparedResourceName)) {
      return Object.assign({}, dataSchemaModule.default.resources[preparedResourceName], {
        extra: extraData
      })
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

    // find all fields of type "dynamic-table" with reference
    const editableFieldsWithReferences = objectFilter(
      resource.editableFields,
      field => field.fieldType === 'dynamic-table' && !!field.table && !!field.table.headers &&
        field.table.headers.find((value, index, obj) => {
          return value.type === 'reference' && !!value.reference
        })
    )
    Object.assign(fieldsWithRelations, editableFieldsWithReferences)

    // extra data for related resources
    const resourcesExtra = {}
    // get resource names from fields
    const resourceNames = []
    for (const key in fieldsWithRelations) {
      // eslint-disable-next-line no-prototype-builtins
      if (fieldsWithRelations.hasOwnProperty(key)) {
        if (fieldsWithRelations[key].fieldType === 'relation') {
          resourceNames.push(fieldsWithRelations[key].relation.entity)
          if (!!fieldsWithRelations[key].relation.extra && typeof fieldsWithRelations[key].relation.extra === 'object') {
            resourcesExtra[fieldsWithRelations[key].relation.entity] = fieldsWithRelations[key].relation.extra
          }
        }
        if (fieldsWithRelations[key].fieldType === 'dynamic-table') {
          for (const headerKey in fieldsWithRelations[key].table.headers) {
            // eslint-disable-next-line no-prototype-builtins
            if (fieldsWithRelations[key].table.headers.hasOwnProperty(headerKey)) {
              const header = fieldsWithRelations[key].table.headers[headerKey]
              if (header.type === 'reference' && !!header.reference && !!header.reference.entity) {
                resourceNames.push(header.reference.entity)
                if (!!header.reference.extra && typeof header.reference.extra === 'object') {
                  resourcesExtra[header.reference.entity] = header.reference.extra
                }
              }
            }
          }
        }
      }
    }

    // load resources from schema
    const relatedResources = {}
    for (const resourceName of resourceNames) {
      let extra = {}
      // resourcesExtra.hasOwnProperty(resourceName) - see https://stackoverflow.com/a/39283005
      if (Object.prototype.hasOwnProperty.call(resourcesExtra, resourceName)) {
        extra = resourcesExtra[resourceName]
      }
      relatedResources[resourceName] = await this.loadResource(resourceName, extra)
    }

    return relatedResources
  }
}

Vue.use(new DataSchema())

export default ({ app }, inject) => {
  inject('dataSchema', new DataSchema())
}

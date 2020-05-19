import Vue from 'vue'

// TODO make as separated npm package
class DataSchema {
  constructor (schemePath = '../data-scheme.js') {
    this.schemePath = schemePath
  }

  install (Vue, options) {
    // todo
    // console.log('===== DataSchema install ======')
  }

  // todo более легковесный импорт
  // TODO !!! возможно нужно будет транспилировать, т к this.schemePath не работает
  async loadResource (resourceName) {
    const dataSchemaModule = await import('../data-scheme.js')
    // eslint-disable-next-line no-prototype-builtins
    if (dataSchemaModule.default.resources.hasOwnProperty(resourceName)) {
      return Object.assign({}, dataSchemaModule.default.resources[resourceName])
    }
  }

  async loadFullSchema () {
    const dataSchemaModule = await import('../data-scheme.js')
    return Object.assign({}, dataSchemaModule.default)
  }
}

Vue.use(new DataSchema())

export default ({ app }, inject) => {
  inject('dataSchema', new DataSchema())
}

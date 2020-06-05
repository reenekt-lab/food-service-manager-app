/**
 * Entity Watchers mixin provides watching all entity's fields
 * Used in pages components
 */
export default {
  data () {
    return {
      appliedWatchers: {}
    }
  },
  created () {
    this.appliedWatchers = this.applyWatchers(this.generateEntityWatchers())
  },
  beforeDestroy () {
    this.revokeWatchers(this.appliedWatchers)
  },
  computed: {
    // raw (incomplete but working) method
    fieldsResetDependenciesMap () {
      const dependenciesMap = {}
      for (const key in this.resourceData.editableFields) {
        if (Object.prototype.hasOwnProperty.call(this.resourceData.editableFields, key)) {
          const field = this.resourceData.editableFields[key]
          if (field.fieldType === 'dynamic-table') {
            for (const header of field.table.headers) {
              if (header.type === 'reference' &&
                !!header.reference &&
                !!header.reference.extra &&
                !!header.reference.extra.resetWhen &&
                !!header.reference.extra.resetWhen.changed) {
                for (const propertyKey of header.reference.extra.resetWhen.changed) {
                  dependenciesMap[propertyKey] = key
                }
              }
            }
          }
        }
      }
      return dependenciesMap
    },
    // raw (incomplete but working) method
    resourcesReloadDependenciesMap () {
      const dependenciesMap = {}
      for (const key in this.resourceData.editableFields) {
        if (Object.prototype.hasOwnProperty.call(this.resourceData.editableFields, key)) {
          const field = this.resourceData.editableFields[key]
          if (field.fieldType === 'dynamic-table') {
            for (const header of field.table.headers) {
              if (header.type === 'reference' &&
                !!header.reference &&
                !!header.reference.extra &&
                !!header.reference.extra.loadConditions &&
                !!header.reference.extra.loadConditions.entityRelated) {
                if (header.reference.extra.loadConditions.entityRelated.query) {
                  for (const propertyKey in header.reference.extra.loadConditions.entityRelated.query) {
                    const propertyValue = header.reference.extra.loadConditions.entityRelated.query[propertyKey]
                    // dependenciesMap[propertyValue] = key // watching field key => target field key
                    dependenciesMap[propertyValue] = header.reference.entity // watching field key => related entity name
                  }
                }
              }
            }
          }
        }
      }
      return dependenciesMap
    }
  },
  methods: {
    generateEntityWatchers () {
      const watchers = {}
      for (const entityKey in this.entity) {
        if (Object.prototype.hasOwnProperty.call(this.entity, entityKey)) {
          watchers[`entity.${entityKey}`] = function (val, oldVal) {
            // reset dependent fields
            if (this.fieldsResetDependenciesMap[entityKey]) {
              if (Array.isArray(this.entity[this.fieldsResetDependenciesMap[entityKey]])) {
                this.entity[this.fieldsResetDependenciesMap[entityKey]] = []
              } else {
                this.entity[this.fieldsResetDependenciesMap[entityKey]] = undefined
              }
            }

            // reload dependent fields
            if (this.resourcesReloadDependenciesMap[entityKey]) {
              const relatedResourceKey = this.resourcesReloadDependenciesMap[entityKey]
              const relatedResource = this.relatedResources[relatedResourceKey]
              this.loadRelatedResourceData(relatedResource, relatedResourceKey)
            }
          }
        }
      }
      return watchers
    },
    applyWatchers (watchers) {
      const unwatchers = {}
      for (const key in watchers) {
        if (Object.prototype.hasOwnProperty.call(watchers, key)) {
          // todo add condition if watcher is callback or object with callback+options
          unwatchers[key] = this.$watch(key, watchers[key])
        }
      }
      return unwatchers
    },
    revokeWatchers (unwatchers) {
      for (const key in unwatchers) {
        if (Object.prototype.hasOwnProperty.call(unwatchers, key)) {
          unwatchers[key]()
        }
      }
    }
  }
}

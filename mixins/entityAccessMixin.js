/**
 * Entity Watchers mixin provides watching all entity's fields
 * Used in pages components
 */
export default {
  computed: {
    canCreateEntityFunction () {
      if (!this.resourceData) {
        return function (user) {
          return false
        }
      }
      if (this.resourceData.canCreate === undefined) {
        return function (user) {
          return true
        }
      }
      if (typeof this.resourceData.canCreate !== 'function') {
        return function (user) {
          return false
        }
      } else {
        return this.resourceData.canCreate
      }
    },
    canEditEntityFunction () {
      if (!this.resourceData) {
        return function (user, entity) {
          return false
        }
      }
      if (this.resourceData.canCreate === undefined) {
        return function (user, entity) {
          return true
        }
      }
      if (typeof this.resourceData.canCreate !== 'function') {
        return function (user, entity) {
          return false
        }
      } else {
        return this.resourceData.canEdit
      }
    },
    canDeleteEntityFunction () {
      if (!this.resourceData) {
        return function (user, entity) {
          return false
        }
      }
      if (this.resourceData.canCreate === undefined) {
        return function (user, entity) {
          return true
        }
      }
      if (typeof this.resourceData.canDelete !== 'function') {
        return function (user, entity) {
          return false
        }
      } else {
        return this.resourceData.canDelete
      }
    }
  }
}

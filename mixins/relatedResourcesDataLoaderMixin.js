/**
 * Related Resource Data Loader mixin provides methods for loading (data schema driven) resources' data from backend
 * Used in pages components
 * All data will be put into `relatedResourcesData` property
 */
export default {
  data () {
    return {
      relatedResourcesData: {}
    }
  },
  created () {
    this.loadAllRelatedResourcesData()
  },
  methods: {
    loadAllRelatedResourcesData () {
      for (const key in this.relatedResources) {
        if (Object.prototype.hasOwnProperty.call(this.relatedResources, key)) {
          this.loadRelatedResourceData(this.relatedResources[key], key)
        }
      }
    },
    loadRelatedResourceData (relatedResource, resourceKey) {
      // prepare relatedResourcesData
      if (!this.relatedResourcesData[resourceKey]) {
        const relatedResourcesDataTemp = this.relatedResourcesData
        relatedResourcesDataTemp[resourceKey] = {
          loading: true,
          data: []
        }
        this.relatedResourcesData = Object.assign({}, relatedResourcesDataTemp)
      } else {
        const relatedResourcesDataTemp = this.relatedResourcesData
        relatedResourcesDataTemp[resourceKey].loading = true
        // relatedResourcesDataTemp[resourceKey].data = []
        this.relatedResourcesData = Object.assign({}, relatedResourcesDataTemp)
      }

      const axiosConfig = {
        params: {}
      }

      // add request additional params
      if (relatedResource.extra && relatedResource.extra.loadConditions) {
        // todo вынести в отдельные методы
        if (relatedResource.extra.loadConditions.entityRelated) {
          if (relatedResource.extra.loadConditions.entityRelated.query) {
            for (const conditionKey in relatedResource.extra.loadConditions.entityRelated.query) {
              if (Object.prototype.hasOwnProperty.call(relatedResource.extra.loadConditions.entityRelated.query, conditionKey)) {
                const conditionValue = relatedResource.extra.loadConditions.entityRelated.query[conditionKey]
                if (this.entity[conditionValue]) {
                  axiosConfig.params[conditionKey] = this.entity[conditionValue]
                }
              }
            }
          }
        }
      }

      // send request and receive data
      this.$axios.get(relatedResource.apiPath, axiosConfig)
        .then((response) => {
          const relatedResourcesDataTemp = this.relatedResourcesData
          relatedResourcesDataTemp[resourceKey].loading = false
          relatedResourcesDataTemp[resourceKey].data = response.data.data
          this.relatedResourcesData = Object.assign({}, relatedResourcesDataTemp)
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error('Error on loading resource data')
          // eslint-disable-next-line no-console
          console.error(error.response)
        })
    }
  }
}

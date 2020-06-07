<template>
  <v-container>
    <v-snackbar
      v-model="snackbar.active"
      top
      multi-line
      vertical
      :color="snackbar.color"
    >
      <div class="text-center">
        {{ snackbar.text }}
      </div>
      <div class="d-flex justify-space-between">
        <v-btn
          v-if="snackbar.item && snackbar.item.id"
          dark
          small
          text
          nuxt
          :to="{ name: 'order-view-id', params: { id: snackbar.item.id } }"
        >
          К заказу
        </v-btn>
        <v-btn
          dark
          small
          text
          style="margin-left: auto;"
          @click="snackbar.active = false"
        >
          Закрыть
        </v-btn>
      </div>
    </v-snackbar>

    <v-row>
      <v-col :cols="12">
        <v-data-table
          :loading="loading"
          :server-items-length="entities.meta.total"
          :headers="tableHeaders"
          :items="entities.data"
          :show-expand="$route.params.type === 'new' || $route.params.type === 'processing'"
          single-expand
          :items-per-page="15"
          disable-filtering
          disable-sort
          :footer-props="{
            'disable-items-per-page': true
          }"
          class="elevation-4"
          @update:page="changePage"
        >
          <template v-for="(thrVal, thrKey, thrIndex) in tableHeadersRelations" v-slot:[thrKey]="{ item, header }">
            <!-- eslint-disable -->
            <v-btn v-if="lodashGet(item, thrVal.key)" text small
                   :to="{ name: 'entity-id', params: { entity: thrVal.entity, id: lodashGet(item, thrVal.key) } }"
                   nuxt exact target="_blank"
            >{{ lodashGet(item, header.value) }} <v-icon x-small right>mdi-open-in-new</v-icon></v-btn>
            <div v-if="!lodashGet(item, thrVal.key)">&mdash;</div>
            <!-- eslint-enable -->
          </template>

          <template v-for="(thdVal, thdKey, thdIndex) in tableHeadersDates" v-slot:[thdKey]="{ item }">
            <div :key="`qwe_${thdIndex}`">
              {{ $moment.utc(item[thdVal]).format('D MMM YYYY H:mm:ss') }}
            </div>
          </template>

          <template #item.actions="{ item }">
            <!-- Desktop -->
            <v-flex v-if="$vuetify.breakpoint.mdAndUp">
              <v-btn color="primary" small :to="{ name: 'order-view-id', params: { id: item.id } }" nuxt>
                <v-icon>mdi-eye</v-icon>
              </v-btn>
            </v-flex>

            <!-- Mobile -->
            <v-menu v-if="!$vuetify.breakpoint.mdAndUp" :top="$vuetify.breakpoint.xs">
              <template v-slot:activator="{ on }">
                <v-btn
                  color="primary"
                  dark
                  v-on="on"
                >
                  Действия
                </v-btn>
              </template>

              <v-list class="text-center">
                <v-list-item
                  color="primary"
                  :to="{ name: 'order-view-id', params: { id: item.id } }"
                  nuxt
                >
                  <v-list-item-title>
                    <v-icon>mdi-eye</v-icon>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>

          <template
            v-if="$route.params.type === 'new' || $route.params.type === 'processing'"
            #expanded-item="{ headers, item }"
          >
            <td :colspan="headers.length">
              <div v-if="$route.params.type === 'new'">
                <v-btn
                  color="primary"
                  :loading="orderProcessing"
                  @click="acceptOrder(item)"
                >
                  Взять в работу
                </v-btn>
              </div>
              <div v-if="$route.params.type === 'processing'">
                <div class="d-flex justify-center align-center flex-wrap">
                  <v-row>
                    <v-col
                      cols="12"
                      md="10"
                      :offset-md="1"
                    >
                      <v-select
                        v-model="selectedCourierToDeliver"
                        :items="relatedResourcesData.courier.data"
                        :loading="relatedResourcesData.courier.loading"
                        placeholder="Выберите курьера"
                        item-text="first_name"
                        item-value="id"
                        hide-details
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      md="10"
                      :offset-md="1"
                      class="d-flex justify-center"
                    >
                      <v-btn
                        color="primary"
                        :disabled="!selectedCourierToDeliver"
                        :loading="orderProcessing"
                        @click="transferToDelivery(item, selectedCourierToDeliver)"
                      >
                        Передать курьеру
                      </v-btn>
                    </v-col>
                  </v-row>

                  <div v-if="false" class="d-flex align-center my-6" style="width: 100%;">
                    <v-divider style="margin-right: 1.5rem;" />
                    <span>Или</span>
                    <v-divider style="margin-left: 1.5rem;" />
                  </div>

                  <v-row v-if="false">
                    <v-col
                      cols="12"
                      md="10"
                      :offset-md="1"
                    >
                      <v-select
                        :items="[]"
                        placeholder="TODO: добавить кнопку для поиска свободного курьера для доставки"
                      />
                    </v-col>
                  </v-row>
                </div>
              </div>
            </td>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import entityAccessMixin from '../../../mixins/entityAccessMixin'
import relatedResourcesDataLoaderMixin from '../../../mixins/relatedResourcesDataLoaderMixin'
import orderCommonMixin from '../../../mixins/orders/orderCommonMixin'
const lodashGet = require('lodash.get')

export default {
  mixins: [entityAccessMixin, relatedResourcesDataLoaderMixin, orderCommonMixin],

  async asyncData ({ app, error, params }) {
    const entityLoadData = {
      name: 'order',
      restaurant_id: app.$auth.user.restaurant_id
    }

    const resourceData = await app.$dataSchema.loadResource(entityLoadData.name)

    app.$dataSchema.globalContext.auth = {
      user: Object.assign({}, app.$auth.user)
    }

    if (!resourceData) {
      error({ statusCode: 404, message: 'Entity not found' })
      return
    }

    const relatedResources = await app.$dataSchema.loadRelatedResources(resourceData)

    return {
      title: resourceData.titles.entities,
      apiEndpoint: resourceData.apiPath,
      entityName: entityLoadData.name,
      headers: resourceData.headers,
      resourceData,
      relatedResources
    }
  },
  loadRelatedResourcesOnCreate: false,
  data () {
    return {
      tableHeaders: [],
      tableHeadersRelations: {},
      tableHeadersDates: {},
      loading: true,
      currentPage: 1,
      entities: {
        data: [],
        meta: {
          total: 0
        }
      },
      snackbar: {
        active: false,
        color: 'info',
        text: '',
        item: null
      }
    }
  },
  created () {
    // fixes client-side global context
    this.$dataSchema.globalContext.auth = {
      user: Object.assign({}, this.$auth.user)
    }

    const extraResourceData = {
      axiosConfig: {
        params: {
          restaurant: this.$auth.user.restaurant_id
        }
      }
    }
    this.loadRelatedResourceData(this.relatedResources.courier, 'courier', extraResourceData)
  },
  mounted () {
    this.updateHeaders()
    this.loadPageData()

    // reload resourceData (fixes methods load, earlier they was loaded as string)
    this.$dataSchema.loadResource(this.entityName)
      .then((resourceData) => {
        this.resourceData = resourceData
      })
  },
  methods: {
    updateHeaders () {
      const headers = [...this.headers || []]
      const actionFieldExists = headers.find((elem) => {
        return elem.value === 'actions'
      })
      if (!actionFieldExists) {
        headers.push({ text: 'Действия', value: 'actions' })
      }
      if (this.$route.params.type === 'new' || this.$route.params.type === 'processing') {
        const expandFieldExists = headers.find((elem) => {
          return elem.value === 'data-table-expand'
        })
        if (!expandFieldExists) {
          headers.push({ text: '', value: 'data-table-expand' })
        }
      }

      // headers.filter((header) => {
      //   return header.type !== 'image'
      // })
      // TODO show multiple relations' items in modal (that opens by clicking on todo: "button in cell")
      const tableHeaders = headers.filter(header => header.type !== 'image' &&
        !(header.type === 'relation' && header.multiple === true) &&
        header.type !== 'dynamic-table'
      )

      const tableHeadersRelationsTemp = tableHeaders.filter(header => header.type === 'relation' && !!header.relation)
      for (const key in tableHeadersRelationsTemp) {
        // TODO show multiple relations' items in modal (that opens by clicking on todo: "button in cell")
        if (tableHeadersRelationsTemp[key].multiple !== true) {
          this.tableHeadersRelations[`item.${tableHeadersRelationsTemp[key].value}`] = tableHeadersRelationsTemp[key].relation
        }
      }

      const tableHeadersDates = headers.filter(header => header.type === 'datetime')
      for (const datetimeHeader of tableHeadersDates) {
        this.tableHeadersDates[`item.${datetimeHeader.value}`] = datetimeHeader.value
      }

      this.tableHeaders = tableHeaders
    },
    changePage (page) {
      // console.log('PAGE: ' + page) // todo remove
      this.loadPageData(page)
    },
    loadPageData (page = 1) {
      this.loading = true

      // todo создавать конфиг на основе (food) endpointRequestConfig и (data-schema) globalContextCompileString
      const axiosConfig = {
        params: {}
      }

      if (this.resourceData.endpointRequestConfig) {
        if (this.resourceData.endpointRequestConfig.params) {
          for (const key in this.resourceData.endpointRequestConfig.params) {
            if (Object.prototype.hasOwnProperty.call(this.resourceData.endpointRequestConfig.params, key)) {
              const value = this.resourceData.endpointRequestConfig.params[key]
              axiosConfig.params[key] = this.$dataSchema.globalContextCompileString`${value}`
            }
          }
        }
      }

      if (this.$route.params.type === 'new') {
        axiosConfig.params.status = 'created' // backend's status
      }
      if (this.$route.params.type === 'processing') {
        axiosConfig.params.status = 'cooking' // backend's status
      }
      if (this.$route.params.type === 'delivering') {
        axiosConfig.params.status = 'delivering' // backend's status
      }

      return this.$axios.get(this.apiEndpoint, axiosConfig)
        .then((response) => {
          this.entities = response.data
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log(error.response)
        })
        .finally(() => {
          this.currentPage = page
          this.loading = false
        })
    },

    /**
     * @deprecated
     * @param id
     */
    deleteEntity (id) {
      this.$axios.delete(this.resourceData.getResourceEndpoint(id))
        .then((response) => {
          // console.log(response.data) todo
          this.snackbar.color = 'success'
          this.snackbar.active = true
          this.snackbar.text = response.data.message

          // refresh page data
          this.loadPageData(this.currentPage)
        })
        .catch((error) => {
          // console.log(error.response.data) todo
          this.snackbar.color = 'error'
          this.snackbar.active = true
          this.snackbar.text = error.response.data.message
        })
    },

    // https://lodash.com/docs/4.17.15#get
    lodashGet
  },
  head () {
    return {
      title: this.title
    }
  }
}
</script>

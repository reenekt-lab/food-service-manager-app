<template>
  <v-container>
    <v-snackbar
      v-model="snackbar.active"
      top
      multi-line
      :color="snackbar.color"
    >
      {{ snackbar.text }}
      <v-btn
        dark
        text
        @click="snackbar.active = false"
      >
        Закрыть
      </v-btn>
    </v-snackbar>

    <v-row>
      <v-col :cols="12">
        <v-btn
          class="my-2"
          color="success"
          outlined
          :to="{name: 'entity-create', params: { 'entity': entityName }}"
          nuxt
          exact
        >
          Создать
        </v-btn>

        <v-data-table
          :loading="loading"
          :server-items-length="entities.meta.total"
          :headers="tableHeaders"
          :items="entities.data"
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

          <template #item.actions="{ item }">
            <!-- Desktop -->
            <v-flex v-if="$vuetify.breakpoint.mdAndUp">
              <v-btn color="primary" small :to="{ name: 'entity-id', params: { id: item.id } }" nuxt>
                <v-icon>mdi-eye</v-icon>
              </v-btn>
              <v-btn color="secondary" small :to="{ name: 'entity-id-edit', params: { id: item.id } }" nuxt>
                <v-icon>mdi-square-edit-outline</v-icon>
              </v-btn>
              <!-- todo this -->
              <v-btn color="error" small @click="deleteEntity(item.id)">
                <v-icon>mdi-delete-outline</v-icon>
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
                  :to="{ name: 'entity-id', params: { id: item.id } }"
                  nuxt
                >
                  <v-list-item-title>
                    <v-icon>mdi-eye</v-icon>
                  </v-list-item-title>
                </v-list-item>
                <v-list-item
                  color="secondary"
                  :to="{ name: 'entity-id-edit', params: { id: item.id } }"
                  nuxt
                >
                  <v-list-item-title>
                    <v-icon>mdi-square-edit-outline</v-icon>
                  </v-list-item-title>
                </v-list-item>
                <!-- TODO below -->
                <v-list-item
                  color="error"
                  @click="deleteEntity(item.id)"
                >
                  <v-list-item-title>
                    <v-icon>mdi-delete-outline</v-icon>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
const lodashGet = require('lodash.get')

export default {
  async asyncData ({ app, error, params }) {
    const resourceData = await app.$dataSchema.loadResource(params.entity)
    if (!resourceData) {
      error({ statusCode: 404, message: 'Entity not found' })
      return
    }
    return {
      title: resourceData.titles.entities,
      apiEndpoint: resourceData.apiPath,
      entityName: params.entity,
      headers: resourceData.headers,
      resourceData
    }
  },
  data () {
    return {
      tableHeaders: [],
      tableHeadersRelations: {},
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
        text: ''
      }
    }
  },
  mounted () {
    this.updateHeaders()
    this.loadPageData()
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

      this.tableHeaders = tableHeaders
    },
    changePage (page) {
      // console.log('PAGE: ' + page) // todo remove
      this.loadPageData(page)
    },
    loadPageData (page = 1) {
      this.loading = true

      this.$axios.get(this.apiEndpoint)
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

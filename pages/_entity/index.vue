<template>
  <v-container>
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
              <v-btn color="error" small :to="{ name: 'entity-id', params: { id: item.id } }" nuxt>
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
                  :to="{}"
                  nuxt
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
      headers: resourceData.headers
    }
  },
  data () {
    return {
      tableHeaders: [],
      loading: true,
      entities: {
        data: [],
        meta: {
          total: 0
        }
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
      this.tableHeaders = headers
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
          console.log(error.response)
        })
        .finally(() => {
          this.loading = false
        })
    }
  },
  head () {
    return {
      title: this.title
    }
  }
}
</script>

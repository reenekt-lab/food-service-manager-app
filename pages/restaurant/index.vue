<template>
  <v-container>
    <v-row>
      <v-col :cols="12">
        <v-btn
          class="my-2"
          color="secondary"
          outlined
          :to="{ name: 'restaurant-edit' }"
          nuxt
          exact
        >
          Редактировать
        </v-btn>
        <v-card>
          <v-card-text>
            <v-simple-table>
              <thead>
                <tr>
                  <th>Поле</th>
                  <th>Значение</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(field, i) in fields" :key="`field-${i}`">
                  <td v-if="field.type !== 'dynamic-table'">
                    {{ field.text }}
                  </td>

                  <td v-if="field.type === 'text' || field.type === undefined">
                    {{ entity[field.value] }}
                  </td>
                  <td v-if="field.type === 'datetime'">
                    {{ $moment.utc(entity[field.value]).format('D MMM YYYY H:mm:ss') }}
                  </td>
                  <td v-if="field.type === 'relation' && field.multiple !== true">
                    <!-- eslint-disable -->
                    <v-btn v-if="lodashGet(entity, field.value)" text small
                           :to="{ name: 'entity-id', params: { entity: field.relation.entity, id: lodashGet(entity, field.relation.key) } }"
                           nuxt exact target="_blank"
                    >{{ lodashGet(entity, field.value) }} <v-icon x-small right>mdi-open-in-new</v-icon></v-btn>
                    <div v-if="!lodashGet(entity, field.value)">&mdash;</div>
                    <!-- eslint-enable -->
                  </td>
                  <td v-if="field.type === 'relation' && field.multiple === true">
                    <!-- eslint-disable -->
                    <template v-if="entity[field.value] && entity[field.value].length > 0">
                      <template v-for="(relItem) in entity[field.value]">
                        <v-btn text small
                               :to="{ name: 'entity-id', params: { entity: field.relation.entity, id: relItem[field.relation.valueKey || 'id'] } }"
                               nuxt exact target="_blank"
                        >{{ relItem[field.relation.textKey || 'name'] }} <v-icon x-small right>mdi-open-in-new</v-icon></v-btn>
                      </template>
                    </template>
                    <div v-if="!entity[field.value] || entity[field.value].length === 0">&mdash;</div>
                    <!-- eslint-enable -->
                  </td>
                  <td v-if="field.type === 'image'">
                    <!-- <img :src="entity[field.value]" :alt="field.text">-->
                    <!-- eslint-disable-next-line -->
                    <v-img
                      eager
                      contain
                      :src="entity[field.value]"
                      :alt="field.text"
                      :max-height="300"
                      :max-width="350"
                    ></v-img>
                  </td>
                  <td v-if="field.type === 'enumeration'">
                    {{
                      resourceData.enumerations[field.enumeration].find(item => item.value === entity[field.value]) ?
                        resourceData.enumerations[field.enumeration].find(item => item.value === entity[field.value]).text :
                        '-'
                    }}
                  </td>
                  <td v-if="field.type === 'dynamic-table'" colspan="2" style="padding: 8px 1px;">
                    <v-card>
                      <v-card-title>{{ field.text }}</v-card-title>
                      <v-card-text>
                        <!-- TODO add isFieldEnabled() to other field's types -->
                        <client-only>
                          <dynamic-table
                            :headers="field.table.headers"
                            :items.sync="entity[field.value]"
                            :reference-data="relatedResourcesData"
                            :editable="false"
                          />
                        </client-only>
                      </v-card-text>
                    </v-card>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DynamicTable from '../../components/DynamicTable/DynamicTable'
import relatedResourcesDataLoaderMixin from '../../mixins/relatedResourcesDataLoaderMixin'
const lodashGet = require('lodash.get')

export default {
  components: {
    DynamicTable
  },
  mixins: [relatedResourcesDataLoaderMixin],
  async asyncData ({ app, error, $axios, params }) {
    const entityLoadData = {
      name: 'restaurant',
      id: app.$auth.user.restaurant_id
    }

    const resourceData = await app.$dataSchema.loadResource(entityLoadData.name)
    if (!resourceData) {
      error({ statusCode: 404, message: 'Entity not found' })
      return
    }
    // todo move next line to doc page/file
    // details: https://axios.nuxtjs.org/usage.html#shortcuts
    const data = await $axios.$get(resourceData.getResourceEndpoint(entityLoadData.id))

    const relatedResources = await app.$dataSchema.loadRelatedResources(resourceData)

    return {
      entityName: entityLoadData.name,
      entity: data.data,
      fields: resourceData.headers,
      resourceData,
      relatedResources
    }
  },
  data () {
    return {
      // fields: headers
    }
  },
  methods: {
    lodashGet
  },
  head () {
    return {
      title: this.entity.name
    }
  }
}
</script>

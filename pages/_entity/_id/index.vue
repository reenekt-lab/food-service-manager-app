<template>
  <v-container>
    <v-row>
      <v-col :cols="12">
        <v-btn
          class="my-2"
          color="primary"
          outlined
          :to="{name: 'entity', params: { 'entity': entityName }}"
          nuxt
          exact
        >
          Назад
        </v-btn>
        <v-btn
          class="my-2"
          color="secondary"
          outlined
          :to="{name: 'entity-id-edit', params: { 'entity': entityName, id: entity.id }}"
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
                  <td>{{ field.text }}</td>
                  <td v-if="field.type === 'text' || field.type === undefined">{{ entity[field.value] }}</td>
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
<!--                    <img :src="entity[field.value]" :alt="field.text">-->
                    <v-img
                      eager
                      contain
                      :src="entity[field.value]"
                      :alt="field.text"
                      :max-height="300"
                      :max-width="350"
                    ></v-img>
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
const lodashGet = require('lodash.get')

export default {
  async asyncData ({ app, error, $axios, params }) {
    const resourceData = await app.$dataSchema.loadResource(params.entity)
    if (!resourceData) {
      error({ statusCode: 404, message: 'Entity not found' })
      return
    }
    // todo move next line to doc page/file
    // details: https://axios.nuxtjs.org/usage.html#shortcuts
    const data = await $axios.$get(resourceData.getResourceEndpoint(params.id))
    return {
      entityName: params.entity,
      entity: data.data,
      fields: resourceData.headers
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

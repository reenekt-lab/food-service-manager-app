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
                  <td>{{ entity[field.value] }}</td>
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
  head () {
    return {
      title: this.entity.name
    }
  }
}
</script>

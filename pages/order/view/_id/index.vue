<template>
  <v-container>
    <v-snackbar
      v-model="snackbar.active"
      top
      multi-line
      :color="snackbar.color"
    >
      <div class="text-center">
        {{ snackbar.text }}
      </div>
      <div class="d-flex justify-space-between">
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
        <v-btn
          class="my-2"
          color="primary"
          outlined
          :to="{name: 'order-type', params: { 'type': 'new' }}"
          nuxt
          exact
        >
          К новым заказам
        </v-btn>
        <v-btn
          class="my-2"
          color="primary"
          outlined
          :to="{name: 'order-type', params: { 'type': 'processing' }}"
          nuxt
          exact
        >
          К заказам в работе
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

        <v-card
          v-if="entity.status === 'created' || entity.status === 'cooking'"
          class="mt-2"
        >
          <v-card-text v-if="entity.status === 'created'">
            <v-btn
              color="primary"
              :loading="orderProcessing"
              @click="acceptOrder(entity)"
            >
              Взять в работу
            </v-btn>
          </v-card-text>
          <v-card-text v-if="entity.status === 'cooking'">
            <div class="d-flex justify-center align-center flex-wrap">
              <v-row>
                <v-col
                  cols="12"
                  md="10"
                  :offset-md="1"
                >
                  <v-select
                    v-model="selectedCourierToDeliver"
                    :items="relatedResourcesData.courier_own.data"
                    :loading="relatedResourcesData.courier_own.loading"
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
                    @click="transferToDelivery(entity, selectedCourierToDeliver)"
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
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DynamicTable from '../../../../components/DynamicTable/DynamicTable'
import relatedResourcesDataLoaderMixin from '../../../../mixins/relatedResourcesDataLoaderMixin'
import entityAccessMixin from '../../../../mixins/entityAccessMixin'
import orderCommonMixin from '../../../../mixins/orders/orderCommonMixin'
const lodashGet = require('lodash.get')

export default {
  components: {
    DynamicTable
  },
  mixins: [relatedResourcesDataLoaderMixin, entityAccessMixin, orderCommonMixin],

  middleware (context) {
    const { app, redirect, error } = context
    app.$dataSchema.loadResource('order')
      .then((resourceData) => {
        if (!resourceData) {
          error({ statusCode: 404, message: 'Entity not found' })
          return
        }

        let accessAbility = true
        if (resourceData.accessAbility !== undefined && typeof resourceData.accessAbility === 'function') {
          accessAbility = resourceData.accessAbility(context)
        }

        if (accessAbility === false) {
          return redirect('/')
        }
        if (typeof accessAbility === 'function') {
          // wtf, why it uses nuxtState of previous page ??? FIXME: now i use check and redirect in async data
          // return accessAbility()
        }
      })
  },

  async asyncData ({ app, error, $axios, params, redirect }) {
    const entityName = 'order'
    const resourceData = await app.$dataSchema.loadResource(entityName)
    if (!resourceData) {
      error({ statusCode: 404, message: 'Entity not found' })
      return
    }
    // todo move next line to doc page/file
    // details: https://axios.nuxtjs.org/usage.html#shortcuts
    const data = await $axios.$get(resourceData.getResourceEndpoint(params.id))
    if (data.data.restaurant_id !== app.$auth.user.restaurant_id) {
      redirect({ name: 'order', params: { type: 'processing' } })
    }

    const relatedResources = await app.$dataSchema.loadRelatedResources(resourceData)

    return {
      entityName,
      entity: data.data,
      fields: resourceData.headers,
      resourceData,
      relatedResources
    }
  },
  data () {
    return {
      // fields: headers
      snackbar: {
        active: false,
        color: 'info',
        text: '',
        item: null
      }
    }
  },
  created () {
    this.$dataSchema.loadResource(this.entityName)
      .then((resourceData) => {
        this.resourceData = resourceData
      })

    const extraResourceData = {
      axiosConfig: {
        params: {
          restaurant: this.$auth.user.restaurant_id
        }
      }
    }
    this.loadRelatedResourceData(this.relatedResources.courier, 'courier_own', extraResourceData)
  },
  methods: {
    lodashGet,
    async loadEntityData () {
      this.entity = (await this.$axios.$get(this.resourceData.getResourceEndpoint(this.$route.params.id))).data
    }
  },
  head () {
    return {
      title: this.entity.name
    }
  }
}
</script>

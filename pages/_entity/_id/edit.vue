<template>
  <v-container>
    <v-row>
      <v-col :cols="12">
        <!-- TODO :to -->
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

        <v-card>
          <v-card-title>Редактирование "{{ entity ? (entity.name ? entity.name : `${resourceData.titles.entity} #${entity.id}`) : (entityName ? entityName : 'ресурса') }}"</v-card-title>
          <v-card-text>
            <!-- TODO модификаторы вроде outlined для всех полей в форме (пример - https://vuetifyjs.com/en/components/textarea/#textareas) -->
            <form>
              <!-- todo ADD v-for AND vuelidate validation (see https://vuetifyjs.com/en/components/forms/#vuelidate)-->
              <template v-for="(field, key, index) in editableFields">
                <!-- TODO add new field types (maybe slider with input for decimal types) -->
                <!-- eslint-disable-next-line -->
                <v-text-field
                  v-if="field.fieldType === 'input' || field.fieldType === 'decimal'"
                  :key="`field_${index}`"
                  v-model="entity[key]"
                  :error="$v.entity[key].$dirty && $v.entity[key].$error"
                  :counter="0"
                  :label="field.label"
                  :required="!!field.fieldParams.required"
                  @input="$v.entity[key].$touch()"
                  @blur="$v.entity[key].$touch()"
                ></v-text-field>

                <!-- eslint-disable-next-line -->
                <v-text-field
                  v-if="field.fieldType === 'password'"
                  :key="`field_${index}`"
                  v-model="entity[key]"
                  :error="$v.entity[key].$dirty && $v.entity[key].$error"
                  :counter="0"
                  :label="field.label"
                  :required="!!field.fieldParams.required"
                  :type="field.fieldParams.type || 'password'"
                  autocomplete="new-password"
                  @input="$v.entity[key].$touch()"
                  @blur="$v.entity[key].$touch()"
                ></v-text-field>
                <!-- eslint-disable-next-line -->
                <v-text-field
                  v-if="field.fieldType === 'password' && field.confirmed === true"
                  :key="`field_${index}_confirmation`"
                  v-model="entity[`${key}${field.confirmationSuffix || '_confirmation'}`]"
                  :error="$v.entity[`${key}${field.confirmationSuffix || '_confirmation'}`].$dirty && $v.entity[`${key}${field.confirmationSuffix || '_confirmation'}`].$error"
                  :counter="0"
                  :label="`${field.label} ${field.confirmationSuffixLabel || '(повтор)'}`"
                  :required="!!field.fieldParams.required"
                  :type="field.fieldParams.type || 'password'"
                  autocomplete="new-password"
                  @input="$v.entity[`${key}${field.confirmationSuffix || '_confirmation'}`].$touch()"
                  @blur="$v.entity[`${key}${field.confirmationSuffix || '_confirmation'}`].$touch()"
                ></v-text-field>

                <!-- eslint-disable-next-line -->
                <v-textarea
                  v-if="field.fieldType === 'textarea'"
                  :key="`field_${index}`"
                  v-model="entity[key]"
                  :error="$v.entity[key].$dirty && $v.entity[key].$error"
                  :counter="0"
                  :label="field.label"
                  :required="!!field.fieldParams.required"
                  @input="$v.entity[key].$touch()"
                  @blur="$v.entity[key].$touch()"
                ></v-textarea>

                <!-- eslint-disable-next-line -->
                <v-image-preview-input
                  v-if="field.fieldType === 'image'"
                  :key="`field_${index}`"
                  v-model="entity[key]"
                  :label="field.label"
                  :preview-height="250"
                ></v-image-preview-input>

                <!-- eslint-disable-next-line -->
                <v-select
                  v-if="field.fieldType === 'relation'"
                  :key="`field_${index}`"
                  v-model="entity[key]"
                  :multiple="field.multiple || false"
                  :chips="field.chips || !!field.multiple"
                  :error="$v.entity[key].$dirty && $v.entity[key].$error"
                  :label="field.label"
                  :items="relatedResourcesData[field.relation.entity].data"
                  :loading="relatedResourcesData[field.relation.entity].loading"
                  :item-text="field.relation.textKey"
                  :item-value="field.relation.valueKey"
                  clearable
                ></v-select>

                <v-card
                  v-if="field.fieldType === 'dynamic-table'"
                  :key="`field_${index}`"
                >
                  <v-card-title>{{ field.label }}</v-card-title>
                  <v-card-text>
                    <!-- TODO add isFieldEnabled() to other field's types -->
                    <client-only>
                      <dynamic-table
                        :headers="field.table.headers"
                        :items.sync="entity[key]"
                        :reference-data="relatedResourcesData"
                        :editable="isFieldEnabled(field)"
                      />
                    </client-only>
                  </v-card-text>
                </v-card>

                <!-- eslint-disable-next-line -->
                <v-select
                  v-if="field.fieldType === 'enumeration'"
                  :key="`field_${index}`"
                  v-model="entity[key]"
                  :multiple="field.multiple || false"
                  :chips="field.chips || !!field.multiple"
                  :error="$v.entity[key].$dirty && $v.entity[key].$error"
                  :label="field.label"
                  :items="resourceData.enumerations[field.enumeration]"
                  clearable
                ></v-select>
              </template>

              <v-btn color="primary" class="mr-4" :loading="loading" @click="submit">
                Сохранить
              </v-btn>
            </form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { objectToFormData } from 'object-to-formdata'
import VImagePreviewInput from '../../../components/VImagePreviewInput'
import DynamicTable from '../../../components/DynamicTable/DynamicTable'
import entityWatchersMixin from '../../../mixins/entityWatchersMixin'
import relatedResourcesDataLoaderMixin from '../../../mixins/relatedResourcesDataLoaderMixin'

// const objectFilterWithKey = (obj, predicate) =>
//   Object.keys(obj)
//     .filter(key => predicate(obj[key], key))
//     .reduce((res, key) => Object.assign(res, { [key]: obj[key] }), {})
const objectFilter = (obj, predicate) =>
  Object.keys(obj)
    .filter(key => predicate(obj[key]))
    .reduce((res, key) => Object.assign(res, { [key]: obj[key] }), {})

export default {
  components: {
    VImagePreviewInput,
    DynamicTable
  },
  mixins: [validationMixin, entityWatchersMixin, relatedResourcesDataLoaderMixin],

  async asyncData ({ app, error, $axios, params }) {
    const resourceData = await app.$dataSchema.loadResource(params.entity)
    if (!resourceData) {
      error({ statusCode: 404, message: 'Entity not found' })
      return
    }
    const apiEndpoint = resourceData.getResourceEndpoint(params.id)
    const data = await $axios.$get(apiEndpoint)
    const entity = data.data
    const keys = Object.keys(resourceData.editableFields)
    for (const key of keys) {
      if (resourceData.editableFields[key].confirmed === true) {
        const fieldKeyName = `${key}${resourceData.editableFields[key].confirmationSuffix || '_confirmation'}`
        entity[fieldKeyName] = undefined
      }
    }

    const relatedResources = await app.$dataSchema.loadRelatedResources(resourceData)

    // fixes relations' properties values
    const editableFieldsWithRelations = objectFilter(
      resourceData.editableFields,
      field => field.fieldType === 'relation' && !!field.relation && !!field.relation.entity
    )
    for (const key in editableFieldsWithRelations) {
      // eslint-disable-next-line no-prototype-builtins
      if (editableFieldsWithRelations.hasOwnProperty(key) && entity.hasOwnProperty(key)) {
        if (editableFieldsWithRelations[key].multiple !== true) {
          // probably will never use
          if (typeof entity[key] === 'object' && entity[key] !== null) {
            entity[key] = entity[key][editableFieldsWithRelations[key].relation.valueKey]
          }
        } else {
          for (const relationKey in entity[key]) {
            // eslint-disable-next-line no-prototype-builtins
            if (entity[key].hasOwnProperty(relationKey)) {
              if (typeof entity[key][relationKey] === 'object') {
                entity[key][relationKey] = entity[key][relationKey][editableFieldsWithRelations[key].relation.valueKey]
              }
            }
          }
        }
      }
    }

    return {
      entityName: params.entity,
      apiEndpoint,
      entity,
      editableFields: resourceData.editableFields,
      validations: resourceData.validations,
      resourceData,
      relatedResources
    }
  },
  data () {
    return {
      loading: false,
      snackbar: {
        active: false,
        color: 'info',
        text: ''
      }
    }
  },
  computed: {
    // todo later (as plugin or part of scheme plugin) and add  :error-messages="nameErrors"  to inputs
    // nameErrors () {
    //   const errors = []
    //   if (!this.$v.name.$dirty) { return errors }
    //   !this.$v.name.maxLength && errors.push('Name must be at most 10 characters long')
    //   !this.$v.name.required && errors.push('Name is required.')
    //   return errors
    // }
    dataForSaving () {
      // eslint-disable-next-line prefer-const
      let data = {}
      // eslint-disable-next-line prefer-const
      for (let key in this.editableFields) {
        // eslint-disable-next-line no-prototype-builtins
        if (this.editableFields.hasOwnProperty(key) && this.entity.hasOwnProperty(key)) {
          data[key] = this.entity[key]
          if (this.editableFields[key].confirmed === true) {
            const fieldKeyName = `${key}${this.editableFields[key].confirmationSuffix || '_confirmation'}`
            data[fieldKeyName] = this.entity[fieldKeyName]
          }
        }
      }

      return data
    },

    entityRawDataForSaving () {
      const entityEditableKeys = Object.keys(this.entity).filter({}.hasOwnProperty.bind(this.editableFields))
      const preparedEntity = {}
      for (const entityEditableKey of entityEditableKeys) {
        preparedEntity[entityEditableKey] = this.entity[entityEditableKey]
      }
      return preparedEntity
    },
    formDataForSaving () {
      const formData = objectToFormData(
        this.entityRawDataForSaving,
        { indices: true }
      )
      // eslint-disable-next-line prefer-const
      for (let key in this.editableFields) {
        // eslint-disable-next-line no-prototype-builtins
        if (this.editableFields.hasOwnProperty(key) && this.entity.hasOwnProperty(key)) {
          if (this.editableFields[key].confirmed === true) {
            const fieldKeyName = `${key}${this.editableFields[key].confirmationSuffix || '_confirmation'}`
            formData.append(fieldKeyName, this.entity[fieldKeyName])
          }
        }
      }

      formData.append('_method', 'PUT') // for Laravel's backend

      return formData
    },

    // for development only
    fdDebug () {
      const res = {}
      for (const pair of this.formDataForSaving.entries()) {
        res[pair[0]] = pair[1]
      }
      return res
    }
  },
  // dynamic validation's schema. see details here https://vuelidate.js.org/#sub-dynamic-validation-schema
  validations () {
    let validationRules = {}
    if (typeof this.validations === 'function') {
      const validationContext = {
        pageType: 'edit'
      }
      validationRules = this.validations(validationContext)
    } else {
      validationRules = this.validations
    }
    return {
      entity: {
        ...validationRules // fixme
      }
    }
  },
  methods: {
    submit () {
      this.$v.$touch()
      if (!this.$v.$anyError) {
        this.loading = true
        // this.$axios.put
        this.$axios.post(this.apiEndpoint, this.formDataForSaving, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
          .then((response) => {
            // console.log(response.data) todo
            this.snackbar.color = 'success'
            this.snackbar.active = true
            this.snackbar.text = response.data.message
          })
          .catch((error) => {
            // console.log(error.response.data) todo
            this.snackbar.color = 'error'
            this.snackbar.active = true
            this.snackbar.text = error.response.data.message
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
    isFieldEnabled (field) {
      let result = true
      // TODO many checks
      for (const header of field.table.headers) {
        if (header.type === 'reference' &&
          !!header.reference &&
          !!header.reference.extra &&
          !!header.reference.extra.enableWhen &&
          !!header.reference.extra.enableWhen.filled) {
          for (const propertyKey of header.reference.extra.enableWhen.filled) {
            result = result && !!this.entity[propertyKey]
          }
        }
      }
      return result
    }
  },
  head () {
    return {
      title: `${this.entity.name || this.resourceData.titles.entity} – Редактирование`
    }
  }
}
</script>

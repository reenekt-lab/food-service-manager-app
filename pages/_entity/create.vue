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
          <v-card-title>Создание записи "{{ title }}"</v-card-title>
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
                  :type="field.fieldParams.type"
                  autocomplete="new-password"
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
                  :preview-max-height="500"
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
                    <dynamic-table
                      :headers="field.table.headers"
                      :items.sync="entity[key]"
                      :reference-data="relatedResourcesData"
                    />
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
import VImagePreviewInput from '../../components/VImagePreviewInput'
import DynamicTable from '../../components/DynamicTable/DynamicTable'

export default {
  components: {
    VImagePreviewInput,
    DynamicTable
  },
  mixins: [validationMixin],

  async asyncData ({ app, error, params }) {
    const resourceData = await app.$dataSchema.loadResource(params.entity)
    if (!resourceData) {
      error({ statusCode: 404, message: 'Entity not found' })
      return
    }
    const apiEndpoint = resourceData.apiPath

    const entity = {}
    const keys = Object.keys(resourceData.editableFields)
    for (const key of keys) {
      if (resourceData.editableFields[key].default !== undefined) {
        entity[key] = resourceData.editableFields[key].default
        continue
      }

      if (resourceData.editableFields[key].fieldType === 'image') {
        entity[key] = undefined
        // entity[key] = 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg' // todo REMOVE
        continue
      }
      if (resourceData.editableFields[key].fieldType === 'dynamic-table') {
        entity[key] = []
        continue
      }
      if (resourceData.editableFields[key].confirmed === true) {
        const fieldKeyName = `${key}${resourceData.editableFields[key].confirmationSuffix || '_confirmation'}`
        entity[fieldKeyName] = undefined
      }
      entity[key] = ''
    }

    const relatedResources = await app.$dataSchema.loadRelatedResources(resourceData)

    return {
      entityName: params.entity,
      apiEndpoint,
      entity,
      editableFields: resourceData.editableFields,
      validations: resourceData.validations,
      resourceData,
      relatedResources,
      title: resourceData.titles.entity
    }
  },
  data () {
    return {
      loading: false,
      snackbar: {
        active: false,
        color: 'info',
        text: ''
      },
      relatedResourcesData: {}
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
    formDataForSaving () {
      const formData = objectToFormData(
        this.entity,
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

      return formData
    }
  },
  created () {
    this.loadRelatedResourcesData()
  },
  // dynamic validation's schema. see details here https://vuelidate.js.org/#sub-dynamic-validation-schema
  validations () {
    // console.log('VALIDATIONS')
    let validationRules = {}
    if (typeof this.validations === 'function') {
      const validationContext = {
        pageType: 'create'
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
    loadRelatedResourcesData () {
      for (const key in this.relatedResources) {
        if (!this.relatedResourcesData[key]) {
          const relatedResourcesDataTemp = this.relatedResourcesData
          relatedResourcesDataTemp[key] = {
            loading: true,
            data: []
          }
          this.relatedResourcesData = Object.assign({}, relatedResourcesDataTemp)
        }

        this.$axios.get(this.relatedResources[key].apiPath)
          .then((response) => {
            const relatedResourcesDataTemp = this.relatedResourcesData
            relatedResourcesDataTemp[key].loading = false
            relatedResourcesDataTemp[key].data = response.data.data
            this.relatedResourcesData = Object.assign({}, relatedResourcesDataTemp)
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.log(error.response)
          })
      }
    }
  },
  head () {
    return {
      title: `${this.title} – Создание`
    }
  }
}
</script>

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
          <v-card-title>Редактирование "{{ entity ? (entity.name ? entity.name : `${entityName} ${entity.id}`) : (entityName ? entityName : 'ресурса') }}"</v-card-title>
          <v-card-text>
            <!-- TODO оценить необходимость генерации форм через схемы (будут ли другие типы полей кроме простых инпутов) -->
            <!-- TODO подумать - может вынести валидацию в схему resource-data.js -->
            <!-- TODO модификаторы вроде outlined для всех полей в форме (пример - https://vuetifyjs.com/en/components/textarea/#textareas) -->
            <form>
              <!-- todo ADD v-for AND vuelidate validation (see https://vuetifyjs.com/en/components/forms/#vuelidate)-->
              <template v-for="(field, key, index) in editableFields">
                <v-text-field
                  v-if="field.fieldType === 'input'"
                  :key="`field_${index}`"
                  v-model="entity[key]"
                  :error="$v.entity[key].$dirty && $v.entity[key].$error"
                  :counter="0"
                  :label="field.label"
                  :required="!!field.fieldParams.required"
                  @input="$v.entity[key].$touch()"
                  @blur="$v.entity[key].$touch()"
                ></v-text-field>

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

                <v-image-preview-input
                  v-if="field.fieldType === 'image'"
                  :key="`field_${index}`"
                  v-model="entity[key]"
                  :label="field.label"
                  :preview-height="250"
                ></v-image-preview-input>
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
import VImagePreviewInput from '../../../components/VImagePreviewInput'

export default {
  mixins: [validationMixin],
  components: {
    VImagePreviewInput
  },

  async asyncData ({ app, error, $axios, params }) {
    const resourceData = await app.$dataSchema.loadResource(params.entity)
    if (!resourceData) {
      error({ statusCode: 404, message: 'Entity not found' })
      return
    }
    const apiEndpoint = resourceData.getResourceEndpoint(params.id)
    const data = await $axios.$get(apiEndpoint)
    return {
      entityName: params.entity,
      apiEndpoint,
      entity: data.data,
      editableFields: resourceData.editableFields,
      validations: resourceData.validations
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

      imagesPreviews: {} // todo q
    }
  },
  // dynamic validation's schema. see details here https://vuelidate.js.org/#sub-dynamic-validation-schema
  validations () {
    return {
      entity: {
        ...this.validations
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
        }
      }

      return data
    },
    formDataForSaving () {
      // eslint-disable-next-line prefer-const
      let data = new FormData()
      // eslint-disable-next-line prefer-const
      for (let key in this.editableFields) {
        // eslint-disable-next-line no-prototype-builtins
        if (this.editableFields.hasOwnProperty(key) && this.entity.hasOwnProperty(key)) {
          data.append(key, this.entity[key])
        }
      }

      return data
    }
  },
  methods: {
    submit () {
      this.$v.$touch()
      if (!this.$v.$anyError) {
        this.loading = true
        this.$axios.put(this.apiEndpoint, this.formDataForSaving, {
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
    }
  },
  head () {
    return {
      title: `${this.entity.name} – Редактирование`
    }
  }
}
</script>

import { required } from 'vuelidate/lib/validators'

const restaurant = {
  // todo add icon
  // drawerMenu: {
  //   icon: 'mdi-table-chair',
  //   title: 'Рестораны'
  // },

  accessAbility (context) {
    if (process.client) {
      const { nuxtState, route, redirect } = context
      if (route.name !== 'restaurant') {
        return () => {
          return redirect({ name: 'restaurant' })
        }
      }
      return context.app.$auth.user.restaurant_id === nuxtState.data[0].entity.restaurant_id
    }
    return () => {
      context.redirect({ name: 'restaurant' })
    }
  },

  titles: {
    entity: 'Ресторан',
    entities: 'Рестораны'
  },
  apiPath: '/restaurants',
  getResourceEndpoint (id) {
    return `${this.apiPath}/${id}`
  },
  headers: [
    { text: 'ID', value: 'id' },
    { text: 'Название', value: 'name' },
    { text: 'Описание', value: 'description' },
    { text: 'Адрес', value: 'address' },
    {
      text: 'Категории',
      value: 'common_categories',
      type: 'relation',
      multiple: true,
      relation: { entity: 'common-category', valueKey: 'id', textKey: 'name' }
    },
    { text: 'Добавлен', value: 'created_at', type: 'datetime' },
    { text: 'Изменен', value: 'updated_at', type: 'datetime' },
    { text: 'Главное изображение', value: 'main_image', type: 'image' }
  ],
  editableFields: {
    name: {
      label: 'Название',
      fieldType: 'input',
      fieldParams: {
        required: true,
        type: 'text'
      }
    },
    description: {
      label: 'Описание',
      fieldType: 'textarea',
      fieldParams: {
        required: false
      }
    },
    address: {
      label: 'Адрес',
      fieldType: 'input',
      fieldParams: {
        required: true,
        type: 'text'
      }
    },
    categories: {
      label: 'Категории ресторана',
      fieldType: 'relation',
      multiple: true,
      chips: true, // todo move somewhere out of here
      relation: {
        entity: 'common-category',
        valueKey: 'id', // value of field
        textKey: 'name' // displaying text's key
      },
      fieldParams: {}
    },
    main_image: {
      label: 'Главное изображение',
      fieldType: 'image',
      fieldParams: {}
    }
  },
  validations: {
    name: {
      required
    },
    description: {

    },
    address: {
      required
    },
    categories: {}
  }
}

export default restaurant

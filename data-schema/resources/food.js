import { required, decimal } from 'vuelidate/lib/validators'

const food = {
  // todo add icon
  // drawerMenu: {
  //   icon: 'mdi-table-chair',
  //   title: 'Рестораны'
  // },
  titles: {
    entity: 'Еда / напиток',
    entities: 'Еда / напитки'
  },
  apiPath: '/food',
  getResourceEndpoint (id) {
    return `${this.apiPath}/${id}`
  },
  headers: [
    { text: 'ID', value: 'id' },
    { text: 'Название', value: 'name' },
    { text: 'Описание', value: 'description' },
    { text: 'Цена', value: 'cost' }, // todo add "type: 'decimal'"
    {
      text: 'Ресторан',
      value: 'restaurant.name',
      type: 'relation',
      relation: { entity: 'restaurant', key: 'restaurant.id' }
    },
    {
      text: 'Категории',
      value: 'categories',
      type: 'relation',
      multiple: true,
      relation: { entity: 'food-category', valueKey: 'id', textKey: 'name' }
    },
    {
      text: 'Теги',
      value: 'tags',
      type: 'relation',
      multiple: true,
      relation: { entity: 'food-tag', valueKey: 'id', textKey: 'name' }
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
    cost: {
      label: 'Цена',
      fieldType: 'decimal',
      fieldParams: {
        required: false,
        type: 'number'
      }
    },
    restaurant_id: {
      label: 'Ресторан',
      fieldType: 'relation',
      relation: {
        entity: 'restaurant',
        valueKey: 'id', // value of field
        textKey: 'name' // displaying text's key
      },
      fieldParams: {
        required: true
      }
    },
    categories: {
      label: 'Категории',
      fieldType: 'relation',
      multiple: true,
      chips: true, // todo move somewhere out of here
      relation: {
        entity: 'food-category',
        valueKey: 'id', // value of field
        textKey: 'name' // displaying text's key
      },
      fieldParams: {}
    },
    tags: {
      label: 'Теги',
      fieldType: 'relation',
      multiple: true,
      chips: true, // todo move somewhere out of here
      relation: {
        entity: 'food-tag',
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
    description: {},
    cost: {
      required,
      decimal
    },
    restaurant_id: {
      required
    },
    categories: {},
    tags: {}
  }
}

export default food

import { required } from 'vuelidate/lib/validators'

const commonCategory = {
  // todo add icon
  // drawerMenu: {
  //   icon: 'mdi-table-chair',
  //   title: 'Рестораны'
  // },

  // Middleware abilities
  createAbility: false,
  editAbility (context) {
    return false
  },
  // Page abilities
  canCreate (user) {
    return false
  },
  canEdit (user, entity) {
    return false
  },
  canDelete (user, entity) {
    return false
  },

  titles: {
    entity: 'Общая категория ресторана',
    entities: 'Общие категории ресторана'
  },
  apiPath: '/common-category',
  getResourceEndpoint (id) {
    return `${this.apiPath}/${id}`
  },
  headers: [
    { text: 'ID', value: 'id' },
    { text: 'Название', value: 'name' },
    { text: 'Добавлен', value: 'created_at' },
    { text: 'Изменен', value: 'updated_at' },
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
    main_image: {
      label: 'Главное изображение',
      fieldType: 'image',
      fieldParams: {}
    }
  },
  validations: {
    name: {
      required
    }
  }
}

export default commonCategory

import { required } from 'vuelidate/lib/validators'

const foodCategory = {
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
    entity: 'Категория еды / напитка',
    entities: 'Категории еды / напитков'
  },
  apiPath: '/categories',
  getResourceEndpoint (id) {
    return `${this.apiPath}/${id}`
  },
  headers: [
    { text: 'ID', value: 'id' },
    { text: 'Название', value: 'name' },
    { text: 'Описание', value: 'description' },
    { text: 'Родительская категория', value: 'parent.name', type: 'relation', relation: { entity: 'food-category', key: 'parent.id' } },
    { text: 'Добавлен', value: 'created_at', type: 'datetime' },
    { text: 'Изменен', value: 'updated_at', type: 'datetime' }
    // { text: 'Главное изображение', value: 'main_image', type: 'image' }
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
    parent_id: {
      label: 'Родительская категория',
      fieldType: 'relation',
      relation: {
        entity: 'food-category',
        valueKey: 'id', // value of field
        textKey: 'name' // displaying text's key
      },
      fieldParams: {
        required: true
      }
    }
    // main_image: {
    //   label: 'Главное изображение',
    //   fieldType: 'image',
    //   fieldParams: {}
    // }
  },
  validations: {
    name: {
      required
    },
    description: {

    },
    parent_id: {

    }
  }
}

export default foodCategory

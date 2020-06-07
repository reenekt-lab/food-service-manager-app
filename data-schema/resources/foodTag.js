import { required } from 'vuelidate/lib/validators'

const foodTag = {
  // todo add icon
  // drawerMenu: {
  //   icon: 'mdi-table-chair',
  //   title: 'Рестораны'
  // },
  titles: {
    entity: 'Тег еды / напитка',
    entities: 'Теги еды / напитков'
  },
  apiPath: '/tags',
  getResourceEndpoint (id) {
    return `${this.apiPath}/${id}`
  },
  headers: [
    { text: 'ID', value: 'id' },
    { text: 'Название', value: 'name' },
    { text: 'Описание', value: 'description' },
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

    }
  }
}

export default foodTag

import { required, sameAs } from 'vuelidate/lib/validators'

const courier = {
  // todo add icon
  // drawerMenu: {
  //   icon: 'mdi-table-chair',
  //   title: 'Рестораны'
  // },
  titles: {
    entity: 'Курьер',
    entities: 'Курьеры'
  },
  apiPath: '/courier',
  getResourceEndpoint (id) {
    return `${this.apiPath}/${id}`
  },
  headers: [
    { text: 'ID', value: 'id' },
    { text: 'Фамилия', value: 'surname' },
    { text: 'Имя', value: 'first_name' },
    { text: 'Отчество', value: 'middle_name' },
    { text: 'Телефон', value: 'phone_number' },
    { text: 'E-mail', value: 'email' },
    // { text: 'Название', value: 'is_admin' }, // todo maybe
    { text: 'Ресторан', value: 'restaurant.name', type: 'relation', relation: { entity: 'restaurant', key: 'restaurant.id' } },
    { text: 'Добавлен', value: 'created_at', type: 'datetime' },
    { text: 'Изменен', value: 'updated_at', type: 'datetime' }
    // { text: 'Главное изображение', value: 'main_image', type: 'image' } // todo maybe
  ],
  editableFields: {
    surname: {
      label: 'Фамилия',
      fieldType: 'input',
      fieldParams: {
        required: true,
        type: 'text'
      }
    },
    first_name: {
      label: 'Имя',
      fieldType: 'input',
      fieldParams: {
        required: true,
        type: 'text'
      }
    },
    middle_name: {
      label: 'Отчество',
      fieldType: 'input',
      fieldParams: {
        required: true,
        type: 'text'
      }
    },
    phone_number: {
      label: 'Телефон',
      fieldType: 'input',
      fieldParams: {
        required: true,
        type: 'text'
      }
    },
    email: {
      label: 'E-mail',
      fieldType: 'input',
      fieldParams: {
        required: true,
        type: 'text'
      }
    },
    password: {
      label: 'Пароль',
      fieldType: 'password',
      confirmed: true,
      confirmationSuffix: '_confirmation', // this is default
      confirmationSuffixLabel: '(повтор)', // this is default
      fieldParams: {
        required: true,
        type: 'password'
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
        required: false
      }
    }
    // main_image: {
    //   label: 'Главное изображение',
    //   fieldType: 'image',
    //   fieldParams: {}
    // }
  },
  // TODO validationContext as type (when rewrite on TypeScript)
  validations (validationContext = null) {
    const rules = {
      surname: {
        required
      },
      first_name: {
        required
      },
      middle_name: {

      },
      phone_number: {
        required
      },
      email: {
        required
      },
      password: {
        // required
      },
      restaurant_id: {}
    }

    if (validationContext !== null && validationContext.pageType === 'create') {
      rules.password = {
        required
      }

      rules[`password${this.editableFields.password.confirmationSuffix}`] = {
        required,
        sameAsPassword: sameAs('password')
      }
    } else {
      rules[`password${this.editableFields.password.confirmationSuffix}`] = {}
    }

    return rules
  }
}

export default courier

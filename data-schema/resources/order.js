import { required } from 'vuelidate/lib/validators'

const order = {
  // todo add icon
  // drawerMenu: {
  //   icon: 'mdi-table-chair',
  //   title: 'Рестораны'
  // },

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
  accessAbility (context) {
    if (process.client) {
      const { nuxtState, redirect } = context
      if (!nuxtState.data[0] || !nuxtState.data[0].entity) {
        return () => {
          return redirect({ name: 'order', params: { type: 'processing' } })
        }
      }
      if (context.app.$auth.user.restaurant_id !== nuxtState.data[0].entity.restaurant_id) {
        return () => {
          return redirect({ name: 'order', params: { type: 'processing' } })
        }
      }

      // if order's restaurant == manager's restaurant
      return true
    }
    return () => {
      return context.redirect({ name: 'order', params: { type: 'processing' } })
    }
  },
  getRedirectCallback (context) {
    if (context.route.name !== 'order-type') {
      return () => {
        context.redirect({ name: 'order-type', params: { type: 'processing' } })
      }
    }
    return null
  },

  titles: {
    entity: 'Заказ',
    entities: 'Заказы'
  },
  apiPath: '/order',
  getResourceEndpoint (id) {
    return `${this.apiPath}/${id}`
  },
  endpointRequestConfig: {
    params: {
      restaurant: '{{ auth.user.restaurant_id }}'
    }
  },
  enumerations: {
    orderStatus: [
      {
        text: 'Создан',
        value: 'created'
      },
      {
        text: 'Оплачен',
        value: 'paid'
      },
      {
        text: 'Готовится',
        value: 'cooking'
      },
      {
        text: 'Приготовлен',
        value: 'cooked'
      },
      {
        text: 'Доставляется',
        value: 'delivering'
      },
      {
        text: 'Доставлен',
        value: 'delivered'
      }
    ]
  },
  headers: [
    { text: 'ID', value: 'id' },
    {
      text: 'Клиент',
      value: 'customer.first_name',
      type: 'relation',
      relation: { entity: 'customer', key: 'customer.id' }
    },
    {
      text: 'Содержимое заказа',
      value: 'content',
      type: 'dynamic-table',
      table: {
        headers: [
          {
            text: 'Блюдо / напиток',
            value: 'food_id',
            type: 'reference',
            reference: { entity: 'food', valueKey: 'id', textKey: 'name' }
          },
          {
            text: 'Количество',
            value: 'count'
          }
        ]
      }
    },
    // {
    //   text: 'Ресторан',
    //   value: 'restaurant.name',
    //   type: 'relation',
    //   relation: { entity: 'restaurant', key: 'restaurant.id' }
    // },
    { text: 'Адрес', value: 'address' },
    {
      text: 'Курьер',
      value: 'courier.first_name',
      type: 'relation',
      relation: { entity: 'courier', key: 'courier.id' }
    },
    {
      text: 'Статус',
      value: 'status',
      type: 'enumeration',
      enumeration: 'orderStatus'
    },
    { text: 'Добавлен', value: 'created_at', type: 'datetime' },
    { text: 'Изменен', value: 'updated_at', type: 'datetime' }
  ],
  editableFields: {
    customer_id: {
      label: 'Клиент',
      fieldType: 'relation',
      relation: {
        entity: 'customer',
        valueKey: 'id', // value of field
        textKey: 'first_name' // displaying text's key
      },
      fieldParams: {
        required: true
      }
    },
    restaurant_id: {
      default: '{{ auth.user.restaurant_id }}',
      disabled: true,
      visible: false,
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
    content: {
      label: 'Содержимое заказа',
      fieldType: 'dynamic-table',
      table: {
        headers: [
          {
            text: 'Блюдо / напиток',
            value: 'food_id',
            type: 'reference',
            reference: {
              entity: 'food',
              valueKey: 'id',
              textKey: 'name',
              extra: {
                enableWhen: {
                  filled: [
                    'restaurant_id'
                  ]
                },
                resetWhen: {
                  changed: [
                    'restaurant_id'
                  ]
                },
                loadConditions: {
                  // maybe will created static conditions
                  entityRelated: {
                    // maybe will created post-body conditions, or maybe additional headers
                    query: {
                      restaurant: 'restaurant_id'
                    }
                  }
                  // todo (maybe) property: should reload on change, default = true
                }
              }
            }
          },
          {
            text: 'Количество',
            value: 'count'
          }
        ]
      },
      fieldParams: {}
    },
    address: {
      label: 'Адрес доставки',
      fieldType: 'input',
      fieldParams: {
        required: true,
        type: 'text'
      }
    },
    courier_id: {
      label: 'Курьер',
      fieldType: 'relation',
      relation: {
        entity: 'courier',
        valueKey: 'id', // value of field
        textKey: 'first_name' // displaying text's key
      },
      fieldParams: {
        required: true
      }
    },
    status: {
      label: 'Статус',
      fieldType: 'enumeration',
      enumeration: 'orderStatus',
      default: 'created',
      fieldParams: {}
    }
    // main_image: {
    //   label: 'Главное изображение',
    //   fieldType: 'image',
    //   fieldParams: {}
    // }
  },
  // TODO validationContext as type (when rewrite on TypeScript)
  validations: {
    customer_id: {
      required
    },
    content: {},
    restaurant_id: {
      required
    },
    address: {
      required
    },
    courier_id: {},
    status: {}
  }
}

export default order

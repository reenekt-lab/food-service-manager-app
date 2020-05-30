import restaurant from './data-schema/resources/restaurant'
import commonCategory from './data-schema/resources/commonCategory'
import food from './data-schema/resources/food'
import foodCategory from './data-schema/resources/foodCategory'
import foodTag from './data-schema/resources/foodTag'
import restaurantManager from './data-schema/resources/restaurantManager'
import courier from './data-schema/resources/courier'
import customer from './data-schema/resources/customer'
import order from './data-schema/resources/order'

// TODO overwrite resources (and in general everything) on typescript

const schema = {
  resources: {
    restaurant,
    commonCategory,
    food,
    foodCategory,
    foodTag,
    restaurantManager,
    courier,
    customer,
    order
  }
}

const drawerMenuItems = [
  [
    {
      icon: 'mdi-home-outline',
      title: 'Главная страница',
      to: '/'
    },
    {
      icon: 'mdi-store-outline',
      title: 'Заказы',
      to: { name: 'entity', params: { entity: 'order' } }
    }
  ],
  [
    {
      icon: 'mdi-table-chair',
      title: 'Рестораны',
      to: { name: 'entity', params: { entity: 'restaurant' } }
    },
    {
      icon: 'mdi-silverware',
      title: 'Категории ресторанов',
      to: { name: 'entity', params: { entity: 'common-category' } }
    }
  ],
  [
    {
      icon: 'mdi-silverware-fork-knife',
      title: 'Еда / напитки',
      to: { name: 'entity', params: { entity: 'food' } }
    },
    {
      icon: 'mdi-silverware-fork-knife',
      title: 'Категории еды / напитков',
      to: { name: 'entity', params: { entity: 'food-category' } }
    },
    {
      icon: 'mdi-silverware-fork-knife',
      title: 'Теги еды / напитков',
      to: { name: 'entity', params: { entity: 'food-tag' } }
    }
  ],
  [
    {
      icon: 'mdi-account-circle',
      title: 'Менеджеры ресторанов',
      to: { name: 'entity', params: { entity: 'restaurant-manager' } }
    },
    {
      icon: 'mdi-account-circle',
      title: 'Курьеры',
      to: { name: 'entity', params: { entity: 'courier' } }
    },
    {
      icon: 'mdi-account-circle',
      title: 'Клиенты',
      to: { name: 'entity', params: { entity: 'customer' } }
    }
  ]
]

export { schema, drawerMenuItems }

export default schema

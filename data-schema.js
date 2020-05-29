import restaurant from './data-schema/resources/restaurant'
import commonCategory from './data-schema/resources/commonCategory'
import food from './data-schema/resources/food'
import foodCategory from './data-schema/resources/foodCategory'
import foodTag from './data-schema/resources/foodTag'
import restaurantManager from './data-schema/resources/restaurantManager'
import courier from './data-schema/resources/courier'
import customer from './data-schema/resources/customer'

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
    customer
  }
}

export default schema

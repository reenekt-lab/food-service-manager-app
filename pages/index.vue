<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-container v-show="$vuetify.breakpoint.smAndUp">
      <v-row dense>
        <v-col
          :cols="12"
        >
          <v-card>
            <v-card-title class="headline" style="word-break: break-word;">
              Добро пожаловать в приложение для управления рестораном
            </v-card-title>
            <v-card-text>
              <p>Все доступные разделы можно увидеть в левом меню. Чтобы открыть меню нажмите на кнопку <v-icon>mdi-menu</v-icon> в верхнем левом углу.</p>
              <div v-if="false">
                <span>Разработчик сайта: </span> <span class="font-weight-medium">Андрей Семенцов</span>
                <div class="d-inline-block">
                  <a target="_blank" href="https://github.com/reenekt" style="text-decoration: none;"><v-icon class="text--primary">mdi-github</v-icon></a>
                  <a target="_blank" href="https://vk.com/reenekt" style="text-decoration: none;"><v-icon style="color: #0D47A1 !important;">mdi-vk</v-icon></a>
                </div>
                <div><b>Внимание: </b>Этот сайт является частью демонстрационного проекта Food Service</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row dense>
        <v-col
          :cols="12"
          :sm="6"
        >
          <v-card
            color="light-blue lighten-5"
            :loading="newOrdersCountLoading"
          >
            <v-card-title>Новые заказы</v-card-title>
            <v-card-text v-if="newOrdersCountLoading">
              Считаем количество новых заказов
            </v-card-text>
            <v-card-text v-else-if="newOrdersCount">
              У вас <b>{{ newOrdersCount }}</b> {{ getCounterWordForm('new', newOrdersCount) }} {{ getCounterWordForm('order', newOrdersCount) }}
            </v-card-text>
            <v-card-text v-else>
              Новых заказов нет
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                text
                nuxt
                :to="{ name: 'order-type', params: { type: 'new' } }"
              >
                Перейти
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col
          :cols="12"
          :sm="6"
        >
          <v-card
            color="teal lighten-5"
            :loading="processingOrdersCountLoading"
          >
            <v-card-title>Заказы в работе</v-card-title>
            <v-card-text v-if="processingOrdersCountLoading">
              Считаем количество заказов в работе
            </v-card-text>
            <v-card-text v-else-if="processingOrdersCount">
              У вас <b>{{ processingOrdersCount }}</b> {{ getCounterWordForm('order', processingOrdersCount) }} в процессе приготовления
            </v-card-text>
            <v-card-text v-else>
              Нет заказов в работе
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                text
                nuxt
                :to="{ name: 'order-type', params: { type: 'processing' } }"
              >
                Перейти
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>

<script>

export default {
  components: {
  },
  data () {
    return {
      newOrdersCountLoading: 'light-blue',
      newOrdersCount: 0,
      processingOrdersCountLoading: 'teal',
      processingOrdersCount: 0,
      counterWordForms: {
        order: {
          lastIsOne: 'заказ',
          lastFromTwoToFour: 'заказа',
          lastIsFiveAndMore: 'заказов'
        },
        new: {
          lastIsOne: 'новый',
          lastFromTwoToFour: 'новых',
          lastIsFiveAndMore: 'новых'
        }
      }
    }
  },
  created () {
    this.$dataSchema.loadResource('order')
      .then((resource) => {
        const apiEndpoint = resource.apiPath
        this.$axios.get(apiEndpoint, {
          params: {
            status: 'created',
            restaurant: this.$auth.user.restaurant_id
          }
        })
          .then((response) => {
            this.newOrdersCount = response.data.meta.total
          })
          .finally(() => {
            this.newOrdersCountLoading = false
          })
        this.$axios.get(apiEndpoint, {
          params: {
            status: 'cooking',
            restaurant: this.$auth.user.restaurant_id
          }
        })
          .then((response) => {
            this.processingOrdersCount = response.data.meta.total
          })
          .finally(() => {
            this.processingOrdersCountLoading = false
          })
      })
  },
  methods: {
    getCounterWordForm (wordKey, count) {
      const reminder = count % 10
      let form = 'lastIsFiveAndMore'
      if (reminder === 1) {
        form = 'lastIsOne'
      }
      if (reminder >= 2 && reminder <= 4) {
        form = 'lastFromTwoToFour'
      }
      return this.counterWordForms[wordKey][form]
    }
  },
  head () {
    return {
      title: 'Главная'
    }
  }
}
</script>

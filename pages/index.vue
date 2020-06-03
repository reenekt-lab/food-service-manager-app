<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-flex
      xs12
      sm8
      md6
    >
      <!-- TODO remove later-->
      <v-alert color="primary" outlined v-if="false">
        <!-- eslint-disable-next-line -->
        <div class="headline text-center">TODO</div>
        <ol>
          <li>Может сделать размытую картинку на фоне формы авторизации...</li>
          <li>Больше доступных типов полей на страницах создать/редактировать</li>
        </ol>
      </v-alert>

      <v-card>
        <v-card-title class="headline">
          Добро пожаловать в приложение для администрирования и управления Food Service
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
    </v-flex>
  </v-layout>
</template>

<script>

export default {
  components: {
  },
  head () {
    return {
      title: 'Главная'
    }
  }
}
</script>

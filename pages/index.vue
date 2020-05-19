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
      <v-alert color="primary" outlined>
        <div class="headline text-center">TODO</div>
        <ol>
          <li>Страница "создать" для ресторанов (которые будут переработаны - см пункт 4)</li>
          <li class="text--secondary"><s>Асинхронная загрузка данных в <code style="text-decoration: line-through;">v-data-table</code></s></li>
          <li class="text--secondary"><s>Работа <code style="text-decoration: line-through;">v-data-table</code> с бэкэндом</s></li>
          <li class="text--secondary"><s>Сделать текущие роуты <code style="text-decoration: line-through;">/restaurant</code> универсальными, вынести всё из <code style="text-decoration: line-through;">resource-data.js</code> в общий глобальный файл со "схемой" ресурсов и доработать "универсальые" страницы для работы с глобальным файлом-"схемой"</s></li>
          <li>Удалить этот список и не забыть поискать всякие <code>todo</code> комментарии</li>
          <li>Может сделать размытую картинку на фоне формы авторизации...</li>
          <li class="text--secondary"><s><code style="text-decoration: line-through;">absolute</code> для футера</s></li>
          <li>Больше доступных типов полей на страницах создать/редактировать</li>
        </ol>
      </v-alert>

      <v-card>
        <v-card-title class="headline">
          Добро пожаловать в приложение для администрирования и управления Food Service
        </v-card-title>
        <v-card-text>
          <p>Все доступные разделы можно увидеть в левом меню. Чтобы открыть меню нажмите на кнопку <v-icon>mdi-menu</v-icon> в верхнем левом углу.</p>
          <div>
            <span>Разработчик сайта: </span> <span class="font-weight-medium">Андрей Семенцов</span>
            <div class="d-inline-block">
              <a target="_blank" href="https://github.com/reenekt" style="text-decoration: none;"><v-icon class="text--primary">mdi-github</v-icon></a>
              <a target="_blank" href="https://vk.com/reenekt" style="text-decoration: none;"><v-icon style="color: #0D47A1 !important;">mdi-vk</v-icon></a>
            </div>
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

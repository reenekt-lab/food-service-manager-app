<template>
  <v-card
    class="pwa-install-prompt ma-2"
    color="orange darken-1"
    dark
    elevation="5"
  >
    <v-card-title>
      Всегда под рукой
    </v-card-title>
    <v-card-text>
      Установите наше приложение
    </v-card-text>
    <v-card-actions class="d-flex flex-column">
      <v-btn
        small
        block
        rounded
        dark
        @click="$emit('accepted')"
      >
        Установить
      </v-btn>
      <v-btn
        small
        block
        rounded
        text
        class="mt-2 ml-0"
        @click="$emit('declined')"
      >
        Нет, спасибо
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'PwaPromptCard',
  data () {
    return {

    }
  }
}
</script>

<style scoped lang="scss">
  .pwa-install-prompt {
    .v-card__title {
      padding: 12px 16px;
    }
    .v-card__text {
      padding-bottom: 12px;
    }
  }
</style>

<template>
  <v-app id="inspire">
    <v-content>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <nuxt />
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      items: [
        {
          icon: 'mdi-home-outline',
          title: 'Главная страница',
          to: '/'
        },
        {
          icon: 'mdi-table-chair',
          title: 'Рестораны',
          to: '/restaurant'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Auth'
    }
  }
}
</script>

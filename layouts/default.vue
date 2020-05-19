<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          nuxt
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
<!--      <v-btn-->
<!--        icon-->
<!--        @click.stop="miniVariant = !miniVariant"-->
<!--      >-->
<!--        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>-->
<!--      </v-btn>-->
<!--      <v-btn-->
<!--        icon-->
<!--        @click.stop="clipped = !clipped"-->
<!--      >-->
<!--        <v-icon>mdi-application</v-icon>-->
<!--      </v-btn>-->
<!--      <v-btn-->
<!--        icon-->
<!--        @click.stop="fixed = !fixed"-->
<!--      >-->
<!--        <v-icon>mdi-minus</v-icon>-->
<!--      </v-btn>-->
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-menu v-if="$auth.loggedIn" offset-y>
        <template v-slot:activator="{ on }">
          <v-btn
            text
            v-on="on"
          >
            <v-icon class="mr-2">mdi-account</v-icon>
            <span class="hidden-sm-and-down">{{ $auth.user.first_name }}</span>
            <v-icon class="ml-2 hidden-sm-and-down">mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            class="hidden-md-and-up"
            @click="logout"
          >
            <v-list-item-content>
              <v-list-item-title>{{ $auth.user.first_name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider class="hidden-md-and-up"></v-divider>
          <v-list-item
            @click="logout"
          >
            <v-list-item-title>Выйти</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
<!--      <v-btn-->
<!--        icon-->
<!--        @click.stop="rightDrawer = !rightDrawer"-->
<!--      >-->
<!--        <v-icon>mdi-menu</v-icon>-->
<!--      </v-btn>-->
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
<!--    <v-navigation-drawer-->
<!--      v-model="rightDrawer"-->
<!--      :right="right"-->
<!--      temporary-->
<!--      fixed-->
<!--    >-->
<!--      <v-list>-->
<!--        <v-list-item @click.native="right = !right">-->
<!--          <v-list-item-action>-->
<!--            <v-icon light>-->
<!--              mdi-repeat-->
<!--            </v-icon>-->
<!--          </v-list-item-action>-->
<!--          <v-list-item-title>Switch drawer (click me)</v-list-item-title>-->
<!--        </v-list-item>-->
<!--      </v-list>-->
<!--    </v-navigation-drawer>-->
    <v-footer
      :fixed="fixed"
      absolute
      app
    >
      <v-row>
        <v-col cols12>
          <div class="d-flex justify-space-between">
            <span>&copy; {{ new Date().getFullYear() }} Andrew Sementsov</span>
            <span>Made by <a target="_blank" href="https://github.com/reenekt">Andrew Sementsov</a></span>
          </div>
        </v-col>
      </v-row>
    </v-footer>
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
          to: { name: 'entity', params: { entity: 'restaurant' } }
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    }
  },
  methods: {
    async logout () {
      await this.$auth.logout()
      await this.$router.push('/login')
    }
  }
}
</script>

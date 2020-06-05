<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <template #default>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title">
              {{ title }}
            </v-list-item-title>
            <v-list-item-subtitle>
              Меню
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider />

        <v-list>
          <template v-for="(group, gi) in items">
            <v-list-item
              v-for="(item, i) in group"
              :key="`group_${gi}_item_${i}`"
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
            <v-divider v-if="gi < (items.length - 1)" :key="`divider_${gi}`" />
          </template>
        </v-list>
      </template>
      <template #append>
        <pwa-prompt-card
          v-if="showPwaPromptCard"
          @accepted="promptPwaInstall"
          @declined="hidePwaPromptCardCard"
        />
      </template>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
      color="orange darken-1"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <!-- eslint-disable -->
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
      <!-- eslint-enable -->
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-menu v-if="$auth.loggedIn" offset-y>
        <template v-slot:activator="{ on }">
          <v-btn
            text
            v-on="on"
          >
            <!-- eslint-disable-next-line -->
            <v-icon class="mr-2">mdi-account</v-icon>
            <span class="hidden-sm-and-down">{{ $auth.user.first_name }}</span>
            <!-- eslint-disable-next-line -->
            <v-icon class="ml-2 hidden-sm-and-down">mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            class="hidden-md-and-up"
          >
            <v-list-item-content>
              <v-list-item-title>{{ $auth.user.first_name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider class="hidden-md-and-up" />
          <v-list-item
            @click="logout"
          >
            <v-list-item-title>Выйти</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <!-- eslint-disable -->
<!--      <v-btn-->
<!--        icon-->
<!--        @click.stop="rightDrawer = !rightDrawer"-->
<!--      >-->
<!--        <v-icon>mdi-menu</v-icon>-->
<!--      </v-btn>-->
      <!-- eslint-enable -->
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <!-- eslint-disable -->
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
    <!-- eslint-enable -->
    <v-footer
      :fixed="fixed"
      absolute
      app
    >
      <v-row>
        <v-col cols12>
          <div class="d-flex justify-space-between">
            <span v-if="false">&copy; {{ new Date().getFullYear() }} Andrew Sementsov</span>
            <span>&copy; {{ new Date().getFullYear() }} Андрей Семенцов</span>
            <span v-if="false">Made by <a target="_blank" href="https://github.com/reenekt">Andrew Sementsov</a></span>
            <span>Сайт разработал <a target="_blank" href="https://github.com/reenekt">Андрей Семенцов</a></span>
          </div>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
import { drawerMenuItems } from '../data-schema'
import PwaPromptCard from '../components/PwaPromptCard/PwaPromptCard'

export default {
  components: {
    PwaPromptCard
  },
  data () {
    return {
      clipped: false,
      drawer: null,
      fixed: false,
      items: drawerMenuItems || [],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: process.env.APP_NAME || 'Food Service App',
      showPwaPromptCard: false
    }
  },
  mounted () {
    window.addEventListener('pwa-prompt-caught', (event) => {
      this.showPwaPromptCard = this.$pwaInstaller.canBeInstalled
    })
  },
  methods: {
    async logout () {
      await this.$auth.logout()
      await this.$router.push('/login')
    },
    promptPwaInstall () {
      this.$pwaInstaller.promptInstall()
      this.hidePwaPromptCardCard()
    },
    hidePwaPromptCardCard () {
      this.showPwaPromptCard = false
    }
  }
}
</script>

<style scoped lang="scss">
  header {
    .v-toolbar__content {
      .v-toolbar__title {
        @media screen and (max-width: 330px) {
          font-size: 1.15rem !important;
        }
      }
    }
  }
</style>

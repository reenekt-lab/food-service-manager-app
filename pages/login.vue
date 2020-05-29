<template>
  <v-card class="elevation-12">
    <v-toolbar
      color="primary"
      dark
      flat
    >
      <v-spacer></v-spacer>
      <v-toolbar-title>Авторизация</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-card-text>
      <v-form>
        <v-text-field
          v-model="email"
          label="Email"
          name="email"
          prepend-icon="mdi-account"
          type="text"
          :error="error"
          @input="() => { error = false }"
        />

        <v-text-field
          id="password"
          v-model="password"
          label="Пароль"
          name="password"
          prepend-icon="mdi-lock"
          type="password"
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="primary"
        :loading="loading"
        @click="sendLoginRequest"
      >
        Войти
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  layout: 'auth',
  auth: 'guest',
  name: 'Login',
  data () {
    return {
      email: '',
      password: '',
      error: false,
      loading: false
    }
  },
  methods: {
    async sendLoginRequest () {
      this.loading = true
      try {
        await this.$auth.loginWith('laravelPassportPassword', {
          data: {
            username: this.email,
            password: this.password
          }
        })
        await this.$router.push('/')
      } catch (err) {
        console.log(err) // todo
        this.error = true
      } finally {
        this.loading = false
      }
    }
  },
  head () {
    return {
      title: 'Авторизация'
    }
  }
}
</script>

<style scoped>

</style>

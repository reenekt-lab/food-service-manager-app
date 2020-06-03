<template>
  <v-app id="inspire">
    <v-content>
      <!--<v-img class="layout-bg" :src="require('../assets/bg_pattern.png')" eager></v-img>-->
      <div
        class="layout-bg"
        :style="{
          'background-image': backgroundImageUrl
        }"
      />
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
      backgroundImage: require('../assets/bg_pattern.png')
    }
  },
  computed: {
    backgroundImageUrl () {
      return `url(${this.backgroundImage})`
    }
  }
}
</script>

<style scoped lang="scss">
  .layout-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-repeat: repeat;
  }
</style>

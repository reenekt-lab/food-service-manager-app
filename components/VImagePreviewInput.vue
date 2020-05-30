<template>
  <div>
    <v-file-input
      v-if="mode === 'edit'"
      v-model="image"
      show-size
      :counter="changed === true"
      :accept="accept"
      :label="label"
      :prepend-icon="prependIcon"
      full-width
      class="preview-image"
      :loading="loading"
      @change="onChanged"
    >
      <template v-slot:selection="{ file }">
        <!-- eslint-disable -->
        <v-img
          eager
          contain
          :src="(changed === false && url) ? url : generateBlobUrl(file)"
          :height="previewHeight"
          :max-height="previewMaxHeight"
          @load="revokeBlobUrlDelayed"
        ></v-img>
        <!-- eslint-enable -->
      </template>
    </v-file-input>
    <!-- eslint-disable -->
    <v-img
      v-if="mode === 'preview'"
      eager
      contain
      title="Кликните чтобы изменить изображение"
      :src="url"
      :height="previewHeight"
      :max-height="previewMaxHeight"
      @click="() => { mode = 'edit' }"
    ></v-img>
    <!-- eslint-enable -->
  </div>
</template>

<script>
export default {
  name: 'VImagePreviewInput',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    label: {
      required: false,
      type: String,
      default: ''
    },
    accept: {
      required: false,
      type: String,
      default: 'image/*'
    },
    prependIcon: {
      required: false,
      type: String,
      default: 'mdi-image-outline'
    },
    previewHeight: {
      required: false,
      type: [Number, String],
      default: 'auto'
    },
    previewMaxHeight: {
      required: false,
      type: [Number, String],
      default: 300
    },
    // eslint-disable-next-line
    value: {
      // type: [String, Object],
      default: undefined
    }
  },
  data () {
    return {
      url: null, // url of previous image
      changed: false,
      loading: false,
      image: null,
      mode: 'edit' // edit | preview
    }
  },
  watch: {
    image (val, oldVal) {
      this.$emit('change', val)
    }
  },
  created () {
    if (typeof this.value !== 'string') {
      this.image = this.value
    } else {
      // sync variant of created()
      // this.loadImageFromUrl(this.value)
      //   .then((imageFile) => {
      //     console.log(URL.createObjectURL(imageFile))
      //     this.image = imageFile
      //   })

      // async variant of created()
      // this.image = await this.loadImageFromUrl(this.value)

      this.mode = 'preview'

      this.url = this.value
    }
  },
  methods: {
    generateBlobUrl (file, lifetime = 4000) {
      const url = URL.createObjectURL(file)
      setTimeout(() => {
        this.revokeBlobUrl(url)
      }, lifetime)
      return url
    },
    revokeBlobUrl (url) {
      URL.revokeObjectURL(url)
    },
    revokeBlobUrlDelayed (url) {
      setTimeout(() => {
        this.revokeBlobUrl(url)
      }, 250) // fixes too early revoking
    },

    // https://gist.github.com/javilobo8/097c30a233786be52070986d8cdb1743
    async loadImageFromUrl (url) {
      this.loading = true
      const data = await this.$axios.$request({
        url,
        method: 'GET',
        responseType: 'blob' // important
      })
      this.loading = false
      return new File([data], 'temp.image', {
        type: data.type
      })
    },

    onChanged (file) {
      this.changed = true
      this.$emit('change', file)
    }
  }
}
</script>

<style lang="scss">
.preview-image {
  .v-text-field__slot {
    max-width: calc(100% - 24px); // hardcode
  }
}
</style>

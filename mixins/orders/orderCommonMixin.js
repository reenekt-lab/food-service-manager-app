export default {
  data () {
    return {
      orderProcessing: false, // loading state for processing order
      selectedCourierToDeliver: null
    }
  },
  methods: {
    acceptOrder (order) {
      this.orderProcessing = true

      const url = this.resourceData.getResourceEndpoint(order.id)
      const data = {
        status: 'cooking',
        _method: 'PUT'
      }
      let loadDataMethod = this.loadEntityData
      if (!this.loadEntityData && this.loadPageData) {
        loadDataMethod = this.loadPageData
      }
      this.$axios.post(url, data)
        .then((response) => {
          this.snackbar.color = 'success'
          this.snackbar.active = true
          this.snackbar.item = order
          this.snackbar.text = 'Заказ принят в работу'
          loadDataMethod(this.currentPage)
            .then(() => {
              this.orderProcessing = false
            })
        })
    },
    transferToDelivery (order, courierId) {
      this.orderProcessing = true

      const url = this.resourceData.getResourceEndpoint(order.id)
      const data = {
        status: 'delivering',
        courier_id: courierId,
        _method: 'PUT'
      }
      let loadDataMethod = this.loadEntityData
      if (!this.loadEntityData && this.loadPageData) {
        loadDataMethod = this.loadPageData
      }
      this.$axios.post(url, data)
        .then((response) => {
          this.snackbar.color = 'success'
          this.snackbar.active = true
          this.snackbar.item = order
          this.snackbar.text = 'Заказ передан курьеру'
          this.selectedCourierToDeliver = null
          loadDataMethod(this.currentPage)
            .then(() => {
              this.orderProcessing = false
            })
        })
    }
  }
}

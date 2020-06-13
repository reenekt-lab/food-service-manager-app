// import Vue from 'vue'

/**
 * Made with https://web.dev/customize-install/ guide
 */
class PwaInstaller {
  // install (Vue, options) {
  //   // todo
  //   Vue.mixin({
  //     created () {
  //       console.log('PwaInstaller plugin installed')
  //       console.log(this)
  //     }
  //   })
  // }

  constructor () {
    // GLOBAL ACCESS (client only)
    window.pwaInfo = this

    this.pwaInstalled = false
    this.pwaInstallEvent = null
    // catch and prevent default promotion in order to run it later (see promptInstall method)
    window.addEventListener('beforeinstallprompt', (event) => {
      // Prevent the mini-infobar from appearing on mobile
      event.preventDefault()
      // todo custom event in window
      // Stash the event so it can be triggered later.
      this.pwaInstallEvent = event

      const customEvent = new CustomEvent('pwa-prompt-caught')
      window.dispatchEvent(customEvent)
    })

    window.addEventListener('appinstalled', (event) => {
      this.pwaInstalled = true
      // Log install to analytics
      console.log('INSTALL: Success')
    })
  }

  // fixme: does not work correctly in vue (nuxt pages)
  get canBeInstalled () {
    return this.pwaInstalled === false && this.pwaInstallEvent !== null
  }

  promptInstall () {
    if (this.pwaInstallEvent === null) {
      console.warn('[PWA Installer plugin] Cannot prompt installation')
      return
    }
    // Show the install prompt
    this.pwaInstallEvent.prompt()
    // Wait for the user to respond to the prompt
    this.pwaInstallEvent.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt')
      } else {
        console.log('User dismissed the install prompt')
      }
    })
  }
}
export default ({ app }, inject) => {
  const pwaInstaller = new PwaInstaller()
  // Vue.use(pwaInstaller)
  inject('pwaInstaller', pwaInstaller)
}

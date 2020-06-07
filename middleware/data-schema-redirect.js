export default function (context) {
  const { app, params, route, error } = context
  app.$dataSchema.loadResource(params.entity || route.name)
    .then((resourceData) => {
      if (!resourceData) {
        error({ statusCode: 404, message: 'Entity not found' })
        return
      }

      let redirectCallback = null
      if (resourceData.accessAbility !== undefined && typeof resourceData.accessAbility === 'function') {
        redirectCallback = resourceData.getRedirectCallback(context)
      }

      if (redirectCallback !== null && typeof redirectCallback === 'function') {
        return redirectCallback()
      }
    })
}

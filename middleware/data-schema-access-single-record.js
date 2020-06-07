export default function (context) {
  const { app, params, redirect, error } = context
  app.$dataSchema.loadResource(params.entity)
    .then((resourceData) => {
      if (!resourceData) {
        error({ statusCode: 404, message: 'Entity not found' })
        return
      }

      let accessAbility = true
      if (resourceData.accessAbility !== undefined && typeof resourceData.accessAbility === 'function') {
        accessAbility = resourceData.accessAbility(context)
      }

      if (accessAbility === false) {
        return redirect('/')
      }
      if (typeof accessAbility === 'function') {
        return accessAbility()
      }
    })
}

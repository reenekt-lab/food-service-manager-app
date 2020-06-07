export default function (context) {
  const { app, params, redirect, error } = context
  app.$dataSchema.loadResource(params.entity)
    .then((resourceData) => {
      if (!resourceData) {
        error({ statusCode: 404, message: 'Entity not found' })
        return
      }

      let createAbility = true
      if (resourceData.createAbility !== undefined) {
        if (typeof resourceData.createAbility !== 'function' &&
          resourceData.createAbility === false) {
          createAbility = false
        }
        if (typeof resourceData.createAbility === 'function') {
          createAbility = resourceData.createAbility(context)
        }
      }

      if (createAbility === false) {
        return redirect('/')
      }
    })
}

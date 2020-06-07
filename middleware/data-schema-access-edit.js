export default function (context) {
  const { app, params, redirect, error } = context
  app.$dataSchema.loadResource(params.entity)
    .then((resourceData) => {
      if (!resourceData) {
        error({ statusCode: 404, message: 'Entity not found' })
        return
      }

      let editAbility = true
      if (resourceData.editAbility !== undefined) {
        if (typeof resourceData.editAbility !== 'function' &&
          resourceData.editAbility === false) {
          editAbility = false
        }
        if (typeof resourceData.editAbility === 'function') {
          editAbility = resourceData.editAbility(context)
        }
      }

      if (editAbility === false) {
        return redirect('/')
      }
    })
}

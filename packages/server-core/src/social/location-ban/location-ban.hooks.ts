import { Forbidden } from '@feathersjs/errors'
import { HookContext } from '@feathersjs/feathers'
import { disallow } from 'feathers-hooks-common'

import authenticate from '../../hooks/authenticate'
import { extractLoggedInUserFromParams } from '../../user/auth-management/auth-management.utils'

export default {
  before: {
    all: [authenticate()],
    find: [],
    get: [],
    create: [
      async (context): Promise<HookContext> => {
        const { app, data } = context
        const loggedInUser = extractLoggedInUserFromParams(context.params)
        const locationAdmins = await app.service('location-admin').find({
          query: {
            locationId: data.locationId,
            userId: loggedInUser.id
          }
        })
        if (locationAdmins.total === 0) {
          throw new Forbidden('Not an admin of that location')
        }
        return context
      }
    ],
    update: [disallow()],
    patch: [disallow()],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
} as any

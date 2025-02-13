import { disallow } from 'feathers-hooks-common'
import { SYNC } from 'feathers-sync'

import addUriToFile from '@xrengine/server-core/src/hooks/add-uri-to-file'
import logRequest from '@xrengine/server-core/src/hooks/log-request'
import makeS3FilesPublic from '@xrengine/server-core/src/hooks/make-s3-files-public'
import reformatUploadResult from '@xrengine/server-core/src/hooks/reformat-upload-result'
import attachOwnerIdInSavingContact from '@xrengine/server-core/src/hooks/set-loggedin-user-in-body'
import setResponseStatus from '@xrengine/server-core/src/hooks/set-response-status-code'

import authenticate from '../../hooks/authenticate'

// Don't remove this comment. It's needed to format import lines nicely.

export default {
  before: {
    all: [logRequest()],
    find: [disallow()],
    get: [],
    create: [authenticate(), attachOwnerIdInSavingContact('userId'), addUriToFile(), makeS3FilesPublic()],
    update: [disallow()],
    patch: [disallow()],
    remove: [disallow()]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      reformatUploadResult(),
      // removePreviousFile(),
      // createOwnedFile(),
      (context) => (context[SYNC] = false),
      setResponseStatus(200)
    ],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [logRequest()],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
} as any

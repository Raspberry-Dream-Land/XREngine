import Immutable from 'immutable'
import { SET_SCOPE_READ_ERROR, SET_SCOPE_WRITE_ERROR } from '../actions'
import { ErrorActionType } from './ErrorActions'

import { createState, useState, none, Downgraded } from '@hookstate/core'

const state = createState({
  readError: {
    scopeErrorMessage: '',
    statusCode: 0
  },
  writeError: {
    scopeErrorMessage: '',
    statusCode: 0
  }
})

export const ErrorReducer = (_, action: ErrorActionType) => {
  Promise.resolve().then(() => errorReceptor(action))
  return state.attach(Downgraded).value
}

const errorReceptor = (action: ErrorActionType): any => {
  state.batch((s) => {
    switch (action.type) {
      case SET_SCOPE_READ_ERROR:
        return s.merge({ readError: { scopeErrorMessage: action.message, statusCode: action.statusCode } })
      case SET_SCOPE_WRITE_ERROR:
        return s.merge({ writeError: { scopeErrorMessage: action.message, statusCode: action.statusCode } })
    }
  }, action.type)
}

export const errorState = () => state
export const useErrorState = () => useState(state)
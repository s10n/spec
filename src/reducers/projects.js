import _ from 'lodash'
import { combineReducers } from 'redux'
import dotProp from 'dot-prop-immutable'
import { types } from '../actions/project'

const list = (state = {}, action) => {
  switch (action.type) {
    case types.INIT:
      return {}

    case types.FETCH:
      return action.projects.list || {}

    case types.CREATE:
    case types.UPDATE:
      return dotProp.set(state, action.key, action.project)

    case types.DELETE:
      return dotProp.delete(state, action.key)

    default:
      return state
  }
}

const order = (state = [], action) => {
  switch (action.type) {
    case types.INIT:
      return []

    case types.FETCH:
      return action.projects.order || []

    case types.CREATE:
      return [...state, action.key]

    case types.DELETE:
      return _.without(state, action.key)

    default:
      return state
  }
}

const state = (state = 'idle', action) => {
  switch (action.type) {
    case types.INIT:
      return 'idle'

    case types.FETCH:
      return 'projects'

    default:
      return state
  }
}

export default combineReducers({ list, order, state })

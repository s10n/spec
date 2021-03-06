import without from 'lodash/fp/without'
import { combineReducers } from 'redux'
import dotProp from 'dot-prop-immutable'
import { types } from '../actions/specActions'

const list = (state = {}, action) => {
  switch (action.type) {
    case types.INIT:
      return {}

    case types.FETCH:
      return action.specs.list || {}

    case types.CREATE:
    case types.UPDATE:
      return dotProp.set(state, action.key, action.spec)

    case types.DELETE:
      return dotProp.delete(state, action.key)

    default:
      return state
  }
}

const orders = (state = {}, action) => {
  switch (action.type) {
    case types.INIT:
      return {}

    case types.FETCH:
      return action.specs.orders || {}

    case types.CREATE:
      return action.featureKey
        ? dotProp.merge(state, action.featureKey, [action.key])
        : state

    case types.DELETE:
      return action.featureKey
        ? dotProp.set(
            state,
            action.featureKey,
            without([action.key])(state[action.featureKey])
          )
        : state

    default:
      return state
  }
}

export default combineReducers({ list, orders })

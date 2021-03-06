import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import { reducer as form } from 'redux-form'
import app from './appReducer'
import auth from './authReducer'
import user from './userReducer'
import projects from './projectsReducer'
import features from './featuresReducer'
import specs from './specsReducer'

export default combineReducers({
  app,
  auth,
  user,
  projects,
  features,
  specs,
  router,
  form
})

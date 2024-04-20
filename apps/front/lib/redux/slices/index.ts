import { combineReducers } from 'redux';
import adminReducer from './adminSlice';
import newsReducer from './newsSlice';
import organizationReducer from './organizationSlice';
import projectReducer from './projectSlice';

export * from './adminSlice';
export * from './newsSlice';
export * from './organizationSlice';
export * from './projectSlice';

export default combineReducers({
  adminReducer,
  newsReducer,
  organizationReducer,
  projectReducer,
});

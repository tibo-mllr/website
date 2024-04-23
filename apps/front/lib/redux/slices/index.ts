import { combineSlices } from '@reduxjs/toolkit';
import { adminSlice } from './adminSlice';
import { newsSlice } from './newsSlice';
import { organizationSlice } from './organizationSlice';
import { projectSlice } from './projectSlice';

export * from './adminSlice';
export * from './newsSlice';
export * from './organizationSlice';
export * from './projectSlice';

export default combineSlices(
  adminSlice,
  newsSlice,
  organizationSlice,
  projectSlice,
);

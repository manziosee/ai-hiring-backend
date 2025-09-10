import { createReducer } from '@ngrx/store';

export interface JobState {
  jobs: any[];
  loading: boolean;
  error: string | null;
}

const initialState: JobState = {
  jobs: [],
  loading: false,
  error: null
};

export const jobReducer = createReducer(initialState);
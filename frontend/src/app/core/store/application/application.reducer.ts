import { createReducer } from '@ngrx/store';

export interface ApplicationState {
  applications: any[];
  loading: boolean;
  error: string | null;
}

const initialState: ApplicationState = {
  applications: [],
  loading: false,
  error: null
};

export const applicationReducer = createReducer(initialState);
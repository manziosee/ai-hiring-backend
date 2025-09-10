import { ActionReducerMap } from '@ngrx/store';
import { authReducer, AuthState } from './auth/auth.reducer';
import { jobReducer, JobState } from './job/job.reducer';
import { applicationReducer, ApplicationState } from './application/application.reducer';

export interface AppState {
  auth: AuthState;
  jobs: JobState;
  applications: ApplicationState;
}

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  jobs: jobReducer,
  applications: applicationReducer
};
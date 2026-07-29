import { createSelector } from '@ngrx/store';
import { SchedulingState } from '../reducers';

export const getSchedulingState = (state: SchedulingState) => state.scheduling.allocation;

export const getSearchParams = createSelector(getSchedulingState, (result) => {
  if (result.params) {
    const { pageSize, pageNumber, ...params } = result.params;

    return params;
  }
});

export const getSearchMetadata = createSelector(getSchedulingState, ({ totalResults, params }) => ({
  totalResults,
  pageSize: (params && params.pageSize) || 10,
  currentPage: params && params.pageNumber
}));

export const getSearchResults = createSelector(getSchedulingState, (result) => result.hearingSlots);

import { AxiosError } from 'axios';
import { createAction, createReducer } from 'redux-act';

import { FetchStatusFlag } from 'app/constants';
import { CategoryBooksResponse } from 'app/services/category/requests';
import { DefaultCollectionState } from 'app/services/collection';

import { SortOptionValue } from './constants';

export const Actions = {
  loadCategoryListRequest: createAction('loadCategoryListRequest'),

  loadCategoryListSuccess: createAction<{
    categoryList: Categories[];
  }>('loadCategoryListSuccess'),

  loadCategoryListFailure: createAction('loadCategoryListFailure'),

  initializeCategoryId: createAction('initializeCategoryId'),

  initializeCategoriesWhole: createAction<{
    shouldFetchCategoryList: boolean;
    shouldInitializeCategoryId: boolean;
  }>('initializeCategoriesWhole'),

  cacheCategoryId: createAction<{
    categoryId: number;
  }>('cacheCategoryId'),

  loadCategoryBooksRequest: createAction<{
    categoryId: number;
    page: number;
    sort: SortOptionValue;
  }>('loadCategoryBooksRequest'),

  loadCategoryBooksSuccess: createAction<{
    categoryId: number;
    page: number;
    response: CategoryBooksResponse;
  }>('loadCategoryBooksSuccess'),

  loadCategoryBooksFailure: createAction<{
    categoryId: number;
    page: number;
    error: AxiosError;
  }>('loadCategoryBooksFailure'),
};

export interface CategoryItem {
  id: number;
  name: string;
}

export interface Categories extends CategoryItem {
  children: CategoryItem[];
  parent: {
    id: number;
    name: string;
  };
}

export interface CategoryListState {
  lastSelectedCategoryId?: number;
  itemList: Categories[];
  fetchStatus: FetchStatusFlag;
  isFetched: boolean;
}

export interface CategoryBooksState {
  [categoryId: number]: CategoryCollectionState;
}

export const categoryListInitialState: CategoryListState = {
  lastSelectedCategoryId: undefined,
  itemList: [],
  fetchStatus: FetchStatusFlag.IDLE,
  isFetched: false,
};

export interface CategoryCollectionState extends DefaultCollectionState {
  name: string;
}

export const INITIAL_STATE: CategoryBooksState = {};

export const categoryListReducer = createReducer<typeof INITIAL_STATE>({}, INITIAL_STATE);

categoryListReducer.on(Actions.loadCategoryListRequest, state => ({
  ...state,
  fetchStatus: FetchStatusFlag.FETCHING,
}));

categoryListReducer.on(Actions.loadCategoryListSuccess, (state, { categoryList }) => ({
  ...state,
  fetchStatus: FetchStatusFlag.IDLE,
  isFetched: true,
  itemList: categoryList,
}));

categoryListReducer.on(Actions.loadCategoryListFailure, state => ({
  ...state,
  fetchStatus: FetchStatusFlag.FETCH_ERROR,
}));

categoryListReducer.on(Actions.cacheCategoryId, (state, { categoryId }) => ({
  ...state,
  lastSelectedCategoryId: categoryId,
}));

export const categoryBooksReducer = createReducer<typeof INITIAL_STATE>({}, INITIAL_STATE);

categoryBooksReducer.on(
  Actions.loadCategoryBooksRequest,
  (state = INITIAL_STATE, { page, categoryId }) => ({
    ...state,
    [categoryId]: {
      ...state[categoryId],
      id: categoryId,
      itemCount: 0,
      itemListByPage: {
        ...(state[categoryId] && state[categoryId].itemListByPage),
        [page]: {
          fetchStatus: FetchStatusFlag.FETCHING,
          itemList: [],
          isFetched: false,
        },
      },
    },
  }),
);

categoryBooksReducer.on(
  Actions.loadCategoryBooksSuccess,
  (state = INITIAL_STATE, { categoryId, response, page }) => ({
    ...state,
    [categoryId]: {
      ...state[categoryId],
      itemListByPage: {
        ...state[categoryId].itemListByPage,
        [page]: {
          fetchStatus: FetchStatusFlag.IDLE,
          itemList: response.books.map((book: any) => book.id),
          isFetched: true,
        },
      },
      itemCount: response.totalCount,
    },
  }),
);

categoryBooksReducer.on(
  Actions.loadCategoryBooksFailure,
  (state = INITIAL_STATE, { categoryId, page }) => ({
    ...state,
    [categoryId]: {
      ...state[categoryId],
      itemListByPage: {
        ...state[categoryId].itemListByPage,
        [page]: {
          fetchStatus: FetchStatusFlag.FETCH_ERROR,
          itemList: [],
          isFetched: false,
        },
      },
    },
  }),
);

import { replace } from 'connected-react-router';
import flatten from 'lodash-es/flatten';
import { all, call, put, select, take, takeEvery } from 'redux-saga/effects';

import { FetchErrorFlag } from 'app/constants';
import history from 'app/config/history';
import { Actions as BookActions } from 'app/services/book';
import { Actions, Categories } from 'app/services/category';
import {
  CategoryBooksResponse,
  requestCategoryBooks,
  requestCategoryList,
} from 'app/services/category/requests';
import { localStorageManager } from 'app/services/category/utils';
import { RidiSelectState } from 'app/store';
import {
  fixWrongPaginationScope,
  isValidPaginationParameter,
  updateQueryStringParam,
} from 'app/utils/request';
import toast from 'app/utils/toast';
import showMessageForRequestError from 'app/utils/toastHelper';

import { SortOptionList } from './constants';

export function* loadCategoryList() {
  const categories = yield call(requestCategoryList);
  categories.map((category: Categories, index: number) => {
    if (category.children.length > 0) {
      categories[index].children.unshift({
        id: categories[index].id,
        name: `${categories[index].name} 전체`,
      });
    }
  });
  return categories;
}

export function* watchLoadCategoryListRequest() {
  while (true) {
    yield take(Actions.loadCategoryListRequest.getType());
    try {
      const categoryList = yield call(loadCategoryList);
      yield put(Actions.loadCategoryListSuccess({ categoryList }));
    } catch (e) {
      showMessageForRequestError(e);
      const state: RidiSelectState = yield select(s => s);
      yield put(
        replace({
          ...state.router.location,
          pathname: '/',
        }),
      );
    }
  }
}

export function* watchInitializeWhole() {
  while (true) {
    const { payload }: ReturnType<typeof Actions.initializeCategoriesWhole> = yield take(
      Actions.initializeCategoriesWhole.getType(),
    );
    if (payload.shouldFetchCategoryList) {
      yield put(Actions.loadCategoryListRequest());
      yield take(Actions.loadCategoryListSuccess.getType());
    }
    if (payload.shouldInitializeCategoryId) {
      yield put(Actions.initializeCategoryId());
    }
  }
}

export function* watchInitializeCategoryId() {
  while (true) {
    yield take(Actions.initializeCategoryId.getType());
    const state: RidiSelectState = yield select(s => s);
    const idFromLocalStorage = localStorageManager.load().lastVisitedCategoryId;
    const categoryId =
      (flatten(
        (state.categories.itemList || []).map((category: Categories) => [
          category.id,
          ...category.children.map((childCategory: Categories) => childCategory.id),
        ]),
      ).includes(idFromLocalStorage) &&
        idFromLocalStorage) ||
      state.categories.itemList[0].id;
    const pathname = `${state.router.location.pathname}/${categoryId}`;
    const search = `?sort=${SortOptionList[0].value}`;
    yield put(
      replace({
        ...state.router.location,
        pathname,
        search,
      }),
    );

    yield put(Actions.cacheCategoryId({ categoryId }));
  }
}

export function* watchCacheCategoryId() {
  while (true) {
    const {
      payload: { categoryId },
    } = yield take(Actions.cacheCategoryId.getType());
    localStorageManager.save({ lastVisitedCategoryId: categoryId });
  }
}

export function* loadCategoryBooks({
  payload,
}: ReturnType<typeof Actions.loadCategoryBooksRequest>) {
  const { page, categoryId, sort } = payload;
  try {
    if (!isValidPaginationParameter(page)) {
      throw FetchErrorFlag.UNEXPECTED_PAGE_PARAMS;
    }
    const response: CategoryBooksResponse = yield call(
      requestCategoryBooks,
      categoryId,
      page,
      sort,
    );
    yield put(BookActions.updateBooks({ books: response.books }));
    yield put(Actions.loadCategoryBooksSuccess({ categoryId, page, response }));
  } catch (error) {
    if (error === FetchErrorFlag.UNEXPECTED_PAGE_PARAMS) {
      history.replace(`?${updateQueryStringParam('page', 1)}`);
      return;
    }
    yield put(Actions.loadCategoryBooksFailure({ categoryId, page, error }));
  }
}

export function* watchLoadCategoryBooks() {
  yield takeEvery(Actions.loadCategoryBooksRequest.getType(), loadCategoryBooks);
}

export function* watchCategoryBooksFailure() {
  while (true) {
    const {
      payload: { page, error },
    }: ReturnType<typeof Actions.loadCategoryBooksFailure> = yield take(
      Actions.loadCategoryBooksFailure.getType(),
    );
    if (page === 1) {
      toast.failureMessage('없는 페이지입니다. 다시 시도해주세요.');
      return;
    }
    fixWrongPaginationScope(error.response);
  }
}

export function* categoryRootSaga() {
  yield all([
    watchLoadCategoryListRequest(),
    watchCategoryBooksFailure(),
    watchInitializeCategoryId(),
    watchInitializeWhole(),
    watchCacheCategoryId(),
    watchLoadCategoryBooks(),
  ]);
}

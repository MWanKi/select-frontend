import { replace } from 'connected-react-router';
import * as qs from 'qs';
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

export function* loadCategoryList() {
  const data = yield call(requestCategoryList);
  const categories = JSON.parse(`
    [
      {
        "id": 100,
        "name": "소설",
        "parent": {
          "id": 0,
          "name": "미분류"
        },
        "children": [
          {
            "id": 101,
            "name": "한국소설"
          },
          {
            "id": 102,
            "name": "영미소설"
          },
          {
            "id": 103,
            "name": "일본 소설"
          },
          {
            "id": 104,
            "name": "기타 국가 소설"
          },
          {
            "id": 105,
            "name": "한국고전"
          },
          {
            "id": 106,
            "name": "세계 고전문학"
          },
          {
            "id": 107,
            "name": "추리/미스터리/스릴러"
          },
          {
            "id": 108,
            "name": "역사소설"
          },
          {
            "id": 109,
            "name": "라이트노벨"
          },
          {
            "id": 113,
            "name": "판타지SF소설"
          },
          {
            "id": 114,
            "name": "독일 소설"
          },
          {
            "id": 115,
            "name": "프랑스 소설"
          },
          {
            "id": 116,
            "name": "북유럽 소설"
          },
          {
            "id": 117,
            "name": "중국 소설"
          },
          {
            "id": 118,
            "name": "국내 역사소설"
          },
          {
            "id": 119,
            "name": "해외 역사소설"
          },
          {
            "id": 120,
            "name": "대체 역사소설"
          },
          {
            "id": 121,
            "name": "동양 고전문학"
          },
          {
            "id": 122,
            "name": "서양 고전문학"
          },
          {
            "id": 123,
            "name": "SF 소설"
          },
          {
            "id": 124,
            "name": "국내 판타지 소설"
          },
          {
            "id": 125,
            "name": "해외 판타지 소설"
          },
          {
            "id": 126,
            "name": "성인 소설"
          },
          {
            "id": 127,
            "name": "연재 소설"
          }
        ]
      },
      {
        "id": 110,
        "name": "에세이/시",
        "parent": {
          "id": 0,
          "name": "미분류"
        },
        "children": [
          {
            "id": 111,
            "name": "에세이"
          },
          {
            "id": 112,
            "name": "시"
          }
        ]
      },
      {
        "id": 200,
        "name": "경영/경제",
        "parent": {
          "id": 0,
          "name": "미분류"
        },
        "children": [
          {
            "id": 210,
            "name": "경영일반"
          },
          {
            "id": 220,
            "name": "경제일반"
          },
          {
            "id": 230,
            "name": "마케팅/세일즈"
          },
          {
            "id": 240,
            "name": "재테크/금융/부동산"
          },
          {
            "id": 250,
            "name": "CEO/리더십"
          }
        ]
      },
      {
        "id": 300,
        "name": "자기계발",
        "parent": {
          "id": 0,
          "name": "미분류"
        },
        "children": [
          {
            "id": 310,
            "name": "성공/삶의자세"
          },
          {
            "id": 320,
            "name": "기획/창의/리더십"
          },
          {
            "id": 330,
            "name": "설득/화술/협상"
          },
          {
            "id": 340,
            "name": "취업/창업"
          },
          {
            "id": 350,
            "name": "여성"
          },
          {
            "id": 360,
            "name": "인간관계"
          }
        ]
      },
      {
        "id": 400,
        "name": "인문/사회/역사",
        "parent": {
          "id": 0,
          "name": "미분류"
        },
        "children": [
          {
            "id": 410,
            "name": "인문"
          },
          {
            "id": 420,
            "name": "정치/사회"
          },
          {
            "id": 430,
            "name": "예술/문화"
          },
          {
            "id": 440,
            "name": "역사"
          }
        ]
      },
      {
        "id": 500,
        "name": "건강/다이어트",
        "parent": {
          "id": 0,
          "name": "미분류"
        },
        "children": [
          {
            "id": 510,
            "name": "다이어트/운동/스포츠"
          },
          {
            "id": 520,
            "name": "스타일/뷰티"
          },
          {
            "id": 530,
            "name": "건강"
          }
        ]
      },
      {
        "id": 600,
        "name": "가정/생활",
        "parent": {
          "id": 0,
          "name": "미분류"
        },
        "children": [
          {
            "id": 610,
            "name": "결혼/임신/출산"
          },
          {
            "id": 620,
            "name": "육아/자녀교육"
          },
          {
            "id": 630,
            "name": "취미/요리/기타"
          }
        ]
      },
      {
        "id": 700,
        "name": "종교",
        "parent": {
          "id": 0,
          "name": "미분류"
        },
        "children": [
          {
            "id": 710,
            "name": "종교일반"
          },
          {
            "id": 720,
            "name": "가톨릭"
          },
          {
            "id": 730,
            "name": "기독교(개신교)"
          },
          {
            "id": 740,
            "name": "불교"
          },
          {
            "id": 750,
            "name": "기타"
          }
        ]
      },
      {
        "id": 800,
        "name": "여행",
        "parent": {
          "id": 0,
          "name": "미분류"
        },
        "children": [
          {
            "id": 810,
            "name": "국내여행"
          },
          {
            "id": 820,
            "name": "해외여행"
          }
        ]
      },
      {
        "id": 900,
        "name": "성인",
        "parent": {
          "id": 0,
          "name": "미분류"
        },
        "children": [
          {
            "id": 910,
            "name": "성인 소설"
          },
          {
            "id": 920,
            "name": "성인 비소설"
          },
          {
            "id": 930,
            "name": "성인 만화"
          },
          {
            "id": 940,
            "name": "성인잡지"
          }
        ]
      },
      {
        "id": 999,
        "name": "미정",
        "parent": {
          "id": 0,
          "name": "미분류"
        },
        "children": []
      },
      {
        "id": 1000,
        "name": "외국어",
        "parent": {
          "id": 0,
          "name": "미분류"
        },
        "children": [
          {
            "id": 1010,
            "name": "비즈니스영어"
          },
          {
            "id": 1020,
            "name": "일반영어"
          },
          {
            "id": 1030,
            "name": "제2외국어"
          },
          {
            "id": 1040,
            "name": "어학시험"
          }
        ]
      },
      {
        "id": 1100,
        "name": "과학",
        "parent": {
          "id": 0,
          "name": "미분류"
        },
        "children": [
          {
            "id": 1110,
            "name": "과학일반"
          },
          {
            "id": 1120,
            "name": "수학"
          },
          {
            "id": 1130,
            "name": "자연과학"
          },
          {
            "id": 1140,
            "name": "응용과학"
          },
          {
            "id": 1150,
            "name": "컴퓨터 활용"
          }
        ]
      },
      {
        "id": 1200,
        "name": "악보",
        "parent": {
          "id": 0,
          "name": "미분류"
        },
        "children": [
          {
            "id": 1201,
            "name": "가요/OST/POP"
          },
          {
            "id": 1202,
            "name": "뉴에이지/재즈"
          },
          {
            "id": 1203,
            "name": "클래식"
          },
          {
            "id": 1204,
            "name": "밴드/합주"
          },
          {
            "id": 1205,
            "name": "피아노/멜로디"
          },
          {
            "id": 1209,
            "name": "기타"
          }
        ]
      },
      {
        "id": 1300,
        "name": "어린이/청소년",
        "parent": {
          "id": 0,
          "name": "미분류"
        },
        "children": [
          {
            "id": 1310,
            "name": "유아"
          },
          {
            "id": 1320,
            "name": "어린이"
          },
          {
            "id": 1330,
            "name": "청소년"
          }
        ]
      },
      {
        "id": 1400,
        "name": "해외도서",
        "parent": {
          "id": 0,
          "name": "미분류"
        },
        "children": [
          {
            "id": 1401,
            "name": "소설"
          },
          {
            "id": 1402,
            "name": "장르소설"
          },
          {
            "id": 1403,
            "name": "가정/생활"
          },
          {
            "id": 1404,
            "name": "건강/다이어트"
          },
          {
            "id": 1405,
            "name": "경영/경제"
          },
          {
            "id": 1406,
            "name": "과학/수학/기술"
          },
          {
            "id": 1407,
            "name": "만화/그래픽노블"
          },
          {
            "id": 1408,
            "name": "어린이/청소년"
          },
          {
            "id": 1409,
            "name": "에세이/시"
          },
          {
            "id": 1410,
            "name": "여행"
          },
          {
            "id": 1411,
            "name": "인문/사회/역사"
          },
          {
            "id": 1412,
            "name": "자기계발"
          },
          {
            "id": 1413,
            "name": "종교"
          },
          {
            "id": 1414,
            "name": "진로/교육/교재"
          }
        ]
      },
      {
        "id": 1500,
        "name": "만화",
        "parent": {
          "id": 0,
          "name": "미분류"
        },
        "children": [
          {
            "id": 1501,
            "name": "1권+ 무료"
          },
          {
            "id": 1509,
            "name": "만화잡지"
          },
          {
            "id": 1511,
            "name": "연재"
          },
          {
            "id": 1513,
            "name": "무협"
          },
          {
            "id": 1515,
            "name": "액션"
          },
          {
            "id": 1517,
            "name": "학원"
          },
          {
            "id": 1519,
            "name": "드라마"
          },
          {
            "id": 1521,
            "name": "국내 순정"
          },
          {
            "id": 1522,
            "name": "해외 순정"
          },
          {
            "id": 1523,
            "name": "코믹"
          },
          {
            "id": 1525,
            "name": "스포츠"
          },
          {
            "id": 1527,
            "name": "판타지/SF"
          },
          {
            "id": 1529,
            "name": "BL"
          },
          {
            "id": 1531,
            "name": "공포/추리"
          },
          {
            "id": 1533,
            "name": "탐정"
          },
          {
            "id": 1535,
            "name": "성인"
          },
          {
            "id": 1537,
            "name": "GL"
          },
          {
            "id": 1540,
            "name": "TL노벨"
          },
          {
            "id": 1550,
            "name": "라이트노벨"
          },
          {
            "id": 1551,
            "name": "할리퀸"
          }
        ]
      },
      {
        "id": 1650,
        "name": "로맨스 연재",
        "parent": {
          "id": 0,
          "name": "미분류"
        },
        "children": [
          {
            "id": 1651,
            "name": "현대물"
          },
          {
            "id": 1652,
            "name": "역사/시대물"
          },
          {
            "id": 1653,
            "name": "판타지물"
          }
        ]
      },
      {
        "id": 1700,
        "name": "로맨스 단행본",
        "parent": {
          "id": 0,
          "name": "미분류"
        },
        "children": [
          {
            "id": 1699,
            "name": "(사용안함)연재로맨스"
          },
          {
            "id": 1701,
            "name": "현대물"
          },
          {
            "id": 1702,
            "name": "역사/시대물"
          },
          {
            "id": 1703,
            "name": "판타지물"
          },
          {
            "id": 1704,
            "name": "할리퀸 소설"
          },
          {
            "id": 1705,
            "name": "하이틴"
          },
          {
            "id": 1706,
            "name": "19+"
          },
          {
            "id": 1707,
            "name": "BL소설"
          },
          {
            "id": 1708,
            "name": "TL 소설"
          },
          {
            "id": 1709,
            "name": "섹슈얼 로맨스"
          },
          {
            "id": 1800,
            "name": "인터넷 소설"
          }
        ]
      },
      {
        "id": 1710,
        "name": "판타지 단행본",
        "parent": {
          "id": 0,
          "name": "미분류"
        },
        "children": [
          {
            "id": 1711,
            "name": "정통 판타지"
          },
          {
            "id": 1712,
            "name": "퓨전 판타지"
          },
          {
            "id": 1713,
            "name": "현대 판타지"
          },
          {
            "id": 1714,
            "name": "게임 판타지"
          },
          {
            "id": 1715,
            "name": "대체 역사물"
          },
          {
            "id": 1716,
            "name": "스포츠물"
          },
          {
            "id": 1721,
            "name": "신무협"
          },
          {
            "id": 1722,
            "name": "전통 무협"
          }
        ]
      },
      {
        "id": 1720,
        "name": "무협 소설",
        "parent": {
          "id": 0,
          "name": "미분류"
        },
        "children": []
      },
      {
        "id": 1730,
        "name": "장르-기타",
        "parent": {
          "id": 0,
          "name": "미분류"
        },
        "children": []
      },
      {
        "id": 1731,
        "name": "공포 소설",
        "parent": {
          "id": 0,
          "name": "미분류"
        },
        "children": []
      },
      {
        "id": 1750,
        "name": "판타지 연재",
        "parent": {
          "id": 0,
          "name": "미분류"
        },
        "children": [
          {
            "id": 1751,
            "name": "정통 판타지"
          },
          {
            "id": 1752,
            "name": "퓨전 판타지"
          },
          {
            "id": 1753,
            "name": "현대 판타지"
          },
          {
            "id": 1754,
            "name": "무협 소설"
          }
        ]
      }
    ]
  `);
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
      ((state.categories.itemList || [])
        .map((category: Categories) => category.id)
        .includes(idFromLocalStorage) &&
        idFromLocalStorage) ||
      state.categories.itemList[0].id;

    const parsedQueryString = qs.parse(state.router.location.search, { ignoreQueryPrefix: true });

    yield put(
      replace({
        ...state.router.location,
        search: qs.stringify({
          ...parsedQueryString,
          id: categoryId,
        }),
      }),
    );

    yield put(Actions.cacheCategoryId({ categoryId }));
  }
}

export function* watchCacheCategoryId() {
  while (true) {
    const { categoryId } = yield take(Actions.cacheCategoryId.getType());
    localStorageManager.save({ lastVisitedCategoryId: categoryId });
  }
}

export function* loadCategoryBooks({
  payload,
}: ReturnType<typeof Actions.loadCategoryBooksRequest>) {
  const { page, categoryId } = payload;
  try {
    if (!isValidPaginationParameter(page)) {
      throw FetchErrorFlag.UNEXPECTED_PAGE_PARAMS;
    }
    const response: CategoryBooksResponse = yield call(requestCategoryBooks, categoryId, page);
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

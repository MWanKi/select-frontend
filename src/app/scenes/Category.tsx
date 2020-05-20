import { css } from '@emotion/core';
import styled from '@emotion/styled';
import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, LinkProps, useHistory } from 'react-router-dom';

import { GridBookList, HelmetWithTitle } from 'app/components';
import { PageTitleText } from 'app/constants';
import { GridBookListSkeleton } from 'app/placeholder/BookListPlaceholder';
import { Actions as categoryActions } from 'app/services/category';
import { getIdFromLocationSearch, isValidNumber } from 'app/services/category/utils';
import { RidiSelectState } from 'app/store';
import { Pagination } from 'app/components/Pagination';
import { getPageQuery } from 'app/services/routing/selectors';
import SelectDialog from 'app/components/SelectDialog';
import TabList, { SC as TabListSC } from 'app/components/TabList';
import Media from 'app/styles/mediaQuery';
import SelectBox from 'app/components/SelectBox';

const ItemCountPerPage = 24;
const CategoryWrapper = styled.div`
  @media ${Media.MOBILE} {
    padding: 10px 0 0 20px;
  }
  @media ${Media.PC} {
    width: 800px;
    margin: 0 auto;
    padding: 40px 0 0 0;
  }
`;

const Category: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const isCategoryListFetched = useSelector((state: RidiSelectState) => state.categories.isFetched);
  const categoryList = useSelector((state: RidiSelectState) => state.categories.itemList) || [];
  const categoryId = useSelector((state: RidiSelectState) =>
    Number(getIdFromLocationSearch(state.router.location.search)),
  );
  const category = useSelector((state: RidiSelectState) => state.categoriesById[categoryId]);
  const books = useSelector((state: RidiSelectState) => state.booksById);
  const page = useSelector(getPageQuery);

  const isValidCategoryId = isValidNumber(categoryId);
  const itemCount = category?.itemCount;
  const isCategoryItemFetched = category?.itemListByPage[page]?.isFetched;

  useEffect(() => {
    dispatch(
      categoryActions.initializeCategoriesWhole({
        shouldFetchCategoryList: !isCategoryListFetched,
        shouldInitializeCategoryId: !isValidCategoryId,
      }),
    );
  }, []);

  useEffect(() => {
    if (isValidCategoryId) {
      dispatch(categoryActions.cacheCategoryId({ categoryId }));
      !isCategoryItemFetched &&
        dispatch(categoryActions.loadCategoryBooksRequest({ categoryId, page }));
    }
  }, [categoryId, page]);

  const FirstCategory = useCallback(() => {
    if (categoryId && categoryList && categoryList.length > 0) {
      const selectedItem = categoryList.filter(item => categoryId === item.id)[0];
      const changeFirstCategory = (clickedCategoryId: number) => {
        history.push(`/categories?id=${clickedCategoryId}`);
      };
      return (
        <SelectDialog
          dialogTitle="카테고리"
          items={categoryList}
          selectedItem={selectedItem}
          onClickItem={changeFirstCategory}
        />
      );
    }
    return null;
  }, [categoryList, categoryId]);

  const SecondCategory = useCallback(() => {
    if (categoryId && categoryList && categoryList.length > 0) {
      const selectedSecondCategoryItem = categoryList.filter(item => categoryId === item.id)[0];
      const changeSecondCategory = (clickedCategoryId: number) => {
        history.push(`/categories?id=${clickedCategoryId}`);
      };
      return (
        <TabList
          items={categoryList}
          selectedItem={selectedSecondCategoryItem}
          onClickItem={changeSecondCategory}
          styles={css`
            @media ${Media.MOBILE} {
              margin-left: -20px;
              ${TabListSC.TabList} {
                padding-left: 20px;
              }
            }
          `}
        />
      );
    }
    return null;
  }, [categoryList, categoryId]);

  const CategoryOrder = () => {
    const orderList = [
      {
        name: '인기순',
        value: 'favorite',
      },
      {
        name: '최신순',
        value: 'purchase_date',
      },
    ];
    return (
      <div
        css={css`
          padding-bottom: 6px;
        `}
      >
        <SelectBox
          selectLabel="카테고리 정렬"
          selectId="CategoryOrder"
          selectList={orderList}
          selectedItem={orderList[0]}
          onChangeSelect={() => {
            console.log('change!!');
          }}
          styles={css`
            margin-top: 15px;
          `}
        />
      </div>
    );
  };

  return (
    <main className="SceneWrapper SceneWrapper_WithGNB SceneWrapper_WithLNB">
      <HelmetWithTitle titleName={PageTitleText.CATEGORY} />
      <CategoryWrapper>
        <FirstCategory />
        <SecondCategory />
        <CategoryOrder />
      </CategoryWrapper>
      {!isCategoryListFetched || !isValidCategoryId || !isCategoryItemFetched ? (
        <GridBookListSkeleton />
      ) : (
        <>
          <GridBookList
            serviceTitleForTracking="select-book"
            pageTitleForTracking="category"
            uiPartTitleForTracking="book-list"
            miscTracking={JSON.stringify({ sect_cat_id: categoryId, sect_page: page })}
            books={category.itemListByPage[page].itemList.map(id => books[id].book!)}
          />
          {itemCount && (
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(itemCount / ItemCountPerPage)}
              item={{
                el: Link,
                getProps: (p): LinkProps => ({
                  to: `/categories?id=${categoryId}&page=${p}`,
                }),
              }}
            />
          )}
        </>
      )}
    </main>
  );
};

export default Category;

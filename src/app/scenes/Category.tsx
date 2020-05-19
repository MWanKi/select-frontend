import { css } from '@emotion/core';
import React, { useEffect } from 'react';
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
import GridBookListWrapper from 'app/components/GridBookList/Wrapper';
import TabList from 'app/components/TabList';
import Media from 'app/styles/mediaQuery';
import SelectBox from 'app/components/SelectBox';

const ItemCountPerPage = 24;

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

  const FirstCategory = () => {
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
          styles={css`
            @media ${Media.PHONE} {
              margin-top: 10px;
            }
            @media ${Media.PHABLET} {
              margin-top: 20px;
            }
            @media ${Media.TABLET} {
              margin-top: 30px;
            }
            @media ${Media.PC} {
              margin-top: 40px;
            }
          `}
        />
      );
    }
    return null;
  };

  const SecondCategory = () => {
    if (categoryId && categoryList && categoryList.length > 0) {
      const selectedItem = categoryList.filter(item => categoryId === item.id)[0];
      const changeSecondCategory = (clickedCategoryId: number) => {
        history.push(`/categories?id=${clickedCategoryId}`);
      };
      return (
        <TabList
          items={categoryList}
          selectedItem={selectedItem}
          onClickItem={changeSecondCategory}
          styles={css`
            @media ${Media.TABLET} {
              margin-top: 4px;
            }
            @media ${Media.PC} {
              margin-top: 4px;
            }
          `}
        />
      );
    }
    return null;
  };

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
      <GridBookListWrapper>
        <FirstCategory />
        <SecondCategory />
        <CategoryOrder />
      </GridBookListWrapper>
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

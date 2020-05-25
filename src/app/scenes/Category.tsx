import { css } from '@emotion/core';
import styled from '@emotion/styled';
import React, { useEffect, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, LinkProps, useHistory, useParams } from 'react-router-dom';

import { GridBookList, HelmetWithTitle } from 'app/components';
import { PageTitleText, RoutePaths } from 'app/constants';
import { GridBookListSkeleton } from 'app/placeholder/BookListPlaceholder';
import { Actions as categoryActions, Categories } from 'app/services/category';
import { isValidNumber } from 'app/services/category/utils';
import { RidiSelectState } from 'app/store';
import { Pagination } from 'app/components/Pagination';
import { getPageQuery } from 'app/services/routing/selectors';
import SelectDialog from 'app/components/SelectDialog';
import TabList, { SC as TabListSC } from 'app/components/TabList';
import Media from 'app/styles/mediaQuery';
import SelectBox from 'app/components/SelectBox';
import { SortOptionList } from 'app/services/category/constants';

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

const Sort = styled.div`
  padding-bottom: 6px;
`;

const Category: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const searchParams = useParams<{ categoryId: string }>();
  const categoryId = Number(searchParams.categoryId);

  const [selectedFirstCategory, setSelectedFirstCategory] = useState<Categories | null>(null);
  const [selectedSecondCategory, setSelectedSecondCategory] = useState<Categories | null>(null);
  const [selectedSortOption, setSelectedSortOption] = useState(SortOptionList[0]);

  const isCategoryListFetched = useSelector((state: RidiSelectState) => state.categories.isFetched);
  const categoryList = useSelector((state: RidiSelectState) => state.categories.itemList) || [];
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
        dispatch(
          categoryActions.loadCategoryBooksRequest({
            categoryId,
            page,
            sort: selectedSortOption.value,
          }),
        );
    }
  }, [categoryId, page, selectedSortOption]);

  useEffect(() => {
    if (selectedSortOption !== SortOptionList[0]) {
      setSelectedSortOption(SortOptionList[0]);
    }

    let selectedFirstCategoryItem = null;
    let selectedSecondCategoryItem = null;
    if (isValidCategoryId && categoryList) {
      categoryList.forEach(firstCategoryItem => {
        if (firstCategoryItem.id === categoryId) {
          selectedFirstCategoryItem = firstCategoryItem;
        }
        const secondCategoryList = firstCategoryItem.children;
        secondCategoryList.forEach(secondCategoryItem => {
          if (secondCategoryItem.id === categoryId) {
            selectedFirstCategoryItem = firstCategoryItem;
            selectedSecondCategoryItem = secondCategoryItem;
          }
        });
      });
    }
    setSelectedFirstCategory(selectedFirstCategoryItem);
    setSelectedSecondCategory(selectedSecondCategoryItem);
  }, [categoryId, categoryList]);

  const handleSortOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value: selectedOptionValue } = event.currentTarget;
    const selectedItem = SortOptionList.filter(
      optionItem => optionItem.value === selectedOptionValue,
    )[0];
    setSelectedSortOption(selectedItem);
    history.push(`${RoutePaths.CATEGORY}/${categoryId}?sort=${selectedOptionValue}`);
  };

  const handleCategoryChange = (clickedCategoryId: number) => {
    history.push(`${RoutePaths.CATEGORY}/${clickedCategoryId}?sort=${SortOptionList[0].value}`);
  };

  const FirstCategory = useCallback(
    () =>
      selectedFirstCategory ? (
        <SelectDialog
          dialogTitle="카테고리"
          items={categoryList}
          selectedItem={selectedFirstCategory}
          onClickItem={handleCategoryChange}
        />
      ) : null,
    [selectedFirstCategory],
  );

  const SecondCategory = useCallback(() => {
    const secondCategoryList = selectedFirstCategory?.children;
    return secondCategoryList && selectedSecondCategory ? (
      <TabList
        items={secondCategoryList}
        selectedItem={selectedSecondCategory}
        onClickItem={handleCategoryChange}
        styles={css`
          @media ${Media.MOBILE} {
            margin-left: -20px;
            ${TabListSC.TabList} {
              padding-left: 20px;
            }
          }
        `}
      />
    ) : null;
  }, [selectedSecondCategory]);

  return (
    <main className="SceneWrapper SceneWrapper_WithGNB SceneWrapper_WithLNB">
      <HelmetWithTitle titleName={PageTitleText.CATEGORY} />
      <CategoryWrapper>
        <FirstCategory />
        <SecondCategory />
        <Sort>
          <SelectBox
            selectLabel="카테고리 정렬"
            selectId="CategoryOrder"
            selectList={SortOptionList}
            selectedItem={selectedSortOption}
            onChangeSelect={handleSortOptionChange}
            styles={css`
              margin-top: 15px;
            `}
          />
        </Sort>
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

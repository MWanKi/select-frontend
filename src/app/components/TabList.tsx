import { css, SerializedStyles } from '@emotion/core';
import styled from '@emotion/styled';
import React, { useEffect, useRef, useState } from 'react';
import throttle from 'lodash-es/throttle';

import Colors from 'app/styles/colors';
import { resetButton, hideScrollBar } from 'app/styles/customProperties';
import ArrowIcon from 'svgs/ArrowNoneDashRight.svg';
import Media from 'app/styles/mediaQuery';

type ItemId = number;
interface TabItem {
  id: ItemId;
  name: string;
}

interface Props {
  tabTitle?: string;
  items: TabItem[];
  selectedItem: TabItem;
  onClickItem: any;
  styles?: SerializedStyles;
}

const scrollButtonStyle = css`
  ${resetButton}
  width: 44px;
  height: 44px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.0001) 0%, white 35.68%);
  position: absolute;
  top: 0;
  z-index: 20;

  &::before {
    content: '';
    display: block;
    width: 100%;
    height: 1px;
    background: linear-gradient(
      90deg,
      rgba(158, 167, 173, 0.0001) 0%,
      ${Colors.slategray_20} 35.68%
    );
    position: absolute;
    left: 0;
  }

  @media ${Media.MOBILE} {
    display: none;
  }
`;

export const SC = {
  TabListWrapper: styled.div`
    position: relative;

    &::before {
      content: '';
      display: block;
      width: 100%;
      height: 1px;
      background: ${Colors.slategray_20};
      position: absolute;
      left: 0;
      bottom: 0;
    }
    ${(props: { styles?: SerializedStyles }) => (props.styles ? props.styles : '')}
  `,
  TabListDimmed: styled.div`
    width: 27px;
    height: 44px;
    background: linear-gradient(90deg, rgba(250, 250, 251, 0.0001) 0%, white 100%);
    position: absolute;
    right: 0;
    top: 0;
    z-index: 20;

    &::before {
      content: '';
      display: block;
      width: 100%;
      height: 1px;
      background: linear-gradient(
        90deg,
        rgba(158, 167, 173, 0.0001) 0%,
        ${Colors.slategray_20} 100%
      );
      position: absolute;
      left: 0;
      bottom: -1px;
    }

    @media ${Media.PC} {
      display: none;
    }
  `,
  TabListScrollButtonNext: styled.button`
    ${scrollButtonStyle}
    right: 0;
    &::before {
      bottom: -1px;
    }
  `,
  TabListScrollButtonPrev: styled.button`
    ${scrollButtonStyle}
    transform: rotate(180deg);
    left: 0;

    &::before {
      top: -1px;
    }
  `,
  TabListScrollButtonIcon: styled(ArrowIcon)`
    width: 10px;
    height: 12px;
    fill: ${Colors.slategray_40};
  `,
  TabListScrollBox: styled.div`
    margin: 0;
    padding: 0;
    overflow: auto;
    ${hideScrollBar}
  `,
  TabList: styled.ul`
    display: inline-block;
    margin: 0;
    padding: 0;
    list-style: none;
    white-space: nowrap;
  `,
  TabItem: styled.li`
    margin-left: 8px;
    display: inline-block;

    &:first-of-type {
      margin-left: 0;
    }

    &:last-of-type {
      margin-right: 20px;
    }
  `,
  TabButton: styled.button`
    ${resetButton}
    white-space: nowrap;
    font-size: 15px;
    line-height: 15px;
    padding: 15px 4px;
    position: relative;
    ${(props: { isSelected: boolean }) => {
      const { isSelected } = props;
      return isSelected
        ? `
          font-weight: 700;
          color: ${Colors.bluegray_90};
          &::after {
            content: '';
            display: block;
            width: 100%;
            height: 3px;
            background: ${Colors.slategray_50};
            position: absolute;
            left: 0;
            bottom: 0px;
            z-index: 10;
          }
        `
        : `
          font-weight: 400;
          color: ${Colors.slategray_50};
        `;
    }}
  `,
};

const TabList: React.FunctionComponent<Props> = (props: Props) => {
  const { tabTitle, items, selectedItem, onClickItem, styles } = props;

  const tabListScrollBoxRef = useRef<HTMLDivElement>(null);
  const tabListRef = useRef<HTMLUListElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);

  const throttledResizeFunction = throttle(() => {
    if (tabListRef.current != null && tabListScrollBoxRef.current != null) {
      const screenWidth = document.body.clientWidth;
      setIsScrollable(tabListRef.current.clientWidth > screenWidth);
      console.log(tabListScrollBoxRef.current.scrollLeft);
    }
  }, 100);

  useEffect(() => {
    window.addEventListener('resize', throttledResizeFunction);
    throttledResizeFunction();
    return () => {
      window.removeEventListener('resize', throttledResizeFunction);
    };
  }, []);

  const handleTabListScroll = () => {
    if (tabListScrollBoxRef.current != null) {
      console.log(tabListScrollBoxRef.current.scrollLeft);
    }
  };
  const scrollTabList = (distance: number) => {
    if (tabListScrollBoxRef.current != null) {
      const { scrollLeft } = tabListScrollBoxRef.current;
      tabListScrollBoxRef.current.scroll({
        top: 0,
        left: scrollLeft + distance,
        behavior: 'smooth',
      });
    }
  };
  const handleScrollLeftClick = () => {
    scrollTabList(400);
  };
  const handleScrollRightClick = () => {
    scrollTabList(-400);
  };
  const handleItemClick = (event: React.MouseEvent<HTMLButtonElement & { value: ItemId }>) => {
    onClickItem(event.currentTarget.value);
  };
  return (
    <SC.TabListWrapper styles={styles}>
      {tabTitle && <p className="a11y">{tabTitle}</p>}
      <SC.TabListScrollBox ref={tabListScrollBoxRef} onScroll={handleTabListScroll}>
        <SC.TabList ref={tabListRef}>
          {items.map(item => (
            <SC.TabItem key={`TabList${item.id}`}>
              <SC.TabButton
                type="button"
                value={item.id}
                onClick={handleItemClick}
                isSelected={selectedItem.id === item.id}
              >
                {item.name}
              </SC.TabButton>
            </SC.TabItem>
          ))}
        </SC.TabList>
      </SC.TabListScrollBox>
      {isScrollable && (
        <>
          <SC.TabListDimmed />
          <SC.TabListScrollButtonNext onClick={handleScrollLeftClick}>
            <SC.TabListScrollButtonIcon />
            <span className="a11y">다음</span>
          </SC.TabListScrollButtonNext>
          <SC.TabListScrollButtonPrev onClick={handleScrollRightClick}>
            <SC.TabListScrollButtonIcon />
            <span className="a11y">이전</span>
          </SC.TabListScrollButtonPrev>
        </>
      )}
    </SC.TabListWrapper>
  );
};

export default TabList;

import { css, SerializedStyles } from '@emotion/core';
import styled from '@emotion/styled';
import React, { useRef, useEffect } from 'react';

import { toggleBodyScrollable } from 'app/styles/globals';
import Colors from 'app/styles/colors';
import hoverStyles from 'app/styles/hover';
import CloseIcon from 'svgs/Close.svg';
import { resetButton, resetLayout } from 'app/styles/customProperties';
import { fadeIn, fadeInSlideup } from 'app/styles/keyframes';
import ArrowDownIcon from 'svgs/ArrowNoneDashDown.svg';

type ItemId = number;
interface SelectItem {
  id: ItemId;
  name: string;
}

interface Props {
  dialogTitle: string;
  items: SelectItem[];
  selectedItem: SelectItem;
  onClickItem: any;
  styles?: SerializedStyles;
}

const DialogHeight = 414;
const DialogHeaderHeight = 64;
const SelectButtonVerticalPadding = 12;
const SelectIconSize = 20;
const SelectInnerIconSize = 8;
const TransitionDuration = 0.2;

const SC = {
  ToggleButtonWrapper: styled.div`
    padding: 10px 0;
    ${(props: { styles?: SerializedStyles }) => (props.styles ? props.styles : '')}
  `,
  ToggleButton: styled.button`
    ${resetButton}
    align-items: center;
    display: flex;
    font-size: 20px;
    font-weight: 700;
    color: ${Colors.slategray_90};
    line-height: 30px;
  `,
  ToggleButtonIcon: styled(ArrowDownIcon)`
    width: 12px;
    height: 9px;
    margin-left: 8px;
    fill: ${Colors.slategray_40};
  `,
  DialogWrapper: styled.div`
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
  `,
  DimmedBG: styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.5);
    animation: ${fadeIn} ${TransitionDuration}s forwards;
  `,
  Dialog: styled.div`
    width: 320px;
    height: ${DialogHeight}px;
    background: white;
    border-radius: 3px;
    overflow: hidden;
    position: relative;
    margin: 0 auto;
    animation: ${fadeInSlideup} ${TransitionDuration}s forwards;
  `,
  DialogHeader: styled.div`
    height: ${DialogHeaderHeight}px;
    padding: 0 16px 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,
  DialogTitle: styled.h1`
    font-size: 17px;
    font-weight: 700;
    color: black;
  `,
  CloseButton: styled.button`
    ${resetButton}
    width: 32px;
    height: 32px;
    border-radius: 2px;
    transition: background ${TransitionDuration}s;

    ${hoverStyles(
      css`
        cursor: pointer;
        background: rgba(0, 0, 0, 0.05);
      `,
    )}
  `,
  CloseIcon: styled(CloseIcon)`
    width: 24px;
    height: 24px;
    fill: ${Colors.slategray_30};
    transition: fill ${TransitionDuration}s;
    ${hoverStyles(
      css`
        fill: ${Colors.slategray_50};
      `,
      'button',
    )}
  `,
  SelectList: styled.ul`
    ${resetLayout}
    height: ${DialogHeight - DialogHeaderHeight}px;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 12px;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      background-clip: content-box;
    }
    &::-webkit-scrollbar-thumb {
      width: 12px;
      border: 4px solid transparent;
      border-radius: 12px;
      background-color: ${Colors.slategray_30};
      background-clip: content-box;
    }
  `,
  SelectItem: styled.li`
    &:last-of-type {
      padding-bottom: 24px;
    }
  `,
  SelectButton: styled.button`
    ${resetButton}
    background: white;
    width: 100%;
    text-align: left;
    padding: ${SelectButtonVerticalPadding}px 20px ${SelectButtonVerticalPadding}px 50px;
    font-size: 16px;
    line-height: 24px;
    color: ${Colors.slategray_100};
    position: relative;
    transition: background ${TransitionDuration}s;

    ${hoverStyles(
      css`
        cursor: pointer;
        background: rgba(0, 0, 0, 0.05);
      `,
    )}
  `,
  SelectIcon: styled.div`
    position: absolute;
    left: 20px;
    top: ${SelectButtonVerticalPadding + 2}px;
    width: ${SelectIconSize}px;
    height: ${SelectIconSize}px;
    border-radius: ${SelectIconSize}px;
    box-sizing: border-box;
    transition: border-color ${TransitionDuration}s;
    ${(props: { isSelected: boolean }) => {
      const { isSelected } = props;
      return isSelected
        ? `
          background: ${Colors.dodgerblue_40};
          border: 1px solid ${Colors.dodgerblue_40};
          &::after {
            content: '';
            display: block;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate3d(-50%, -50%, 0);
            width: ${SelectInnerIconSize}px;
            height: ${SelectInnerIconSize}px;
            border-radius: ${SelectInnerIconSize}px;
            background: white;
          }
        `
        : `
          background: white;
          border: 1px solid ${Colors.slategray_20};
        `;
    }}
  `,
};

const Distance = 64;

const SelectDialog: React.FunctionComponent<Props> = ({
  dialogTitle,
  items,
  selectedItem,
  onClickItem,
  styles,
}: Props) => {
  const scrollBoxRef = useRef<HTMLUListElement>(null);
  const selectedItemRef = useRef<HTMLLIElement>(null);
  const [dialogVisible, setDialogVisible] = React.useState(false);
  useEffect(() => {
    if (dialogVisible && scrollBoxRef.current != null && selectedItemRef.current != null) {
      const { clientHeight: scrollBoxHeight } = scrollBoxRef.current;
      const { offsetTop } = selectedItemRef.current;
      if (offsetTop > scrollBoxHeight - Distance) {
        scrollBoxRef.current.scroll({
          top: offsetTop - Distance,
          left: 0,
        });
      }
    }
  }, [dialogVisible]);

  const toggleDialog = () => {
    setDialogVisible(!dialogVisible);
    toggleBodyScrollable(!dialogVisible);
  };
  const handleItemClick = (event: React.MouseEvent<HTMLButtonElement & { value: ItemId }>) => {
    toggleDialog();
    onClickItem(event.currentTarget.value);
  };

  return (
    <>
      <SC.ToggleButtonWrapper styles={styles}>
        <SC.ToggleButton type="button" onClick={toggleDialog}>
          {selectedItem.name} <SC.ToggleButtonIcon />
        </SC.ToggleButton>
      </SC.ToggleButtonWrapper>
      {dialogVisible && (
        <SC.DialogWrapper>
          <SC.DimmedBG onClick={toggleDialog} />
          <SC.Dialog>
            <SC.DialogHeader>
              <SC.DialogTitle>{dialogTitle}</SC.DialogTitle>
              <SC.CloseButton type="button" onClick={toggleDialog}>
                <span className="a11y">닫기</span>
                <SC.CloseIcon />
              </SC.CloseButton>
            </SC.DialogHeader>
            <SC.SelectList ref={scrollBoxRef}>
              {items.map(item => (
                <SC.SelectItem
                  key={item.id}
                  ref={selectedItem.id === item.id ? selectedItemRef : null}
                >
                  <SC.SelectButton type="button" value={item.id} onClick={handleItemClick}>
                    <SC.SelectIcon isSelected={selectedItem.id === item.id} />
                    {item.name}
                  </SC.SelectButton>
                </SC.SelectItem>
              ))}
            </SC.SelectList>
          </SC.Dialog>
        </SC.DialogWrapper>
      )}
    </>
  );
};

export default React.memo(SelectDialog);

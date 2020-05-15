import { css } from '@emotion/core';
import styled from '@emotion/styled';
import React from 'react';

import { toggleBodyScrollable } from 'app/styles/globals';
import Colors from 'app/styles/colors';
import hoverStyles from 'app/styles/hover';
import CloseIcon from 'svgs/Close.svg';
import { resetButton, resetLayout } from 'app/styles/customProperties';
import { fadeIn, fadeInSlideup } from 'app/styles/keyframes';

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
}

const DialogHeight = 414;
const DialogHeaderHeight = 64;
const SelectIconSize = 20;
const SelectInnerIconSize = 8;

const SC = {
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
    animation: ${fadeIn} 0.3s forwards;
  `,
  Dialog: styled.div`
    width: 320px;
    height: ${DialogHeight}px;
    background: white;
    border-radius: 3px;
    overflow: hidden;
    position: relative;
    margin: 0 auto;
    animation: ${fadeInSlideup} 0.3s forwards;
  `,
  DialogHeader: styled.div`
    height: ${DialogHeaderHeight}px;
    padding: 0 20px;
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
    width: 24px;
    height: 24px;
  `,
  CloseIcon: styled(CloseIcon)`
    width: 100%;
    height: 100%;
    fill: ${Colors.slategray_30};
    transition: fill 0.3s;
    ${hoverStyles(
      css`
        fill: ${Colors.dodgerblue_40};
      `,
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
    padding: 12px 0;
    &:first-of-type {
      padding-top: 0;
    }
    &:last-of-type {
      padding-bottom: 24px;
    }
  `,
  SelectButton: styled.button`
    ${resetButton}
    width: 100%;
    text-align: left;
    padding: 0 20px 0 50px;
    font-size: 16px;
    line-height: 24px;
    color: ${Colors.slategray_100};
    position: relative;
    ${hoverStyles(
      css`
        cursor: pointer;
      `,
    )}
  `,
  SelectIcon: styled.div`
    position: absolute;
    left: 20px;
    top: 2px;
    width: ${SelectIconSize}px;
    height: ${SelectIconSize}px;
    border-radius: ${SelectIconSize}px;
    box-sizing: border-box;
    transition: border-color 0.3s;
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
    ${hoverStyles(
      css`
        border-color: ${Colors.dodgerblue_40};
      `,
      'button',
    )}
  `,
};

const SelectDialog: React.FunctionComponent<Props> = ({
  dialogTitle,
  items,
  selectedItem,
  onClickItem,
}: Props) => {
  const [dialogVisible, setDialogVisible] = React.useState(false);
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
      <div>
        <button type="button" onClick={toggleDialog}>
          {selectedItem.name}
        </button>
      </div>
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
            <SC.SelectList>
              {items.map(item => (
                <SC.SelectItem key={item.id}>
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

export default SelectDialog;

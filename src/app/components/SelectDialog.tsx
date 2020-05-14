import { css } from '@emotion/core';
import styled from '@emotion/styled';
import React from 'react';

import { toggleBodyScrollable } from 'app/styles/globals';
import Colors from 'app/styles/colors';
import hoverStyles from 'app/styles/hover';

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
    background: rgba(0, 0, 0, 0.5);
  `,
  Dialog: styled.div`
    width: 320px;
    height: ${DialogHeight}px;
    background: white;
    border-radius: 3px;
    overflow: hidden;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate3d(-50%, -50%, 0);
  `,
  DialogHeader: styled.div`
    height: ${DialogHeaderHeight}px;
  `,
  SelectList: styled.ul`
    height: ${DialogHeight - DialogHeaderHeight}px;
    overflow-y: auto;
  `,
  SelectItem: styled.li`
    padding: 12px 20px;

    &:first-of-type {
      padding-top: 0;
    }
  `,
  SelectButton: styled.button`
    ${hoverStyles(
      css`
        cursor: pointer;
      `,
    )}
  `,
  SelectIcon: styled.div`
    width: ${SelectIconSize}px;
    height: ${SelectIconSize}px;
    border-radius: ${SelectIconSize}px;
    box-sizing: border-box;
    transition: border-color 0.3s;
    ${(props: { isSelected: boolean }) => {
      const { isSelected } = props;
      return isSelected
        ? `
          position: relative;
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
          <SC.Dialog>
            <SC.DialogHeader>
              <h1>{dialogTitle}</h1>
              <button type="button" onClick={toggleDialog}>
                닫기
              </button>
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

import styled from '@emotion/styled';
import React from 'react';

import { toggleBodyScrollable } from 'app/styles/globals';

interface SelectItem {
  id: number;
  name: string;
}

interface Props {
  dialogTitle: string;
  items: SelectItem[];
  selectedItem: SelectItem;
  handleItemClick: any;
}

const DialogHeight = 414;
const DialogHeaderHeight = 64;

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
};

const SelectDialog: React.FunctionComponent<Props> = ({
  dialogTitle,
  items,
  selectedItem,
  handleItemClick,
}: Props) => {
  const [dialogVisible, setDialogVisible] = React.useState(false);
  const toggleDialog = () => {
    setDialogVisible(!dialogVisible);
    toggleBodyScrollable(!dialogVisible);
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
                  <button
                    type="button"
                    onClick={() => {
                      handleItemClick(item.id);
                    }}
                  >
                    {item.name}
                  </button>
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

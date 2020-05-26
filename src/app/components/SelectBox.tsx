import { SerializedStyles, css } from '@emotion/core';
import React from 'react';
import styled from '@emotion/styled';

import { resetAppearance } from 'app/styles/customProperties';
import Colors from 'app/styles/colors';
import ArrowIcon from 'svgs/ArrowTriangleDown.svg';
import hoverStyles from 'app/styles/hover';

interface SelectItem {
  name: string;
  value: string | number;
}

interface Props {
  selectLabel: string;
  selectId: string;
  selectList: SelectItem[];
  selectedItem: SelectItem;
  onChangeSelect: any;
  styles?: SerializedStyles;
}

const SC = {
  SelectWrapper: styled.div`
    position: relative;
    display: inline-block;
    ${(props: { styles?: SerializedStyles }) => (props.styles ? props.styles : '')}
  `,
  Select: styled.select`
    ${resetAppearance}
    box-sizing: content-box;
    display: block;
    height: 18px;
    min-width: 68px;
    line-height: 18px;
    font-size: 12px;
    font-weight: 700;
    color: ${Colors.slategray_70};
    padding: 5px 23px 5px 7px;
    background: white;
    position: relative;
    border: 1px solid ${Colors.slategray_20};
    border-radius: 3px;
    cursor: pointer;
    transition: background 0.2s;
    &::-ms-expand {
      display: none;
    }
    ${hoverStyles(
      css`
        background: rgba(0, 0, 0, 0.05);
      `,
    )}
  `,
  SelectIcon: styled(ArrowIcon)`
    width: 10px;
    height: 6px;
    fill: ${Colors.slategray_50};
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translate3d(0, -50%, 0);
    pointer-events: none;
  `,
};

const SelectBox: React.FunctionComponent<Props> = (props: Props) => {
  const { selectLabel, selectId, selectList, selectedItem, onChangeSelect, styles } = props;
  return (
    <SC.SelectWrapper styles={styles}>
      <label className="a11y" htmlFor={`${selectId}_Select`}>
        {selectLabel}
      </label>
      <SC.Select id={`${selectId}_Select`} onChange={onChangeSelect} value={selectedItem.value}>
        {selectList.map((selectItem, index) => (
          <option key={`${selectId}_Item-${index}-${selectItem.value}`} value={selectItem.value}>
            {selectItem.name}
          </option>
        ))}
      </SC.Select>
      <SC.SelectIcon />
    </SC.SelectWrapper>
  );
};

export default SelectBox;

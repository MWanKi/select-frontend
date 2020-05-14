import React from 'react';

interface SelectItem {
  id: number;
  name: string;
}

interface Props {
  items: SelectItem[];
  currentItemName: string;
  handleItemClick: any;
}

const SelectDialog: React.FunctionComponent<Props> = ({
  items,
  currentItemName,
  handleItemClick,
}: Props) => {
  const [dialogVisible, setDialogVisible] = React.useState(false);
  return (
    <>
      <div>
        <button
          type="button"
          onClick={() => {
            setDialogVisible(!dialogVisible);
          }}
        >
          {currentItemName}
        </button>
      </div>
      {dialogVisible && (
        <div>
          <div>
            <ul>
              {items.map(item => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => {
                    handleItemClick(item.id);
                  }}
                >
                  {item.name}
                </button>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default SelectDialog;

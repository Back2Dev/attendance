import React, { useState, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

import { Typography, Button, IconButton, Dialog, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

import DataGrid, { SelectColumn, SortColumn, TextEditor } from '/imports/ui/components/commons/mui-rdg';

import EditIcon from '@mui/icons-material/Edit';
import ErrorIcon from '@mui/icons-material/Error';
import CloneIcon from '@mui/icons-material/FileCopy';
import MuiSelector from '/imports/ui/utils/data-grid/selector.js';
import CONSTANTS from '/imports/api/constants.js';
import MessageEdit from '/imports/ui/admin/workflows/tree/message-edit.js';
import { MessageTemplate } from '/imports/types/message-template.js';

const debug = require('debug')('app:workflows-tree-step-notifications');

const StyleNotifications = styled('div')`
  .buttons {
    button {
      margin: 15px 5px;
    }
  }
  .add-remove {
    display: flex;
  }
`;
type RowData = {
  number: number;
  text: string;
  delay?: string;
  method: keyof typeof CONSTANTS.NOTIFICATION_METHODS;
  from?: string;
  fromName?: string;
};

interface NotificationsProps {
  stepId: string;
  rows: RowData[];
  onChange: (rows: RowData[]) => void;
  messageTemplates: MessageTemplate[];
  saveMessage: (message: MessageTemplate) => void;
  saveID: (id: string) => void;
  recipientOptions: { text: string; value: string }[];
}
function Notifications({
  stepId,
  rows,
  onChange,
  messageTemplates,
  saveMessage,
  saveID,
  recipientOptions,
}: NotificationsProps) {
  const [open, setOpen] = useState(false);
  const [internalRows, setInternalRows] = useState<RowData[]>(() => {
    return rows.map((row) => {
      const { number = null, text = '', method = null, from = '', fromName = '' } = row;
      return {
        number,
        text,
        method,
        from,
        fromName,
      };
    });
  });
  const defaultSortColumns: SortColumn[] = [{ columnKey: 'trigger', direction: 'ASC' }];
  const [sortColumns, setSortColumns] = useState(defaultSortColumns);

  const [selectedRows, setSelectedRows] = useState(new Set());
  const [editMessage, setEditMessage] = useState({});
  const [editRow, setEditRow] = useState({});

  const autocompleteMT: RowData[] =
    messageTemplates?.map((mt) => {
      // debug('mt', mt)
      return {
        number: mt.number,
        text: mt.slug,
        delay: '',
        method: mt.type,
      };
    }) || [];

  const [addValue, setAddValue] = React.useState(autocompleteMT[0]);

  useEffect(() => {
    setInternalRows(rows);
  }, [stepId, rows]);

  const updateTimeout = useRef(null);
  useEffect(() => {
    clearTimeout(updateTimeout.current);
    updateTimeout.current = setTimeout(() => onChange(internalRows), 500);
  }, [internalRows]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const EditDialog = () => {
    return (
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog">
        <MessageEdit
          handleClose={handleClose}
          item={editMessage}
          row={editRow}
          messageTemplates={messageTemplates}
          saveMessage={saveMessage}
          saveID={saveID}
        />
      </Dialog>
    );
  };

  const triggerOptions = Object.keys(CONSTANTS.TRIGGERS).map((key) => {
    return { text: CONSTANTS.TRIGGERS[key], value: key };
  });

  const methodOptions: { text: string; value: RowData['method'] }[] = [
    { text: 'SMS', value: 'SMS' },
    { text: 'Email', value: 'EMAIL' },
    { text: 'APP', value: 'APP' },
    { text: 'API', value: 'API' },
  ];

  const columns = [
    {
      key: 'edit',
      name: 'Actions',
      width: 90,
      formatter(props) {
        const mtFiltered = messageTemplates.filter((mt) => mt.slug === props.row.text);
        return (
          <span>
            <IconButton
              color="primary"
              id={`edit-${props.row.text}`}
              key="edit"
              onClick={() => {
                setEditMessage(messageTemplates.find((mt) => mt.slug === props.row.text));
                setEditRow(props.row);
                handleClickOpen();
              }}
              size="small"
            >
              {mtFiltered.length === 1 && mtFiltered[0].slug === props.row.text ? (
                <EditIcon />
              ) : (
                <ErrorIcon color="secondary" />
              )}
            </IconButton>

            {props.row.text && (
              <IconButton
                color="primary"
                id={`clone-${props.row.text}`}
                href={`/admin/message-templates/add/${props.row.text}`}
                target="_blank"
                size="small"
                key="clone"
              >
                <CloneIcon />
              </IconButton>
            )}
          </span>
        );
      },
    },
    {
      key: 'text',
      name: 'Message ID',
      width: 150,
      editor: TextEditor,
    },
    {
      key: 'method',
      name: 'Method',
      formatter(props) {
        return <MuiSelector {...props} options={methodOptions} />;
      },
      sortable: true,
      width: 120,
    },
    {
      key: 'from',
      name: 'From',
      width: 100,
      editor: TextEditor,
    },
    { key: 'fromName', name: 'From name', editor: TextEditor, width: '*' },
    // { key: 'attach', name: 'Attach', editor: TextEditor, width: 60 },
  ];

  function rowKeyGetter(row) {
    return `${row.text}-${row.method}`;
  }

  const sortedRows = useMemo(() => {
    let mutableRows = [...internalRows];

    // handle column sorting
    const triggerSorting = ['ready', 'complete', 'reject', 'skip']; // open, cancel, reopen, goto, skipall, create
    mutableRows.sort((a, b) => {
      for (const sort of sortColumns) {
        debug('sort', sort);
        switch (sort.columnKey) {
          case 'method': {
            return (
              (sort.direction === 'ASC' ? 1 : -1) *
                `${a.method}`.localeCompare(`${b.method}`) || 0
            );
          }
        }
      }
      return 0;
    });

    return mutableRows;
  }, [internalRows, sortColumns]);

  const add = () => {
    if (addValue.text) {
      setInternalRows([...internalRows, addValue]);
    }
  };

  const remove = () => {
    const newRows = [];
    internalRows.map((row) => {
      if (!selectedRows.has(rowKeyGetter(row))) {
        newRows.push(row);
      }
    });
    setInternalRows(newRows);
    setSelectedRows(new Set());
  };

  const headerRowHeight = 35;
  const rowHeight = 50;
  const tableHeight = headerRowHeight + sortedRows.length * rowHeight + 4;

  return (
    <StyleNotifications>
      <Typography variant="h5">Notifications:</Typography>
      <div className="add-remove">
        <Autocomplete
          id="autocomplete-mt"
          options={autocompleteMT}
          getOptionLabel={(mt) => mt.text && mt.method && `${mt.text} - ${mt.method}`}
          isOptionEqualToValue={(option, value) => option.text === value.text}
          value={addValue}
          style={{ width: 300 }}
          onChange={(event, newValue) => {
            setAddValue(newValue);
          }}
          renderInput={(params) => <TextField {...params} label="Message ID" />}
        />
        <div className="buttons">
          <Button
            size="small"
            onClick={add}
            variant="contained"
            color="primary"
            data-cy="add-notification"
          >
            Add
          </Button>
          {selectedRows.size ? (
            <Button
              size="small"
              onClick={remove}
              variant="contained"
              color="secondary"
              data-cy="remove-notification"
            >
              Remove
            </Button>
          ) : null}
        </div>
      </div>
      <DataGrid
        rowKeyGetter={rowKeyGetter}
        columns={[SelectColumn, ...columns]}
        sortColumns={sortColumns}
        onSortColumnsChange={(sorts) => {
          debug('on sort column change', sorts);
          if (sorts && sorts.length) {
            setSortColumns(sorts);
          } else {
            setSortColumns(defaultSortColumns);
          }
        }}
        defaultColumnOptions={{
          sortable: false,
          resizable: true,
        }}
        rows={sortedRows}
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
        onRowsChange={(newRows) => {
          setInternalRows(newRows);
        }}
        style={{ height: `${tableHeight}px`, overflowY: 'auto' }}
        className="fill-grid rdg-light"
        headerRowHeight={headerRowHeight}
        rowHeight={rowHeight}
      />
      <EditDialog />
    </StyleNotifications>
  );
}

Notifications.propTypes = {
  stepId: PropTypes.string.isRequired,
  rows: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  messageTemplates: PropTypes.array.isRequired,
  saveMessage: PropTypes.func.isRequired,
  saveID: PropTypes.func.isRequired,
};

Notifications.defaultProps = {
  rows: [],
};

export default Notifications;

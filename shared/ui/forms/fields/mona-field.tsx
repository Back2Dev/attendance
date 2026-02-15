import React from 'react';
import Editor from '@monaco-editor/react';
import { InputLabel, FormControl, FormControlLabel, Typography } from '@mui/material';
import { Box } from '@mui/material';
import { connectField, HTMLFieldProps } from 'uniforms';
import { Input, InputOutlined } from '@mui/icons-material';
import styled from '@emotion/styled';
import { editor } from 'monaco-editor';

const debug = require('debug')('app:form-monaco-field');

const StyledLabel = styled(Typography)`
  position: absolute;
  left: 10px;
  top: 0;
  padding: 0 5px;
  background: #ffffff;
`;
export type Option<ValueT> = {
  disabled?: boolean;
  label?: string;
  key?: string;
  value: ValueT;
};

export type MonaFieldProps = HTMLFieldProps<
  string,
  HTMLAnchorElement,
  {
    language?: string;
  }
>;

export const getFieldType = (fieldType) => {
  if (fieldType === String) {
    return 'string';
  }
  if (fieldType === Object) {
    return 'object';
  }
  if (fieldType === Number) {
    return 'number';
  }
  if (typeof fieldType === 'object') {
    if (fieldType.type) {
      return getFieldType(fieldType.type);
    }
  }

  return 'unknown';
};

const MonaField: React.FC<MonaFieldProps> = React.forwardRef(
  ({ value = '', name, label, onChange, field, ...rest }, ref) => {
    // debug('MonaField', { value, name, label, onChange }, field, rest);
    let strValue = '';
    const fieldType = getFieldType(field.type);
    // debug(`fieldType of ${name}:`, fieldType, field.type);
    if (fieldType === 'string') {
      strValue = value;
    } else if (fieldType === 'object') {
      strValue = JSON.stringify(value || {}, null, 2);
    } else {
      // try to convert to string
      strValue = JSON.stringify(value, null, 2);
    }
    // debug('strValue', strValue);

    return (
      <Box my="8px">
        <FormControl fullWidth>
          <Typography
            style={{
              position: 'absolute',
              left: '10px',
              top: 0,
              padding: '0 5px',
              background: '#ffffff',
              zIndex: 1,
            }}
          >
            {label}
          </Typography>
          <Box
            style={{
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              padding: '10px 5px',
              marginTop: '12px',
            }}
          >
            <MonacoEditorContainer
              value={strValue}
              onChange={(v) => {
                debug('onChange function', onchange);
                debug('onChange', v);
                if (fieldType === 'string') {
                  onChange(v, name);
                } else {
                  try {
                    onChange(JSON.parse(v), name);
                  } catch (e) {
                    debug('onChange error', e.message);
                  }
                }
              }}
              ref={ref}
              language={field.uniforms?.language}
              editorOptions={{
                lineNumbers: 'on',
                ...field.uniforms?.editorOptions,
              }}
            />
          </Box>
        </FormControl>
      </Box>
    );
  }
);

export default MonaField;
export type MonacoEditorContainerProps = {
  value: string;
  onChange: (value: string) => void;
  ref: React.Ref<HTMLAnchorElement>;
  language?: string;
  height?: number;
  editorOptions?: editor.IStandaloneEditorConstructionOptions;
};
const MonacoEditorContainer: React.FC<MonacoEditorContainerProps> = (props) => {
  const {
    onChange,
    value,
    ref,
    language = 'json',
    height = 200,
    editorOptions = {},
  } = props;

  return (
    <Editor
      height={height}
      defaultLanguage={language}
      defaultValue={value}
      onChange={(v) => {
        debug('MonacoEditorContainer onChange', v);
        onChange(v);
      }}
      wrapperProps={{
        ref,
      }}
      options={{
        minimap: { enabled: false },
        wordWrap: 'on',
        lineNumbers: 'off',
        folding: false,
        renderLineHighlight: 'none',
        overviewRulerBorder: false,
        overviewRulerLanes: 0,
        hideCursorInOverviewRuler: true,
        ...editorOptions,
      }}
    />
  );
};

export const ConnectedMonaField = connectField(MonaField, {
  initialValue: false,
  kind: 'leaf',
});

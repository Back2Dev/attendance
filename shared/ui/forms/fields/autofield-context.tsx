import React from 'react';
import { AutoField } from 'uniforms-mui';
import { ConnectedMonaField } from './json-field';

const logger = require('debug')('app:forms:fields:autofield-provider');

interface AutoFieldProviderProps {
  children: React.ReactNode;
}

const AutoFieldProvider: React.FC<AutoFieldProviderProps> = ({ children }) => {
  return (
    <AutoField.componentDetectorContext.Provider
      value={(props, uniforms) => {
        // if (props.useSpecialField) {
        //   return SpecialField;
        // }
        // logger('props', props);

        if (props.fieldType === Object && !props.component) {
          logger('Object field, use MonaField', props);
          return ConnectedMonaField;
        }

        return AutoField.defaultComponentDetector(props, uniforms);
      }}
    >
      {children}
    </AutoField.componentDetectorContext.Provider>
  );
};

export default AutoFieldProvider;

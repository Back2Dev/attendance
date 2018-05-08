import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/cache';
import 'rxjs/add/observable/empty';
import isObject from 'lodash/isObject';
import isFunction from 'lodash/isFunction';
import isArray from 'lodash/isArray';
import pick from 'lodash/pick';
import sinon from 'sinon';

const shallowEqual = (objA, objB) =>
  Object.keys(objA).length === Object.keys(objB).length
  && Object.keys(objA).every(key => objA[key] === objB[key])
;

const pickStream = (stream, propsList) => (
  isArray(propsList)
  ? stream.map(props => pick(props, propsList)).distinctUntilChanged(shallowEqual)
  : stream
);


export const compose = (...parts) => (props) => {
  // zero parts provided, just return the current props and dont do anything
  if (parts.length === 0) return props;
  // otherwise call them in order with the current props or merge into the current props
  // if a part is an object
  return parts.reduce((_props, part) => {
    if (isFunction(part)) return part(_props);
    if (isObject(part)) return Object.assign({}, part, _props);
    throw new Error('part must be function or object');
  }, props);
};

export const createAutorunStream = (getMeteorData, propsStream = Observable.of({}), propsList = false) =>
  pickStream(propsStream, propsList)
  .switchMap(props => Observable.create((observer) => observer.next(getMeteorData(props))))
  .cache(1);

export const createConnection = (...parts) => {
  const reducerSubject = new Subject();

  const cleanOutputProps = props => Object.keys(props).reduce(
    (acc, cur) => Object.assign(acc, { [cur]: props[cur] || undefined }),
    {}
  );
  const reducerStream = reducerSubject.startWith(compose(...parts, cleanOutputProps));
  const connection = {
    paramsList: false,
    reducerStream,
  };
  const update = (...updatedParts) => {
    reducerSubject.next(compose(...updatedParts, cleanOutputProps));
  };

  return Object.assign(connection, { update });
};

export const createConnectionStream = (connection, propsStream = Observable.of({})) => {
  const cleanPropsStream = pickStream(propsStream, connection.paramsList);
  const connectionStream = Observable.combineLatest(cleanPropsStream, connection.reducerStream)
    .map(([props, reducer]) => Object.assign(reducer(props), { ready: true }))
    .cache(1);
  return connectionStream;
};

export const createMethod = (...parts) => {
  const method = compose(...parts);
  const observableMethod = props => Observable.create(observer => {
    try {
      observer.next(method(props));
    } finally {
      observer.complete();
    }
  });
  return sinon.spy(observableMethod);
};

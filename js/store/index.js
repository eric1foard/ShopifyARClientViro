import { createStore, applyMiddleware } from 'redux';
import ReduxPromise from 'redux-promise';
import ReduxThunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import reducers from '../reducers';

const logger = createLogger({
  stateTransformer: (state) => ({
      ...state,
      browse: {
        ...state.browse,
        products: []
      },
      search: {
        ...state.search,
        products: []
      }
  }),
  actionTransformer: ({type}) => type
});

const middleware = applyMiddleware(
  ReduxPromise,
  ReduxThunk,
  // logger
);
const store = createStore(reducers, middleware);

export default store;
import { combineReducers } from 'redux';
import browseReducer from './reducer_browse';
import sortReducer from './reducer_sort';
import searchReducer from './reducer_search';
import selectedProductReducer from './reducer_selected';
import shopReducer from './reducer_shop';
import instructionsReducer from './reducer_instructions';

export default combineReducers({
  browse: browseReducer,
  sort: sortReducer,
  search: searchReducer,
  selectedProduct: selectedProductReducer,
  shop: shopReducer,
  instructions: instructionsReducer
});
import {
  SEARCH_PRODUCTS,
  SEARCH_LIST_LOADING,
  UPDATE_SEARCH_TEXT
} from '../actions/types';

const initState = {
  products: [],
  loading: false,
  pageNum: 0,
  pageSize: 6,
  searchStr: ''
}; // TODO: add hasNextPage

// TODO: I may need to mutate list as described here: https://www.codementor.io/lsiden/getting-a-react-native-flatlist-to-be-performant-ik47nkj5q
export default function reducer(state = initState, action) {
  switch (action.type) {
    case SEARCH_PRODUCTS:
      return {
        ...state,
        products: state.products.concat(action.payload.products),
        pageNum: state.pageNum + 1,
        loading: false
      };
    case SEARCH_LIST_LOADING:
      return { ...state, loading: true };
    case UPDATE_SEARCH_TEXT:
      const searchStr = action.payload;
      return {
        ...state,
        searchStr,
        products: searchStr ? state.products : [],
      };
  }
  return state;
}
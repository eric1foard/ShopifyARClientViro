import { GET_PRODUCTS, LIST_LOADING } from '../actions/types';

const initState = {
  products: [],
  loading: true,
  pageNum: 0,
  pageSize: 6
};

// TODO: I may need to mutate list as described here: https://www.codementor.io/lsiden/getting-a-react-native-flatlist-to-be-performant-ik47nkj5q
export default function reducer(state = initState, action) {
  switch (action.type) {
    case GET_PRODUCTS:
      return {
        products: state.products.concat(action.payload.products),
        pageNum: state.pageNum + 1,
        loading: false
      };
    case LIST_LOADING:
      return { ...state, loading: action.payload };
  }
  return state;
}
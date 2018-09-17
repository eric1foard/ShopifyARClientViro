import * as types from './types';
const url = 'https://shopify-ar-admin-staging.herokuapp.com' // TODO: get this from env var
import axios from 'axios';

export const showListLoading = isLoading =>
  ({
    type: types.LIST_LOADING,
    payload: isLoading
  });

const queryProducts = ({ shopName, pageNum, pageSize, searchStr }) => {
  const opts = {
    params: {
      search: searchStr,
      limit: pageSize,
      page: pageNum,
      shop: shopName,
      filters: [
        { key: 'imageNeededFilter', value: 'present' },
        { key: 'dimensionsNeededFilter', value: 'present' }
      ]
    }
  }
  return axios.get(`${url}/api/products`, opts)
  .then(({ data: { products, hasNextPage } }) => ({ products, hasNextPage }));
}

const getProductsSuccess = (payload, isSearch) => ({
  type: isSearch ? types.SEARCH_PRODUCTS : types.GET_PRODUCTS,
  payload
});

export const getProducts = (opts) => dispatch =>
    queryProducts(opts)
    .then(data => dispatch(getProductsSuccess(data, typeof opts.searchStr === 'string')))
    .catch(err => {
      console.error('error getting products', err);
      // TODO: display banner error here
    });

export const updateSearchText = text => ({
  type: types.UPDATE_SEARCH_TEXT,
  payload: text
});

export const handleProductSelect = payload => ({
  type: types.SELECT_PRODUCT,
  payload
});

export const nextInstruction = payload => ({
  type: types.NEXT_INSTRUCTION,
  payload
});

export const foundAnchor = payload => ({
  type: types.ANCHOR_FOUND,
  payload
});

export const setPlanePoint = payload => ({
  type: types.SET_PLANE_POINT,
  payload
});

export const setImageHeight = () => ({
  type: types.SET_IMAGE_HEIGHT
});
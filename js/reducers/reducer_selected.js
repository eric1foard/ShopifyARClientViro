import { SELECT_PRODUCT, SHOW_PRODUCT } from '../actions/types';

export default function reducer(state = null, action) {
  switch (action.type) {
      case SELECT_PRODUCT:
          return { ...action.payload, visible: false };
      case SHOW_PRODUCT:
          return { ...state, visible: true };
  }
  return state;
}
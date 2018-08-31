import { SELECT_PRODUCT, ANCHOR_FOUND } from '../actions/types';

export default function reducer(state = null, action) {
  switch (action.type) {
      case SELECT_PRODUCT:
          return { ...action.payload, visible: false };
      case ANCHOR_FOUND:
          return {
            ...state,
            visible: true,
            anchorPos: action.payload.vertices[0]
          };
  }
  return state;
}
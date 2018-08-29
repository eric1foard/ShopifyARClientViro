import { SELECT_PRODUCT } from '../actions/types';

export default function reducer(state = null, action) {
  switch (action.type) {
      case SELECT_PRODUCT:
          return action.payload;
  }
  return state;
}
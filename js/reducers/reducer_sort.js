export default function reducer(state = null, action) {
  switch (action.type) {
      case 'SORT_BY':
          return action.payload;
  }
  return state;
}
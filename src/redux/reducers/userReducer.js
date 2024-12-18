const initialState = {
  Users: [],
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_USERS": {
      state = {
        ...state,
        Users: action.payload,
      };
      return state;
    }
    default:
      return state;
  }
}

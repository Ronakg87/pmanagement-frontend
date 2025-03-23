// import { createStore, applyMiddleware, combineReducers } from "redux";
// import { thunk } from "redux-thunk";
// import authReducer from "./reducers/authReducer";
// import productReducer from "./reducers/productReducer";

// const rootReducer = combineReducers({
//     auth: authReducer,
//     products: productReducer,
//   });

//   const store = createStore(rootReducer, applyMiddleware(thunk));

//   export default store;

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import productReducer from "./features/productSlice";
import userReducer from "./features/userSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    users: userReducer
  },
});

export default store;
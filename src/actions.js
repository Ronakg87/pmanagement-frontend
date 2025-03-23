// import axios from "axios";

// const API_URL = process.env.REACT_APP_BACKEND_URL;

// // Authentication Actions
// export const loginUser = (credentials) => async (dispatch) => {
//     try {
//       const res = await axios.post(`${API_URL}/login`, credentials);
//     //   console.log(res);
//       localStorage.setItem("token", res.data.data.token);
//       dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
//       return res.data.data;
//     } catch (error) {
//         // console.log("error", error);
//       dispatch({ type: "LOGIN_FAIL", payload: error.response.data });
//     }
//   };

// export const logoutUser = () => (dispatch) => {
// localStorage.removeItem("token");
// dispatch({ type: "LOGOUT" });
// };

// // Product Actions
// export const fetchProducts = () => async (dispatch) => {
//     try {
        
//         const res = await axios.get(`${API_URL}/all-products`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         });
        
//         dispatch({ type: "FETCH_PRODUCTS_SUCCESS", payload: res.data.result });
//         return res.data.result;
//     } catch (error) {
//         dispatch({ type: "FETCH_PRODUCTS_FAIL", payload: error.response.data });
//     }
// };
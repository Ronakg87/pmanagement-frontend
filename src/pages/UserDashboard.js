// // import React, { useEffect, useState } from "react";
// // import { useDispatch, useSelector } from "react-redux";
// // import { fetchProducts } from "../actions";
// // import { Link } from "react-router-dom";

// // const UserDashboard = () => {
// //   const dispatch = useDispatch();
// //   const { products, error } = useSelector((state) => state.products || { products: [], error: null });
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       await dispatch(fetchProducts());
// //       setLoading(false);
// //     };
// //     fetchData();
// //   }, [dispatch]);
// //   const userProducts = (products || []).filter((product) => product.source === "user");
// //   console.log(products);

// //   return (
// //     <div className="container">
// //       <h2>User Dashboard</h2>
// //       <Link to="/admin">Switch to Admin Dashboard</Link>

// //       {loading ? (
// //         <p>Loading products...</p>
// //       ) : error ? (
// //         <p className="error">Error: {error}</p>
// //       ) : (
// //         <div className="product-grid">
// //           {userProducts.length > 0 ? (
// //             userProducts.map((product) => (
// //               <div key={product._id} className="product-card">
// //                 <h3>{product.name}</h3>
// //                 <p>SKU: {product.sku}</p>
// //                 <p>Category: {product.category}</p>
// //               </div>
// //             ))
// //           ) : (
// //             <p>No products assigned to this user.</p>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default UserDashboard;


// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchProducts } from "../features/productSlice";
// import { Link } from "react-router-dom";

// const UserDashboard = () => {
//   const dispatch = useDispatch();
//   const { products, loading, error } = useSelector((state) => state.products);

//   useEffect(() => {
//     dispatch(fetchProducts());
//   }, [dispatch]);

//   const userProducts = (products || []).filter(
//     (product) => product.source === "user"
//   );

//   return (
//     <div className="container">
//       <h2>User Dashboard</h2>
//       <Link to="/admin">Switch to Admin Dashboard</Link>

//       {loading ? (
//         <p>Loading products...</p>
//       ) : error ? (
//         <p className="error">Error: {error}</p>
//       ) : (
//         <div className="product-grid">
//           {userProducts.length > 0 ? (
//             userProducts.map((product) => (
//               <div key={product._id} className="product-card">
//                 <h3>{product.name}</h3>
//                 <p>SKU: {product.sku}</p>
//                 <p>Category: {product.category}</p>
//               </div>
//             ))
//           ) : (
//             <p>No products assigned to this user.</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserDashboard;

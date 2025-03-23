// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchProducts } from "../actions";
// import { Link } from "react-router-dom";

// const AdminDashboard = () => {
//   const dispatch = useDispatch();
//   const { products, error } = useSelector((state) => state.products);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//        await dispatch(fetchProducts());
//       setLoading(false);
//     };
//     fetchData();
//   }, [dispatch]);

//   return (
//     <div className="container">
//       <h2>Admin Dashboard</h2>
//       <Link to="/user">Switch to User Dashboard</Link>

//       {loading ? (
//         <p>Loading products...</p>
//       ) : error ? (
//         <p className="error">Error: {error}</p>
//       ) : (
//         <div className="product-grid">
//           {products?.length > 0 ? (
//             products.map((product) => (
//               <div key={product._id} className="product-card">
//                 <h3>{product.name}</h3>
//                 <p>SKU: {product.sku}</p>
//                 <p>Category: {product.category}</p>
//                 <p>Source: {product.source}</p>
//                 <img
//                   src={`${process.env.REACT_APP_BACKEND_URL}/productLogo/${product.logo}`}
//                   alt={product.name}
//                   style={{ width: "100%" }}
//                 />
//               </div>
//             ))
//           ) : (
//             <p>No products found.</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminDashboard;

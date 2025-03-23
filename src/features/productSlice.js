import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Fetch All Products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/all-products`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch products");
    }
  }
);

// Fetch Product By ID
export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/product/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch the product"
      );
    }
  }
);

// Create Product
export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/add-product`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // toast.success("Product created successfully!");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to create product");
      return rejectWithValue(error.response?.data || "Failed to create product");
    }
  }
);

// Update Product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      
      const res = await axios.patch(`${API_URL}/product/${id}`, formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      // toast.success("Product updated successfully!");
      console.log(res.data);
      return res.data;
    } catch (error) {
      toast.error(error.response?.data || "Failed to update product");
      return rejectWithValue(error.response?.data || "Failed to update product");
    }
  }
);

// Delete Product
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async ({productId, source}, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/product/${productId}/${source}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      // toast.success("Product deleted successfully!");
      return productId;
    } catch (error) {
      toast.error(error.response?.data || "Failed to delete product");
      return rejectWithValue(error.response?.data || "Failed to delete product");
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    selectedProduct: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Product By ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedProduct = null; // Clear previously selected product
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.selectedProduct = null;
      })

      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        if (!Array.isArray(state.products)) {
          state.products = []; // Reinitialize as an array
        }
        state?.products?.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
      
        // Assuming the response contains the updated product data in `action.payload`
        const updatedProduct = action.payload;
      
        // Update the specific product in the `products` object
        if (updatedProduct && updatedProduct._id) {
          state.products[updatedProduct._id] = updatedProduct; // Replace the old product with the updated one
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload?.id || action.payload; 

        if (Array.isArray(state.products)) {
          state.products = state.products.filter(
          (product) => product._id !== deletedId
        );
    }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;

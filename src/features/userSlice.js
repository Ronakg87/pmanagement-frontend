import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Fetch All Users
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/allusers`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return res.data;

    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch users");
    }
  }
);

// Fetch User Details by ID
export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/get-users`, { ids: userId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      return { userId, data: res.data.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch user data");
    }
  }
);

//  Create User
export const createUser = createAsyncThunk(
  "users/createUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/create-user`, userData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return res.data;
    } catch (error) {
      toast.error(error.response?.data || "Failed to create user");
      return rejectWithValue(error.response?.data || "Failed to create user");
    }
  }
);

//  Update User
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ userId, name, email }, { rejectWithValue }) => {
    try {

      const res = await axios.patch(`${API_URL}/user/${userId}`, { name: name, email: email}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return res.data;
    } catch (error) {
      toast.error(error.response?.data || "Failed to update user");
      return rejectWithValue(error.response?.data || "Failed to update user");
    }
  }
);


const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    userDetails: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch users";
      })

      // Fetch User By ID
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.userDetails = action.payload;  // Store user details in the state
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Create User
      .addCase(createUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        if (!Array.isArray(state.users)) {
          state.users = []; // Reinitialize as an array
        }
        state?.users?.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;

        // Update the user in the state
        const index = state.users.findIndex(
          (user) => user._id === action.payload._id
        );
        if (index !== -1) {
          state.users[index] = action.payload;  // Update user details
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../api";

export const getHobbies = createAsyncThunk(
  "hobbies/getHobbies",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/hobbies/getHobbies");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const hobbiesSlice = createSlice({
  name: "hobbies",
  initialState: {
    hobbies: [],
    loading: false,
    error: null,
  },
  reducers: [],
  extraReducers: (builder) => {
    builder
      .addCase(getHobbies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getHobbies.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.hobbies = action.payload;
      })
      .addCase(getHobbies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch hobbies";
      });
  },
});

export default hobbiesSlice.reducer;

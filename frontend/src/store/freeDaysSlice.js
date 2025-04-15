import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api";

export const addFreeDays = createAsyncThunk(
  "freeDays/addFreeDays",
  async ({ arrayDate, id }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await API.post(
        "/freeDays/addFreeDays",
        { arrayDate, id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getFreeDays = createAsyncThunk(
  "freeDays/getFreeDays",
  async ({ id }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await API.get(`/freeDays/getFreeDays?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteFreeDays = createAsyncThunk(
  "freeDays/deleteFreeDays",
  async ({ arrayDate, id }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await API.post(
        `/freeDays/deleteFreeDays`,
        { arrayDate, id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const freeDaysSlice = createSlice({
  name: "freeDays",
  initialState: { loading: false, error: null, freeDays: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addFreeDays.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFreeDays.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addFreeDays.rejected, (state, action) => {
        state.error = action.payload.message || "add days failed";
        state.loading = false;
      })
      .addCase(getFreeDays.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFreeDays.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.freeDays = action.payload.freeDays;
      })
      .addCase(getFreeDays.rejected, (state, action) => {
        state.error = action.payload.message || "get days failed";
        state.loading = false;
      });
  },
});

export default freeDaysSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api";

export const addInterests = createAsyncThunk(
  "interests/addInterests",
  async ({ arrayOfInterests, id }, { getState, rejectWithValue }) => {
    try {
      const response = await API.post(
        `/interests/addInterests`,
        {
          hobbies: arrayOfInterests,
          id: id,
        },
        { headers: { Authorization: `Bearer ${getState().auth.token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getInterests = createAsyncThunk(
  "interests/getInterests",
  async ({ id }, { getState, rejectWithValue }) => {
    try {
      const response = await API.get(`interests/getInterests?id=${id}`, {
        headers: { Authorization: `Bearer ${getState().auth.token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
const interestSlice = createSlice({
  name: "interests",
  initialState: { error: null, loading: false, interests: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addInterests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addInterests.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addInterests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getInterests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInterests.fulfilled, (state, action) => {
        state.interests = action.payload.interests;
        state.loading = false;
        state.error = null;
      })
      .addCase(getInterests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default interestSlice.reducer;

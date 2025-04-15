import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../api";

export const getWishes = createAsyncThunk(
  "wishes/getWishes",
  async ({ id1, id2 }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await API.get(
        `/wishes/getWishes?id1=${id1}&id2=${id2}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Ошибка при получении пожеланий"
      );
    }
  }
);

export const createWish = createAsyncThunk(
  "wishes/createWish",
  async (
    { description, createdId, wishlistId },
    { rejectWithValue, getState }
  ) => {
    try {
      const token = getState().auth.token;
      const response = await API.post(
        "/wishes/createWish",
        {
          description,
          createdId,
          wishlistId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Ошибка при создании пожелания"
      );
    }
  }
);

export const deleteWish = createAsyncThunk(
  "wishes/deleteWish",
  async ({ id }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await API.delete(`wishes/deleteWish?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const wishesSlice = createSlice({
  name: "wishes",
  initialState: {
    wishes: [],
    users: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearWishes: (state) => {
      state.wishes = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWishes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWishes.fulfilled, (state, action) => {
        state.loading = false;
        state.wishes = action.payload.wishes;
        state.users = action.payload.users;
      })
      .addCase(getWishes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createWish.fulfilled, (state, action) => {
        state.wishes.push(action.payload);
      })
      .addCase(deleteWish.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWish.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.wishes = state.wishes.filter(
          (wish) => wish.id !== action.payload
        );
      })
      .addCase(deleteWish.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearWishes } = wishesSlice.actions;
export default wishesSlice.reducer;

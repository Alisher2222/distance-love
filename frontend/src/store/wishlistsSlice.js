import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../api";

export const getWishlists = createAsyncThunk(
  "wishlists/getWishlists",
  async ({ coupleId }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await API.get(
        `/wishlists/getWishlists?coupleId=${coupleId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Ошибка при получении вишлистов"
      );
    }
  }
);

export const createWishlist = createAsyncThunk(
  "wishlists/createWishlist",
  async ({ text, createdId, partnerId }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await API.post(
        "/wishlists/createWishlist",
        {
          text,
          createdId,
          partnerId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Ошибка при создании вишлиста"
      );
    }
  }
);

export const deleteWishlist = createAsyncThunk(
  "wishlists/deleteWishlist",
  async ({ id }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      await API.delete(`/wishlists/deleteWishlist?id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Ошибка при удалении вишлиста"
      );
    }
  }
);

const wishlistsSlice = createSlice({
  name: "wishlists",
  initialState: {
    wishlists: [],
    loading: false,
    error: null,
  },
  reducers: [],
  extraReducers: (builder) => {
    builder
      .addCase(getWishlists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWishlists.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlists = action.payload.wishlists;
      })
      .addCase(getWishlists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createWishlist.fulfilled, (state, action) => {
        state.wishlists.push(action.payload);
      })
      .addCase(deleteWishlist.fulfilled, (state, action) => {
        state.wishlists = state.wishlists.filter(
          (w) => w.id !== action.payload
        );
      });
  },
});

export default wishlistsSlice.reducer;

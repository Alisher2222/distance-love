import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api";

// 1. Отправка запроса на отношения
export const sendRequest = createAsyncThunk(
  "relationships/sendRequest",
  async ({ senderId, receiverId }, { rejectWithValue, getState }) => {
    try {
      const response = await API.post(
        "/relationships/sendRequest",
        {
          senderId: Number(senderId),
          receiverId: Number(receiverId),
        },
        {
          headers: {
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 2. Подтверждение отношений
export const createRelationship = createAsyncThunk(
  "relationships/createRelationship",
  async ({ senderId, receiverId }, { rejectWithValue, getState }) => {
    try {
      const response = await API.post(
        "/relationships/createRelationship",
        {
          senderId: Number(senderId),
          receiverId: Number(receiverId),
        },
        {
          headers: {
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 3. Получение ID активных отношений
export const getRelationshipId = createAsyncThunk(
  "relationships/getRelationshipId",
  async ({ id }, { getState, rejectWithValue }) => {
    try {
      const response = await API.get(
        `/relationships/getRelationshipId?id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 4. Получение всех отправленных и полученных запросов
export const getAllRequests = createAsyncThunk(
  "relationships/getAllRequests",
  async ({ id }, { rejectWithValue, getState }) => {
    try {
      const response = await API.get(`/relationships/getAllRequests?id=${id}`, {
        headers: {
          Authorization: `Bearer ${getState().auth.token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 5. Отклонение запроса
export const rejectRequest = createAsyncThunk(
  "relationships/rejectRequest",
  async ({ senderId, receiverId }, { rejectWithValue, getState }) => {
    try {
      const response = await API.post(
        "/relationships/rejectRequest",
        {
          senderId: Number(senderId),
          receiverId: Number(receiverId),
        },
        {
          headers: {
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getRelationshipData = createAsyncThunk(
  "relationships/getRelationshipData",
  async ({ coupleId, userId }, { rejectWithValue, getState }) => {
    try {
      const response = await API.get(
        `/relationships/getRelationshipData?coupleId=${coupleId}&userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createRelationshipHistory = createAsyncThunk(
  "relationships/createRelationshipHistory",
  async (
    { coupleId, description, dateOfHistory },
    { rejectWithValue, getState }
  ) => {
    try {
      const response = await API.post(
        "/relationships/createRelationshipHistory",
        { coupleId, description, dateOfHistory },
        {
          headers: {
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// Slice
const relationshipSlice = createSlice({
  name: "relationships",
  initialState: {
    loading: false,
    error: null,
    coupleId: null,
    requests: [],
    partnerData: {},
    sharedInterests: [],
    histories: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // sendRequest
      .addCase(sendRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendRequest.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(sendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // createRelationship
      .addCase(createRelationship.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRelationship.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.coupleId = action.payload.id;
      })
      .addCase(createRelationship.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getRelationshipId
      .addCase(getRelationshipId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRelationshipId.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.coupleId = action.payload.coupleId;
      })
      .addCase(getRelationshipId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getAllRequests
      .addCase(getAllRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload.requests;
      })
      .addCase(getAllRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // rejectRequest
      .addCase(rejectRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectRequest.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(rejectRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //getRelationshipData
      .addCase(getRelationshipData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRelationshipData.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.partnerData = action.payload.partnerData;
        state.sharedInterests = action.payload.sharedInterests;
        state.histories = action.payload.histories;
      })
      .addCase(getRelationshipData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //createRelationshipHistory
      .addCase(createRelationshipHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRelationshipHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createRelationshipHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default relationshipSlice.reducer;

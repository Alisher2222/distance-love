import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api";

export const getMeetings = createAsyncThunk(
  "meeting/getMeetings",
  async ({ id }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const reponse = await API.post(
        "/meetings/getMeetings",
        { id: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return reponse.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addMeeting = createAsyncThunk(
  "meeting/addMeeting",
  async ({ id, date }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const reponse = await API.post(
        "/meetings/addMeeting",
        { id, date },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return reponse.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const meetingsSlice = createSlice({
  name: "meetings",
  initialState: { error: null, loading: false, dates: [] },
  reducers: {},
  extraReducers: (builder) => {
    // === GET MEETINGS ===
    builder
      .addCase(getMeetings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMeetings.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.dates = action.payload.dates;
      })
      .addCase(getMeetings.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Something went wrong while fetching meetings.";
      });

    // === ADD MEETING ===
    builder
      .addCase(addMeeting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMeeting.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addMeeting.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Something went wrong while adding meeting.";
      });
  },
});

export default meetingsSlice.reducer;

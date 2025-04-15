import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../api";

export const getTasks = createAsyncThunk(
  "tasks/getTasks",
  async ({ created_id, partner_id }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await API.get(
        `/tasks/getTasks?created_id=${created_id}${
          partner_id ? `&partner_id=${partner_id}` : ""
        }`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Ошибка при получении задач"
      );
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (
    { text, mood, due_date, created_id, partner_id },
    { rejectWithValue, getState }
  ) => {
    try {
      const token = getState().auth.token;
      const response = await API.post(
        "/tasks/createTask",
        {
          text,
          mood,
          due_date,
          created_id,
          partner_id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Ошибка при создании задачи"
      );
    }
  }
);
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async ({ id }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      await API.delete(`/tasks/deleteTask/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Ошибка при удалении задачи"
      );
    }
  }
);

export const toggleTaskCompletion = createAsyncThunk(
  "tasks/toggleTaskCompletion",
  async ({ id }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await API.patch(
        `/tasks/toggleTaskCompletion/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { id, is_completed: response.data.is_completed };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Ошибка при изменении статуса задачи"
      );
    }
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    users: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearTasks: (state) => {
      state.tasks = [];
      state.users = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Обработка getTasks
      .addCase(getTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks;
        state.users = action.payload.users;
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Обработка createTask
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload.task);
        // Добавляем пользователя, если его еще нет
        if (
          action.payload.user &&
          !state.users.some((u) => u.id === action.payload.user.id)
        ) {
          state.users.push(action.payload.user);
        }
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Обработка deleteTask
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Обработка toggleTaskCompletion
      .addCase(toggleTaskCompletion.fulfilled, (state, action) => {
        const task = state.tasks.find((t) => t.id === action.payload.id);
        if (task) {
          task.is_completed = action.payload.is_completed;
        }
      });
  },
});

export const { clearTasks } = tasksSlice.actions;
export default tasksSlice.reducer;

import React, { useEffect, useState } from "react";
import { Calendar, Heart, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import Navbar from "./../components/navbar";
import {
  getTasks,
  createTask,
  toggleTaskCompletion,
  clearTasks,
} from "../store/tasksSlice";
import "../style/todoList.css";
import { getRelationshipData } from "../store/relationshipsSlice";

const moodTags = [
  { value: "romantic", label: "Romantic 💖" },
  { value: "funny", label: "Funny 😄" },
  { value: "important", label: "Important ⭐" },
  { value: "surprise", label: "Surprise 🎁" },
];

export default function TaskList() {
  const dispatch = useDispatch();

  const {
    tasks = [],
    users = [],
    loading,
    error,
  } = useSelector((state) => state.tasks);
  const userId = useSelector((state) => state.auth.userId) || null;
  const coupleId = useSelector((state) => state.relationships.coupleId) || null;
  const partnerData =
    useSelector((state) => state.relationships.partnerData) || {};
  const partnerId = partnerData.id || null;

  const [activeTab, setActiveTab] = useState("partner");
  const [newTask, setNewTask] = useState("");
  const [selectedMood, setSelectedMood] = useState("romantic");
  const [forPartner, setForPartner] = useState(true);

  useEffect(() => {
    if (coupleId && userId) {
      dispatch(getRelationshipData({ coupleId, userId }));
    }
  }, [coupleId, userId, dispatch]);

  useEffect(() => {
    if (userId && partnerId) {
      dispatch(getTasks({ created_id: userId, partner_id: partnerId }));
    }
    return () => dispatch(clearTasks());
  }, [dispatch, userId, partnerId]);

  const handleAddTask = async () => {
    if (!newTask.trim() || !userId) return;

    try {
      await dispatch(
        createTask({
          text: newTask,
          mood: selectedMood,
          created_id: userId,
          partner_id: forPartner ? partnerId : null,
        })
      );
      setNewTask("");
      dispatch(getTasks({ created_id: userId, partner_id: partnerId }));
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };

  const handleToggleCompletion = async (taskId) => {
    try {
      await dispatch(toggleTaskCompletion({ id: taskId }));
    } catch (err) {
      console.error("Failed to toggle task:", err);
    }
  };

  // Фильтрация задач с учетом вкладки
  const filteredTasks = (Array.isArray(tasks) ? tasks : [])
    .filter((task) => task && typeof task === "object")
    .filter((task) => {
      if (activeTab === "partner") {
        return task.partner_id === partnerId;
      } else {
        return !task.partner_id || task.partner_id === null;
      }
    });

  if (loading && tasks.length === 0) {
    return <div className="loading">Loading tasks...</div>;
  }

  if (error) {
    return <div className="error">Error: {error.message || String(error)}</div>;
  }

  return (
    <>
      <Navbar />
      <div className="tasklist-container">
        <h1 className="title">
          Plan sweet little missions for your partner 💌
        </h1>
        <p className="subtitle">
          Surprise them with thoughtful tasks before your next date.
        </p>

        <input
          className="task-input"
          placeholder="e.g. Write me a handwritten note"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
        />

        <div className="tag-selector">
          {moodTags.map((tag) => (
            <span
              key={tag.value}
              className={`tag ${selectedMood === tag.value ? "selected" : ""}`}
              onClick={() => setSelectedMood(tag.value)}
            >
              {tag.label}
            </span>
          ))}
        </div>

        <div className="controls">
          <label>
            <input
              type="checkbox"
              checked={forPartner}
              onChange={() => setForPartner(!forPartner)}
            />
            Task for partner
          </label>
          <button
            className="add-button"
            onClick={handleAddTask}
            disabled={!newTask.trim() || loading}
          >
            <Plus className="icon" /> {loading ? "Adding..." : "Add Task"}
          </button>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === "partner" ? "active" : ""}`}
            onClick={() => setActiveTab("partner")}
          >
            Tasks for Partner
          </button>
          <button
            className={`tab ${activeTab === "me" ? "active" : ""}`}
            onClick={() => setActiveTab("me")}
          >
            Tasks for Me
          </button>
        </div>

        <div className="task-list">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                creator={users.find((u) => u?.id === task.created_id) || {}}
                partner={
                  task.partner_id
                    ? users.find((u) => u?.id === task.partner_id)
                    : null
                }
                onToggleComplete={() => handleToggleCompletion(task.id)}
              />
            ))
          ) : (
            <div
              className={`empty-state ${
                activeTab === "partner" ? "pink" : "purple"
              }`}
            >
              <Heart className="icon" />
              <p>
                {activeTab === "partner"
                  ? "No tasks for your partner yet."
                  : "No tasks for you yet."}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function TaskCard({
  task = {},
  creator = {},
  partner = null,
  onToggleComplete,
}) {
  const safeTask = {
    id: task.id || "",
    text: task.text || "",
    mood: task.mood || "romantic",
    is_completed: Boolean(task.is_completed),
    partner_id: task.partner_id || null,
    due_date: task.due_date || null,
  };

  const tagClass = moodTags.some((t) => t.value === safeTask.mood)
    ? safeTask.mood
    : "romantic";

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime())
        ? null
        : date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
    } catch {
      return null;
    }
  };

  return (
    <div
      className={`task-card ${safeTask.is_completed ? "completed" : ""} ${
        safeTask.partner_id ? "pink" : "purple"
      }`}
    >
      <input
        type="checkbox"
        checked={safeTask.is_completed}
        onChange={onToggleComplete}
      />
      <div className="task-info">
        <p className="task-text">{safeTask.text}</p>
        <div className="task-meta">
          <span className={`badge ${tagClass}`}>
            {moodTags.find((t) => t.value === tagClass)?.label || tagClass}
          </span>
          {safeTask.partner_id ? (
            <span className="user-badge">
              For: {partner?.name || "Partner"} {partner?.surname || ""}
            </span>
          ) : (
            <span className="user-badge">
              From: {creator?.name || "You"} {creator?.surname || ""}
            </span>
          )}
          {safeTask.due_date && (
            <span className="due-date">
              <Calendar className="icon" /> Before{" "}
              {formatDate(safeTask.due_date)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

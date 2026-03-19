import { useState, useEffect, useCallback } from 'react';
import { tasksAPI } from '../services/api';
import toast from 'react-hot-toast';

export function useTasks(filters = {}) {
  const [tasks,      setTasks]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await tasksAPI.getAll({
        ...filters,
        limit: filters.limit || 9,
      });
      setTasks(data.tasks || data);
      if (data.pagination) setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]); // eslint-disable-line

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const createTask = useCallback(async (payload) => {
    const toastId = toast.loading('Creating task…');
    try {
      const { data } = await tasksAPI.create(payload);
      setTasks((prev) => [data.task || data, ...prev]);
      toast.success('Task created!', { id: toastId });
      return data;
    } catch (err) {
      toast.error(err.message, { id: toastId });
      throw err;
    }
  }, []);

  const updateTask = useCallback(async (id, payload) => {
    const toastId = toast.loading('Updating…');
    try {
      const { data } = await tasksAPI.update(id, payload);
      const updated = data.task || data;
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
      toast.success('Task updated!', { id: toastId });
      return updated;
    } catch (err) {
      toast.error(err.message, { id: toastId });
      throw err;
    }
  }, []);

  const deleteTask = useCallback(async (id) => {
    const toastId = toast.loading('Deleting…');
    try {
      await tasksAPI.remove(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast.success('Task deleted', { id: toastId });
    } catch (err) {
      toast.error(err.message, { id: toastId });
      throw err;
    }
  }, []);

  const toggleStatus = useCallback(async (task) => {
    const next = task.status === 'completed' ? 'pending' : 'completed';
    return updateTask(task._id, { ...task, status: next });
  }, [updateTask]);

  return {
    tasks, loading, error, pagination,
    refetch: fetchTasks,
    createTask, updateTask, deleteTask, toggleStatus,
  };
}

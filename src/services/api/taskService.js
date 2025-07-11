// Store time tracking data in memory for now
let timeTrackingData = new Map();

export const getAllTasks = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        { field: { Name: "title" } },
        { field: { Name: "priority" } },
        { field: { Name: "status" } },
        { field: { Name: "due_date" } },
        { field: { Name: "time_tracking" } },
        { field: { Name: "project_id" } }
      ],
      orderBy: [
        { fieldName: "due_date", sorttype: "ASC" }
      ]
    };

    const response = await apperClient.fetchRecords('task', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    // Add time tracking data to tasks
    const tasks = (response.data || []).map(task => ({
      ...task,
      timeTracking: timeTrackingData.get(task.Id) || {
        totalTime: 0,
        activeTimer: null,
        timeLogs: []
      }
    }));

    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const getTaskById = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        { field: { Name: "title" } },
        { field: { Name: "priority" } },
        { field: { Name: "status" } },
        { field: { Name: "due_date" } },
        { field: { Name: "time_tracking" } },
        { field: { Name: "project_id" } }
      ]
    };

    const response = await apperClient.getRecordById('task', parseInt(id), params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    // Add time tracking data
    return {
      ...response.data,
      timeTracking: timeTrackingData.get(response.data.Id) || {
        totalTime: 0,
        activeTimer: null,
        timeLogs: []
      }
    };
  } catch (error) {
    console.error(`Error fetching task with ID ${id}:`, error);
    throw error;
  }
};

export const createTask = async (taskData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [{
        title: taskData.title,
        priority: taskData.priority || 'medium',
        status: taskData.status || 'todo',
        due_date: taskData.dueDate,
        project_id: parseInt(taskData.projectId)
      }]
    };

    const response = await apperClient.createRecord('task', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create task:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to create task');
      }
      
      return response.results[0].data;
    }
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

export const updateTask = async (id, taskData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [{
        Id: parseInt(id),
        title: taskData.title,
        priority: taskData.priority,
        status: taskData.status,
        due_date: taskData.dueDate,
        project_id: parseInt(taskData.projectId)
      }]
    };

    const response = await apperClient.updateRecord('task', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to update task:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to update task');
      }
      
      return response.results[0].data;
    }
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

export const updateTaskStatus = async (id, status) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [{
        Id: parseInt(id),
        status: status
      }]
    };

    const response = await apperClient.updateRecord('task', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to update task status:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to update task status');
      }
      
      return response.results[0].data;
    }
  } catch (error) {
    console.error("Error updating task status:", error);
    throw error;
  }
};

export const deleteTask = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      RecordIds: [parseInt(id)]
    };

    const response = await apperClient.deleteRecord('task', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    // Clean up time tracking data
    timeTrackingData.delete(parseInt(id));

    return true;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

export const startTaskTimer = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const taskId = parseInt(id);
  const now = new Date().toISOString();
  
  let taskTimeData = timeTrackingData.get(taskId) || {
    totalTime: 0,
    activeTimer: null,
    timeLogs: []
  };

  if (taskTimeData.activeTimer) {
    throw new Error("Timer already running for this task");
  }

  taskTimeData.activeTimer = {
    Id: taskId,
    startTime: now
  };

  timeTrackingData.set(taskId, taskTimeData);
  return { ...taskTimeData.activeTimer };
};

export const stopTaskTimer = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const taskId = parseInt(id);
  let taskTimeData = timeTrackingData.get(taskId);
  
  if (!taskTimeData?.activeTimer) {
    throw new Error("No active timer for this task");
  }

  const now = new Date().toISOString();
  const startTime = new Date(taskTimeData.activeTimer.startTime);
  const endTime = new Date(now);
  const duration = endTime.getTime() - startTime.getTime();

  const timeLog = {
    Id: Date.now(),
    startTime: taskTimeData.activeTimer.startTime,
    endTime: now,
    duration: duration,
    date: startTime.toISOString().split('T')[0]
  };

  taskTimeData.timeLogs.push(timeLog);
  taskTimeData.totalTime += duration;
  taskTimeData.activeTimer = null;

  timeTrackingData.set(taskId, taskTimeData);
  return { ...timeLog };
};

export const getTaskTimeLogs = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 150));
  
  const taskId = parseInt(id);
  const taskTimeData = timeTrackingData.get(taskId);
  
  return taskTimeData?.timeLogs || [];
};
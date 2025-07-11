export const getAllProjects = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "status" } },
        { field: { Name: "budget" } },
        { field: { Name: "start_date" } },
        { field: { Name: "end_date" } },
        { field: { Name: "client_id" } }
      ],
      orderBy: [
        { fieldName: "start_date", sorttype: "DESC" }
      ]
    };

    const response = await apperClient.fetchRecords('project', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return response.data || [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export const getProjectById = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "status" } },
        { field: { Name: "budget" } },
        { field: { Name: "start_date" } },
        { field: { Name: "end_date" } },
        { field: { Name: "client_id" } }
      ]
    };

    const response = await apperClient.getRecordById('project', parseInt(id), params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching project with ID ${id}:`, error);
    throw error;
  }
};

export const createProject = async (projectData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [{
        Name: projectData.name,
        status: projectData.status || 'planning',
        budget: projectData.budget ? parseFloat(projectData.budget) : null,
        start_date: projectData.startDate,
        end_date: projectData.endDate,
        client_id: parseInt(projectData.clientId)
      }]
    };

    const response = await apperClient.createRecord('project', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create project:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to create project');
      }
      
      return response.results[0].data;
    }
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const updateProject = async (id, projectData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [{
        Id: parseInt(id),
        Name: projectData.name,
        status: projectData.status,
        budget: projectData.budget ? parseFloat(projectData.budget) : null,
        start_date: projectData.startDate,
        end_date: projectData.endDate,
        client_id: parseInt(projectData.clientId)
      }]
    };

    const response = await apperClient.updateRecord('project', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to update project:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to update project');
      }
      
      return response.results[0].data;
    }
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

export const deleteProject = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      RecordIds: [parseInt(id)]
    };

    const response = await apperClient.deleteRecord('project', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return true;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};
export const getAllInvoices = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        { field: { Name: "amount" } },
        { field: { Name: "status" } },
        { field: { Name: "due_date" } },
        { field: { Name: "payment_date" } },
        { field: { Name: "client_id" } },
        { field: { Name: "project_id" } }
      ],
      orderBy: [
        { fieldName: "due_date", sorttype: "DESC" }
      ]
    };

    const response = await apperClient.fetchRecords('app_invoice', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return response.data || [];
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
};

export const getInvoiceById = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        { field: { Name: "amount" } },
        { field: { Name: "status" } },
        { field: { Name: "due_date" } },
        { field: { Name: "payment_date" } },
        { field: { Name: "client_id" } },
        { field: { Name: "project_id" } }
      ]
    };

    const response = await apperClient.getRecordById('app_invoice', parseInt(id), params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching invoice with ID ${id}:`, error);
    throw error;
  }
};

export const createInvoice = async (invoiceData) => {
  try {
    // Validate required fields
    if (!invoiceData.projectId) {
      throw new Error("Project ID is required");
    }
    if (!invoiceData.amount || invoiceData.amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }
    if (!invoiceData.dueDate) {
      throw new Error("Due date is required");
    }

    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [{
        amount: parseFloat(invoiceData.amount),
        status: invoiceData.status || 'draft',
        due_date: invoiceData.dueDate,
        client_id: parseInt(invoiceData.clientId),
        project_id: parseInt(invoiceData.projectId),
        ...(invoiceData.paymentDate && { payment_date: invoiceData.paymentDate })
      }]
    };

    const response = await apperClient.createRecord('app_invoice', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create invoice:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to create invoice');
      }
      
      return response.results[0].data;
    }
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
};

export const updateInvoice = async (id, invoiceData) => {
  try {
    if (invoiceData.amount !== undefined && invoiceData.amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [{
        Id: parseInt(id),
        ...(invoiceData.amount !== undefined && { amount: parseFloat(invoiceData.amount) }),
        ...(invoiceData.status && { status: invoiceData.status }),
        ...(invoiceData.dueDate && { due_date: invoiceData.dueDate }),
        ...(invoiceData.paymentDate && { payment_date: invoiceData.paymentDate }),
        ...(invoiceData.clientId && { client_id: parseInt(invoiceData.clientId) }),
        ...(invoiceData.projectId && { project_id: parseInt(invoiceData.projectId) })
      }]
    };

    const response = await apperClient.updateRecord('app_invoice', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to update invoice:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to update invoice');
      }
      
      return response.results[0].data;
    }
  } catch (error) {
    console.error("Error updating invoice:", error);
    throw error;
  }
};

export const markInvoiceAsSent = async (id) => {
  return updateInvoice(id, { status: 'sent' });
};

export const markInvoiceAsPaid = async (id, paymentDate) => {
  if (!paymentDate) {
    throw new Error("Payment date is required");
  }
  
  return updateInvoice(id, { 
    status: 'paid',
    payment_date: new Date(paymentDate).toISOString()
  });
};

export const deleteInvoice = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      RecordIds: [parseInt(id)]
    };

    const response = await apperClient.deleteRecord('app_invoice', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return true;
  } catch (error) {
    console.error("Error deleting invoice:", error);
    throw error;
  }
};
import { getAllClients } from './clientService';
import { getAllProjects } from './projectService';
import { getAllTasks } from './taskService';
import { getAllInvoices } from './invoiceService';

export const getDashboardData = async () => {
  try {
    // Fetch real data from all services
    const [clients, projects, tasks, invoices] = await Promise.all([
      getAllClients(),
      getAllProjects(),
      getAllTasks(),
      getAllInvoices()
    ]);

    // Calculate real statistics
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const pendingTasks = tasks.filter(t => t.status === 'todo' || t.status === 'in-progress').length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const monthlyRevenue = invoices
      .filter(i => i.status === 'paid')
      .reduce((total, invoice) => total + (invoice.amount || 0), 0);
    const overdueItems = tasks.filter(t => 
      new Date(t.due_date) < new Date() && t.status !== 'done'
    ).length;

    // Mock recent activity (you could enhance this with real activity tracking)
    const recentActivity = [
      {
        id: 1,
        type: "project",
        title: "Project status updated",
        client: projects[0]?.Name || "Unknown Client",
        time: "2 hours ago",
        icon: "CheckCircle2"
      },
      {
        id: 2,
        type: "task",
        title: "New task created",
        client: "System",
        time: "4 hours ago",
        icon: "Plus"
      },
      {
        id: 3,
        type: "invoice",
        title: "Invoice generated",
        client: "Client Portal",
        time: "6 hours ago",
        icon: "FileText"
      },
      {
        id: 4,
        type: "client",
        title: "New client added",
        client: clients[clients.length - 1]?.Name || "Recent Client",
        time: "1 day ago",
        icon: "UserPlus"
      },
      {
        id: 5,
        type: "payment",
        title: "Payment received",
        client: "Payment Gateway",
        time: "2 days ago",
        icon: "DollarSign"
      }
    ];

    return {
      summary: {
        totalClients: clients.length,
        activeProjects: activeProjects,
        pendingTasks: pendingTasks,
        monthlyRevenue: Math.round(monthlyRevenue),
        completedTasks: completedTasks,
        overdueItems: overdueItems
      },
      recentActivity: recentActivity,
      quickStats: {
        projectsThisWeek: activeProjects,
        tasksCompleted: completedTasks,
        hoursTracked: tasks.reduce((total, task) => 
          total + (task.timeTracking?.totalTime || 0), 0
        ) / (1000 * 60 * 60), // Convert milliseconds to hours
        invoicesSent: invoices.filter(i => i.status === 'sent').length
      }
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import StatCard from "@/components/molecules/StatCard";
import { getDashboardData } from "@/services/api/dashboardService";

const DashboardStats = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
      toast.error("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !dashboardData) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="animate-pulse bg-gray-200 dark:bg-gray-700 h-32 rounded-lg" />
        ))}
      </div>
    );
  }

  const { summary } = dashboardData;

  const stats = [
    {
      title: "Total Clients",
      value: summary.totalClients.toString(),
      change: `${summary.totalClients} total`,
      changeType: "positive",
      icon: "Users",
      delay: 0
    },
    {
      title: "Active Projects",
      value: summary.activeProjects.toString(),
      change: "currently active",
      changeType: "positive",
      icon: "FolderOpen",
      delay: 0.1
    },
    {
      title: "Pending Tasks",
      value: summary.pendingTasks.toString(),
      change: "need attention",
      changeType: summary.pendingTasks > 0 ? "neutral" : "positive",
      icon: "CheckSquare",
      delay: 0.2
    },
    {
      title: "Monthly Revenue",
      value: `$${summary.monthlyRevenue.toLocaleString()}`,
      change: "total earned",
      changeType: "positive",
      icon: "DollarSign",
      delay: 0.3
    },
    {
      title: "Completed Tasks",
      value: summary.completedTasks.toString(),
      change: "finished",
      changeType: "positive",
      icon: "CheckCircle2",
      delay: 0.4
    },
    {
      title: "Overdue Items",
      value: summary.overdueItems.toString(),
      change: summary.overdueItems > 0 ? "need attention" : "all current",
      changeType: summary.overdueItems > 0 ? "negative" : "positive",
      icon: "AlertTriangle",
      delay: 0.5
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          changeType={stat.changeType}
          icon={stat.icon}
          gradient={index % 2 === 0}
          delay={stat.delay}
        />
      ))}
    </div>
  );
};

export default DashboardStats;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, LineChart, Line
} from 'recharts';

// Design System
import Card from '../design-system/Card.jsx';
import Typography from '../design-system/Typography.jsx';
import Button from '../design-system/Button.jsx';
import Icons from '../design-system/Icons.jsx';
import Avatar from '../design-system/Avatar.jsx';
import Badge from '../design-system/Badge.jsx';
import PageLayout from '../layouts/PageLayout.jsx';

// APIs
import { getDashboardStatsApi, getDashboardAnalyticsApi } from '../api/analytics.api.js';
import { getLeavesApi, updateLeaveStatusApi } from '../api/leave.api.js';
import { getDocumentsApi } from '../api/document.api.js';
import { ROUTES } from '../constants/routes.js';
import { useUI } from '../context/UIContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

// Animated Counter Component for Premium SaaS look
const AnimatedNumber = ({ value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10);
    if (isNaN(end) || end === 0) {
      setCount(value);
      return;
    }
    const duration = 1000; // ms
    const incrementTime = Math.max(Math.floor(duration / end), 15);

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}</span>;
};

export const Dashboard = () => {
  const queryClient = useQueryClient();
  const { showToast } = useUI();
  const { user } = useAuth();
  const isEmployee = user?.role === 'Employee';
  const [quickNote, setQuickNote] = useState(() => localStorage.getItem('ws_quick_note') || '');

  // Keep quick notes synchronized in localStorage
  useEffect(() => {
    localStorage.setItem('ws_quick_note', quickNote);
  }, [quickNote]);

  // 1. Fetch dashboard counters
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => getDashboardStatsApi()
  });

  // 2. Fetch dashboard charts and listings
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ['dashboard-analytics'],
    queryFn: () => getDashboardAnalyticsApi()
  });

  // 3. Fetch leaves (for Pending Approvals widget)
  const { data: leavesData } = useQuery({
    queryKey: ['pending-leaves'],
    queryFn: () => getLeavesApi({ status: 'Pending' })
  });

  // 4. Fetch recent documents
  const { data: docsData } = useQuery({
    queryKey: ['recent-documents'],
    queryFn: () => getDocumentsApi()
  });

  // 5. Update Leave mutation (for quick approvals in approvals widget)
  const updateLeaveMutation = useMutation({
    mutationFn: ({ id, status }) => updateLeaveStatusApi({ id, status, approvedBy: user?._id }), // Use current user ID
    onSuccess: (data) => {
      showToast(data.message, 'success');
      queryClient.invalidateQueries({ queryKey: ['pending-leaves'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-analytics'] });
    }
  });

  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return 'Good Morning';
    if (hrs < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const stats = statsData?.stats || { employees: 0, activeProjects: 0, openTasks: 0, completedTasks: 0, pendingLeaves: 0, teams: 0 };
  const analytics = analyticsData?.analytics || {
    projectProgress: [],
    taskDistribution: [],
    taskPriority: [],
    departmentDistribution: [],
    weeklyActivity: [],
    upcomingDeadlines: [],
    recentActivities: []
  };

  const pendingApprovals = leavesData?.leaves || [];
  const recentDocuments = docsData?.documents?.slice(0, 4) || [];

  const statCards = [
    { title: 'Employees', value: stats.employees, icon: <Icons.User size={18} className="text-ws-primary" />, gradient: 'linear-gradient(135deg, rgba(43, 174, 155, 0.15) 0%, rgba(14, 165, 233, 0.04) 100%)' },
    { title: 'Active Projects', value: stats.activeProjects, icon: <Icons.Projects size={18} className="text-ws-secondary" />, gradient: 'linear-gradient(135deg, rgba(167, 139, 250, 0.15) 0%, rgba(124, 58, 237, 0.04) 100%)' },
    { title: 'Open Tasks', value: stats.openTasks, icon: <Icons.Tasks size={18} className="text-ws-accent-dark" />, gradient: 'linear-gradient(135deg, rgba(246, 183, 60, 0.18) 0%, rgba(217, 119, 6, 0.04) 100%)' },
    { title: 'Completed Tasks', value: stats.completedTasks, icon: <Icons.Check size={18} className="text-ws-success" />, gradient: 'linear-gradient(135deg, rgba(88, 194, 125, 0.15) 0%, rgba(21, 128, 61, 0.04) 100%)' },
    { title: 'Pending Leaves', value: stats.pendingLeaves, icon: <Icons.Leaves size={18} className="text-ws-danger" />, gradient: 'linear-gradient(135deg, rgba(245, 108, 126, 0.15) 0%, rgba(185, 28, 28, 0.04) 100%)' },
    { title: 'Total Teams', value: stats.teams, icon: <Icons.Teams size={18} className="text-ws-primary" />, gradient: 'linear-gradient(135deg, rgba(43, 174, 155, 0.15) 0%, rgba(14, 165, 233, 0.04) 100%)' }
  ];

  // Colors for task distribution pie chart
  const PIE_COLORS = ['#A78BFA', '#2BAE9B', '#F6B73C', '#58C27D'];

  const loading = statsLoading || analyticsLoading;

  return (
    <PageLayout
      title={`${getGreeting()}, ${user?.name || 'User'}`}
      description={isEmployee ? "Here is an overview of your secure workspace." : "Here is what is happening across your digital workplace today."}
      loading={loading}
    >
      {/* 1. Statistics Cards Row */}
      {!isEmployee && (
      <div className="row g-4 mb-4">
        {statCards.map((card) => (
          <div key={card.title} className="col-6 col-md-4 col-lg-2">
            <Card hoverable className="h-100 p-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted fs-8 fw-semibold">{card.title}</span>
                <div 
                  className="rounded-circle p-2 d-flex align-items-center justify-content-center" 
                  style={{ background: card.gradient, width: '36px', height: '36px' }}
                >
                  {card.icon}
                </div>
              </div>
              <h3 className="font-heading fw-bold fs-3 text-dark mb-0">
                <AnimatedNumber value={card.value} />
              </h3>
            </Card>
          </div>
        ))}
      </div>
      )}

      {/* 2. Charts & Main Analytics */}
      {!isEmployee && (
      <div className="row g-4 mb-4">
        {/* Project Progress (Horizontal Bar Chart) */}
        <div className="col-12 col-lg-8">
          <Card className="h-100">
            <Typography variant="h3" className="mb-4">Project Progress</Typography>
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer>
                <BarChart
                  layout="vertical"
                  data={analytics.projectProgress}
                  margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="progressGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="var(--ws-primary)" />
                      <stop offset="100%" stopColor="#0EA5E9" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={true} vertical={false} />
                  <XAxis type="number" stroke="#94a3b8" fontSize={11} axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={100} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ background: '#fff', border: '1px solid #E7ECEF', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} 
                    cursor={{ fill: 'rgba(43, 174, 155, 0.03)' }} 
                  />
                  <Bar dataKey="progress" fill="url(#progressGrad)" radius={[0, 6, 6, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Task Distribution (Pie Chart) */}
        <div className="col-12 col-lg-4">
          <Card className="h-100">
            <Typography variant="h3" className="mb-4">Task Distribution</Typography>
            <div style={{ width: '100%', height: '240px' }} className="d-flex align-items-center justify-content-center">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={analytics.taskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {analytics.taskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: '#fff', border: '1px solid #E7ECEF', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="d-flex flex-wrap justify-content-center gap-3 mt-2">
              {analytics.taskDistribution.map((item, index) => (
                <div key={item.name} className="d-flex align-items-center gap-1.5 fs-8">
                  <div style={{ width: '10px', height: '10px', backgroundColor: PIE_COLORS[index % PIE_COLORS.length], borderRadius: '2px' }}></div>
                  <span className="text-muted">{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
      )}

      {!isEmployee && (
      <div className="row g-4 mb-4">
        {/* Weekly Activity Line Graph */}
        <div className="col-12 col-lg-6">
          <Card className="h-100">
            <Typography variant="h3" className="mb-4">Weekly Log Actions</Typography>
            <div style={{ width: '100%', height: '260px' }}>
              <ResponsiveContainer>
                <LineChart data={analytics.weeklyActivity} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--ws-primary)" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="var(--ws-primary)" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} axisLine={false} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ background: '#fff', border: '1px solid #E7ECEF', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="activities" 
                    stroke="var(--ws-primary)" 
                    strokeWidth={3} 
                    dot={{ r: 4, stroke: 'var(--ws-primary)', strokeWidth: 2, fill: '#fff' }} 
                    activeDot={{ r: 6, stroke: 'var(--ws-primary)', strokeWidth: 2, fill: '#fff' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Department staffing Vertical Bar Chart */}
        <div className="col-12 col-lg-6">
          <Card className="h-100">
            <Typography variant="h3" className="mb-4">Staffing by Department</Typography>
            <div style={{ width: '100%', height: '260px' }}>
              <ResponsiveContainer>
                <BarChart data={analytics.departmentDistribution} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="staffGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--ws-secondary)" />
                      <stop offset="100%" stopColor="#7C3AED" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} axisLine={false} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ background: '#fff', border: '1px solid #E7ECEF', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} 
                  />
                  <Bar dataKey="value" fill="url(#staffGrad)" radius={[4, 4, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
      )}

      {/* 3. Executive Widgets Section */}
      <div className="row g-4">
        {/* Left Side: Pending Approvals & Upcoming Deadlines */}
        <div className="col-12 col-lg-8 d-flex flex-column gap-4">
          {/* Pending Approvals (Vacations / Leaves) */}
          {!isEmployee && (
          <Card>
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
              <Typography variant="h3" className="mb-0">Pending Approvals</Typography>
              <Link to={ROUTES.LEAVES} className="fs-8 fw-semibold text-ws-primary text-decoration-none">Manage Leaves</Link>
            </div>
            
            {pendingApprovals.length === 0 ? (
              <div className="text-center py-4 text-muted fs-8">No pending leave requests.</div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {pendingApprovals.map((req) => (
                  <div key={req._id} className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-light">
                    <div className="d-flex align-items-center gap-3">
                      <Avatar src={req.employee?.avatar} name={req.employee?.name} size="sm" />
                      <div>
                        <div className="fw-semibold text-dark fs-7">{req.employee?.name || 'Employee'}</div>
                        <div className="text-muted fs-8">
                          {req.type} Leave ({new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()})
                        </div>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => updateLeaveMutation.mutate({ id: req._id, status: 'Approved' })}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => updateLeaveMutation.mutate({ id: req._id, status: 'Rejected' })}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
          )}

          {/* Upcoming Deadlines */}
          <Card>
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
              <Typography variant="h3" className="mb-0">Upcoming Deadlines</Typography>
              <Link to={ROUTES.KANBAN} className="fs-8 fw-semibold text-ws-primary text-decoration-none">View Kanban</Link>
            </div>
            {analytics.upcomingDeadlines.length === 0 ? (
              <div className="text-center py-4 text-muted fs-8">No upcoming task deadlines.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-borderless align-middle mb-0 fs-7">
                  <tbody>
                    {analytics.upcomingDeadlines.map((task) => (
                      <tr key={task._id} className="border-bottom border-light">
                        <td>
                          <div className="fw-semibold text-dark">{task.title}</div>
                          <span className="text-muted fs-8">{task.project?.name}</span>
                        </td>
                        <td>
                          <Badge variant={task.priority === 'Urgent' || task.priority === 'High' ? 'danger' : 'secondary'}>
                            {task.priority}
                          </Badge>
                        </td>
                        <td className="text-muted">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </td>
                        <td>
                          <Avatar src={task.assignee?.avatar} name={task.assignee?.name} size="xs" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        {/* Right Side: Quick Notes, Birthdays, Meetings & Documents */}
        <div className="col-12 col-lg-4 d-flex flex-column gap-4">
          {/* Quick Notes */}
          <Card>
            <Typography variant="h3" className="mb-3">Quick Notepad</Typography>
            <textarea
              className="form-control bg-light rounded-3 p-3 fs-7 border-0"
              placeholder="Jot down notes or scratch ideas here. Saved in local storage."
              rows={5}
              value={quickNote}
              onChange={(e) => setQuickNote(e.target.value)}
              style={{ resize: 'none' }}
            />
          </Card>

          {/* Company Meetings (Placeholder) */}
          <Card>
            <Typography variant="h3" className="mb-3">Today's Meetings</Typography>
            <div className="d-flex flex-column gap-2.5">
              <div className="p-2.5 rounded-3 bg-light border-start border-3 border-ws-primary">
                <div className="fw-semibold text-dark fs-7">Sprint Planning Session</div>
                <div className="text-muted fs-8">10:00 AM - 11:00 AM | Google Meet</div>
              </div>
              <div className="p-2.5 rounded-3 bg-light border-start border-3 border-ws-secondary">
                <div className="fw-semibold text-dark fs-7">Aurora Design Sync</div>
                <div className="text-muted fs-8">02:00 PM - 02:30 PM | Design Room</div>
              </div>
            </div>
          </Card>

          {/* Recent Documents */}
          <Card>
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
              <Typography variant="h3" className="mb-0">Recent Materials</Typography>
              <Link to={ROUTES.DOCUMENTS} className="fs-8 fw-semibold text-ws-primary text-decoration-none">All Docs</Link>
            </div>
            {recentDocuments.length === 0 ? (
              <div className="text-center py-3 text-muted fs-8">No documents uploaded.</div>
            ) : (
              <div className="d-flex flex-column gap-2">
                {recentDocuments.map((doc) => (
                  <a
                    href={doc.fileUrl}
                    key={doc._id}
                    target="_blank"
                    rel="noreferrer"
                    className="text-decoration-none d-flex align-items-center justify-content-between p-2 rounded-2 hover-bg-light transition-all"
                  >
                    <div className="d-flex align-items-center gap-2 overflow-hidden">
                      <Icons.Documents className="text-ws-primary flex-shrink-0" size={16} />
                      <span className="text-dark fs-7 text-truncate fw-medium">{doc.name}</span>
                    </div>
                    <Icons.Download className="text-muted flex-shrink-0" size={14} />
                  </a>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;

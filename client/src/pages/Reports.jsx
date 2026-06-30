import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, AreaChart, Area
} from 'recharts';

// Design System
import Card from '../design-system/Card.jsx';
import Typography from '../design-system/Typography.jsx';
import Badge from '../design-system/Badge.jsx';
import PageLayout from '../layouts/PageLayout.jsx';

// APIs
import { getDashboardAnalyticsApi } from '../api/analytics.api.js';

export const Reports = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['report-analytics'],
    queryFn: () => getDashboardAnalyticsApi()
  });

  const analytics = data?.analytics || {
    projectProgress: [],
    taskDistribution: [],
    taskPriority: [],
    departmentDistribution: [],
    weeklyActivity: [],
    upcomingDeadlines: []
  };

  const COLORS = ['#2BAE9B', '#A78BFA', '#F6B73C', '#58C27D', '#F56C7E', '#0EA5E9'];

  return (
    <PageLayout
      title="Reports & Analytics"
      description="Access comprehensive performance logs, departmental staff metrics, and task analytics."
      loading={isLoading}
    >
      {/* 1. Summary Cards */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-md-4">
          <Card className="border border-light">
            <Typography variant="body2" className="text-muted fw-semibold">Task Resolution Rate</Typography>
            <h3 className="fw-bold fs-2 text-ws-primary mt-2 mb-1">84.2%</h3>
            <span className="text-success fs-8 fw-semibold">↑ 3.8% from last week</span>
          </Card>
        </div>
        <div className="col-12 col-md-4">
          <Card className="border border-light">
            <Typography variant="body2" className="text-muted fw-semibold">Project Schedule Variance</Typography>
            <h3 className="fw-bold fs-2 text-ws-secondary mt-2 mb-1">-2.4 Days</h3>
            <span className="text-success fs-8 fw-semibold">↓ Delays reduced</span>
          </Card>
        </div>
        <div className="col-12 col-md-4">
          <Card className="border border-light">
            <Typography variant="body2" className="text-muted fw-semibold">Workforce Utilization</Typography>
            <h3 className="fw-bold fs-2 text-ws-accent-dark mt-2 mb-1">91.8%</h3>
            <span className="text-muted fs-8">Average team operational rate</span>
          </Card>
        </div>
      </div>

      {/* 2. Visualizations */}
      <div className="row g-4 mb-4">
        {/* Weekly Load Analysis */}
        <div className="col-12 col-lg-8">
          <Card className="h-100">
            <Typography variant="h3" className="mb-4">System Operational Activity (Weekly Trend)</Typography>
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer>
                <AreaChart data={analytics.weeklyActivity} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorActivities" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--ws-primary)" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="var(--ws-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip />
                  <Area type="monotone" dataKey="activities" stroke="var(--ws-primary)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorActivities)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Priority breakdown pie */}
        <div className="col-12 col-lg-4">
          <Card className="h-100">
            <Typography variant="h3" className="mb-4">Tasks by Priority</Typography>
            <div style={{ width: '100%', height: '240px' }} className="d-flex align-items-center justify-content-center">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={analytics.taskPriority}
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={80}
                    paddingAngle={0}
                    dataKey="value"
                  >
                    {analytics.taskPriority.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="d-flex flex-wrap justify-content-center gap-3 mt-2">
              {analytics.taskPriority.map((item, index) => (
                <div key={item.name} className="d-flex align-items-center gap-1.5 fs-8">
                  <div style={{ width: '10px', height: '10px', backgroundColor: COLORS[index % COLORS.length], borderRadius: '2px' }}></div>
                  <span className="text-muted">{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div className="row g-4">
        {/* Project progress bars */}
        <div className="col-12">
          <Card>
            <Typography variant="h3" className="mb-4">Project Milestones Achievements</Typography>
            <div className="table-responsive">
              <table className="table table-borderless align-middle mb-0 fs-7">
                <thead>
                  <tr className="border-bottom border-light text-muted fw-semibold">
                    <th>Project Name</th>
                    <th>Status</th>
                    <th>Milestone Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.projectProgress.map((p) => (
                    <tr key={p._id} className="border-bottom border-light">
                      <td className="fw-semibold text-dark">{p.name}</td>
                      <td>
                        <Badge variant={p.status === 'Completed' ? 'success' : 'primary'}>{p.status}</Badge>
                      </td>
                      <td style={{ width: '60%' }}>
                        <div className="d-flex align-items-center gap-3">
                          <div className="progress flex-grow-1 bg-light rounded-pill" style={{ height: '8px' }}>
                            <div
                              className="progress-bar rounded-pill bg-ws-primary"
                              role="progressbar"
                              style={{ width: `${p.progress}%` }}
                              aria-valuenow={p.progress}
                              aria-valuemin="0"
                              aria-valuemax="100"
                            />
                          </div>
                          <span className="fw-bold text-dark">{p.progress}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Reports;

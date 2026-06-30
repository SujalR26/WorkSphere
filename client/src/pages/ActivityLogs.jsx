import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

// Design System
import Card from '../design-system/Card.jsx';
import Typography from '../design-system/Typography.jsx';
import Button from '../design-system/Button.jsx';
import Badge from '../design-system/Badge.jsx';
import Icons from '../design-system/Icons.jsx';
import PageLayout from '../layouts/PageLayout.jsx';

// APIs
import { getActivityLogsApi } from '../api/activity.api.js';

export const ActivityLogs = () => {
  const [page, setPage] = useState(1);
  const [accumulatedLogs, setAccumulatedLogs] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState('');

  // 1. Query Activity Logs
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['activity-logs', { page, entity: selectedEntity }],
    queryFn: () => getActivityLogsApi({ page, limit: 15, entity: selectedEntity }),
    keepPreviousData: true
  });

  // Append new pages to accumulated logs list
  useEffect(() => {
    if (data?.logs) {
      if (page === 1) {
        setAccumulatedLogs(data.logs);
      } else {
        setAccumulatedLogs(prev => {
          // Prevent duplicates
          const existingIds = new Set(prev.map(l => l._id));
          const filteredNew = data.logs.filter(l => !existingIds.has(l._id));
          return [...prev, ...filteredNew];
        });
      }
    }
  }, [data, page]);

  // Reset list if filter entity type is changed
  const handleEntityFilterChange = (entity) => {
    setSelectedEntity(entity);
    setPage(1);
    setAccumulatedLogs([]);
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  const pagination = data?.pagination;
  const hasMore = pagination ? page < pagination.pages : false;

  const entityBadgeVariant = (ent) => {
    const map = {
      Employee: 'primary',
      Project: 'secondary',
      Task: 'warning',
      Leave: 'danger',
      Announcement: 'success',
      Document: 'info',
      Department: 'dark',
      Team: 'light'
    };
    return map[ent] || 'secondary';
  };

  return (
    <PageLayout
      title="Activity Logs"
      description="Real-time audit trailing listing operations performed across database collections."
      loading={isLoading && page === 1}
      isEmpty={accumulatedLogs.length === 0}
      emptyIllustration="default"
      emptyTitle="No Log Entries"
      emptyDescription="No database operations have been recorded yet."
    >
      <div className="d-flex flex-column gap-3.5 max-w-xl mx-auto">
        {/* Filter bar */}
        <div className="bg-white p-3 border border-light rounded-3 shadow-sm d-flex flex-wrap gap-2 justify-content-between align-items-center mb-2">
          <Typography variant="body2" className="fw-semibold text-dark">Filter by Resource Type:</Typography>
          <div className="d-flex flex-wrap gap-1.5">
            {['', 'Employee', 'Project', 'Task', 'Leave', 'Announcement', 'Document', 'Department', 'Team'].map(ent => (
              <button
                key={ent}
                type="button"
                onClick={() => handleEntityFilterChange(ent)}
                className={`btn btn-sm rounded-pill px-2.5 py-1 fs-9 border-0 ${selectedEntity === ent ? 'bg-ws-primary text-white fw-bold' : 'bg-light text-muted'}`}
              >
                {ent || 'All Resources'}
              </button>
            ))}
          </div>
        </div>

        {/* Logs Timeline */}
        <Card className="p-4 border border-light shadow-sm">
          <div className="d-flex flex-column gap-3">
            {accumulatedLogs.map((log) => (
              <div key={log._id} className="d-flex align-items-start gap-3 p-3 rounded-3 bg-light border-bottom border-light hover-bg-light transition-all">
                <div className="bg-ws-primary-light text-ws-primary rounded-circle p-2 d-flex align-items-center justify-content-center mt-1 flex-shrink-0" style={{ width: '36px', height: '36px' }}>
                  <Icons.ActivityLogs size={16} />
                </div>
                <div className="flex-grow-1 overflow-hidden">
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <div className="d-flex align-items-center gap-2">
                      <span className="fw-bold text-dark fs-7">{log.user}</span>
                      <Badge variant={entityBadgeVariant(log.entity)} className="fs-9 py-0.5 px-1.5">{log.entity}</Badge>
                      <span className="text-muted fs-8">({log.action})</span>
                    </div>
                    <span className="text-muted fs-9 flex-shrink-0">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="fs-8 text-muted mb-0 font-body">{log.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Loader or Infinite Trigger Button */}
          {hasMore && (
            <div className="text-center pt-4 mt-2 border-top">
              <Button
                variant="outline"
                size="sm"
                loading={isFetching}
                onClick={loadMore}
                icon={<Icons.ChevronRight size={14} style={{ transform: 'rotate(90deg)' }} />}
                iconPosition="right"
              >
                Load More Logs
              </Button>
            </div>
          )}
        </Card>
      </div>
    </PageLayout>
  );
};

export default ActivityLogs;

import React from 'react';
import Card from '../design-system/Card.jsx';
import Typography from '../design-system/Typography.jsx';
import Button from '../design-system/Button.jsx';
import Icons from '../design-system/Icons.jsx';

export const PageLayout = ({
  title,
  description,
  actions,
  loading = false,
  isEmpty = false,
  emptyIllustration = 'default', // employees, projects, tasks, documents, notifications, search, reports
  emptyTitle = 'No Records Found',
  emptyDescription = 'Start by adding a new record to this database.',
  emptyActionLabel,
  onEmptyAction,
  children
}) => {
  // Skeleton loader for loading state
  if (loading) {
    return (
      <div className="d-flex flex-column gap-4 animate-fadeIn">
        <div className="d-flex align-items-center justify-content-between border-bottom pb-3">
          <div>
            <div className="placeholder-shimmer rounded-3 mb-2" style={{ width: '220px', height: '28px' }}></div>
            <div className="placeholder-shimmer rounded-2" style={{ width: '380px', height: '16px' }}></div>
          </div>
          <div className="placeholder-shimmer rounded-3" style={{ width: '120px', height: '36px' }}></div>
        </div>
        <div className="row g-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="col-12 col-md-4">
              <Card>
                <div className="placeholder-shimmer rounded-2 mb-3" style={{ width: '40%', height: '14px' }}></div>
                <div className="placeholder-shimmer rounded-3 mb-3" style={{ width: '80%', height: '22px' }}></div>
                <div className="placeholder-shimmer rounded-2" style={{ width: '100%', height: '60px' }}></div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Render Illustrated Empty State
  if (isEmpty) {
    const iconsMap = {
      employees: <Icons.User size={44} className="text-ws-primary" />,
      projects: <Icons.Projects size={44} className="text-ws-secondary" />,
      tasks: <Icons.Tasks size={44} className="text-ws-accent" />,
      documents: <Icons.Documents size={44} className="text-ws-primary" />,
      notifications: <Icons.Bell size={44} className="text-ws-accent" />,
      search: <Icons.Search size={44} className="text-muted" />,
      reports: <Icons.Reports size={44} className="text-ws-success" />,
      default: <Icons.Alert size={44} className="text-muted" />
    };

    const gradientMap = {
      employees: 'linear-gradient(135deg, rgba(43, 174, 155, 0.12) 0%, rgba(14, 165, 233, 0.03) 100%)',
      projects: 'linear-gradient(135deg, rgba(167, 139, 250, 0.12) 0%, rgba(124, 58, 237, 0.03) 100%)',
      tasks: 'linear-gradient(135deg, rgba(246, 183, 60, 0.15) 0%, rgba(217, 119, 6, 0.03) 100%)',
      documents: 'linear-gradient(135deg, rgba(43, 174, 155, 0.12) 0%, rgba(14, 165, 233, 0.03) 100%)',
      notifications: 'linear-gradient(135deg, rgba(246, 183, 60, 0.12) 0%, rgba(217, 119, 6, 0.03) 100%)',
      reports: 'linear-gradient(135deg, rgba(88, 194, 125, 0.12) 0%, rgba(21, 128, 61, 0.03) 100%)',
      default: 'linear-gradient(135deg, rgba(100, 116, 139, 0.12) 0%, rgba(148, 163, 184, 0.03) 100%)'
    };

    return (
      <div className="d-flex flex-column gap-4 h-100">
        <div className="d-flex align-items-center justify-content-between border-bottom pb-3">
          <div>
            <Typography variant="h2">{title}</Typography>
            {description && <Typography variant="body1">{description}</Typography>}
          </div>
          {actions && <div className="d-flex gap-2">{actions}</div>}
        </div>
        
        <div className="flex-grow-1 d-flex align-items-center justify-content-center py-5">
          <Card className="max-w-md text-center d-flex flex-column align-items-center p-5 bg-white border-0 shadow-sm" style={{ border: '1px solid var(--ws-border) !important' }}>
            <div 
              className="rounded-circle mb-4 d-flex align-items-center justify-content-center" 
              style={{ 
                width: '88px', 
                height: '88px',
                background: gradientMap[emptyIllustration] || gradientMap.default
              }}
            >
              {iconsMap[emptyIllustration] || iconsMap.default}
            </div>
            <Typography variant="h3" className="mb-2 fw-bold text-dark">{emptyTitle}</Typography>
            <Typography variant="body2" className="mb-4 text-muted">{emptyDescription}</Typography>
            {emptyActionLabel && onEmptyAction && (
              <Button onClick={onEmptyAction} icon={<Icons.Plus size={16} />} className="shadow-sm">
                {emptyActionLabel}
              </Button>
            )}
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-4 animate-fadeIn">
      <div className="d-flex align-items-center justify-content-between border-bottom pb-3">
        <div>
          <Typography variant="h2">{title}</Typography>
          {description && <Typography variant="body1">{description}</Typography>}
        </div>
        {actions && <div className="d-flex gap-2">{actions}</div>}
      </div>
      
      <div className="page-content-wrapper">
        {children}
      </div>
    </div>
  );
};

export default PageLayout;

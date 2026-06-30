import React from 'react';
import Card from '../design-system/Card.jsx';
import Typography from '../design-system/Typography.jsx';
import Button from '../design-system/Button.jsx';
import Icons from '../design-system/Icons.jsx';

export const TableLayout = ({
  headers = [], // String array or object array [{ key, label }]
  loading = false,
  isEmpty = false,
  emptyIllustration = 'default',
  emptyTitle = 'No Results Found',
  emptyDescription = 'There are no rows matching your filters or search.',
  emptyActionLabel,
  onEmptyAction,
  pagination, // { total, page, limit, pages }
  onPageChange,
  filters,
  children
}) => {
  // Skeleton loader for loading state
  if (loading) {
    return (
      <Card className="border border-light p-0 overflow-hidden">
        {filters && <div className="p-3 border-bottom border-light">{filters}</div>}
        <div className="table-responsive">
          <table className="table table-borderless align-middle mb-0">
            <thead>
              <tr className="border-bottom border-light text-uppercase fs-8 text-muted fw-bold bg-light">
                {headers.map((h, i) => (
                  <th key={i}>{typeof h === 'string' ? h : h.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((n) => (
                <tr key={n} className="border-bottom border-light">
                  {headers.map((h, i) => (
                    <td key={i}>
                      <div className="placeholder-shimmer rounded-2" style={{ width: '85%', height: '16px' }}></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    );
  }

  // Illustrated empty state for empty records
  if (isEmpty) {
    const iconsMap = {
      employees: <Icons.User size={36} className="text-ws-primary" />,
      projects: <Icons.Projects size={36} className="text-ws-secondary" />,
      tasks: <Icons.Tasks size={36} className="text-ws-accent" />,
      documents: <Icons.Documents size={36} className="text-ws-primary" />,
      default: <Icons.Alert size={36} className="text-muted" />
    };

    const gradientMap = {
      employees: 'linear-gradient(135deg, rgba(43, 174, 155, 0.12) 0%, rgba(14, 165, 233, 0.03) 100%)',
      projects: 'linear-gradient(135deg, rgba(167, 139, 250, 0.12) 0%, rgba(124, 58, 237, 0.03) 100%)',
      tasks: 'linear-gradient(135deg, rgba(246, 183, 60, 0.15) 0%, rgba(217, 119, 6, 0.03) 100%)',
      documents: 'linear-gradient(135deg, rgba(43, 174, 155, 0.12) 0%, rgba(14, 165, 233, 0.03) 100%)',
      default: 'linear-gradient(135deg, rgba(100, 116, 139, 0.12) 0%, rgba(148, 163, 184, 0.03) 100%)'
    };

    return (
      <Card className="border border-light p-0 overflow-hidden">
        {filters && <div className="p-3 border-bottom border-light">{filters}</div>}
        
        <div className="text-center d-flex flex-column align-items-center py-5 px-4 my-3">
          <div 
            className="rounded-circle p-3.5 mb-3.5 d-flex align-items-center justify-content-center" 
            style={{ 
              width: '68px', 
              height: '68px',
              background: gradientMap[emptyIllustration] || gradientMap.default
            }}
          >
            {iconsMap[emptyIllustration] || iconsMap.default}
          </div>
          <Typography variant="h4" className="mb-1 fw-bold text-dark">{emptyTitle}</Typography>
          <Typography variant="body2" className="mb-3 max-w-sm text-muted">{emptyDescription}</Typography>
          {emptyActionLabel && onEmptyAction && (
            <Button size="sm" onClick={onEmptyAction} icon={<Icons.Plus size={14} />} className="shadow-sm">
              {emptyActionLabel}
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="border border-light p-0 overflow-hidden shadow-sm animate-fadeIn">
      {/* Search / Filters Row */}
      {filters && <div className="p-3 bg-white border-bottom border-light">{filters}</div>}
      
      {/* Data Table */}
      <div className="table-responsive table-responsive-container">
        <table className="table align-middle mb-0">
          <thead>
            <tr className="table-sticky-header text-uppercase fs-8 text-muted fw-bold border-bottom border-light">
              {headers.map((h, i) => (
                <th key={i}>{typeof h === 'string' ? h : h.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {children}
          </tbody>
        </table>
      </div>

      {/* Pagination Row */}
      {pagination && pagination.pages > 1 && (
        <div className="p-3.5 bg-white border-top border-light d-flex align-items-center justify-content-between">
          <Typography variant="body2" className="text-muted">
            Showing Page <span className="fw-semibold text-dark">{pagination.page}</span> of <span className="fw-semibold text-dark">{pagination.pages}</span> (Total {pagination.total} records)
          </Typography>
          <div className="d-flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={pagination.page <= 1}
              onClick={() => onPageChange(pagination.page - 1)}
              icon={<Icons.ChevronRight size={14} style={{ transform: 'rotate(180deg)' }} />}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={pagination.page >= pagination.pages}
              onClick={() => onPageChange(pagination.page + 1)}
              icon={<Icons.ChevronRight size={14} />}
              iconPosition="right"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default TableLayout;

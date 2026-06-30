export const transformTaskStatusData = (data) => {
  if (!data) return [];
  const statusColors = {
    Todo: '#A78BFA',       // Secondary
    'In Progress': '#2BAE9B', // Primary
    Review: '#F6B73C',    // Accent
    Done: '#58C27D'       // Success
  };
  
  return data.map(item => ({
    ...item,
    color: statusColors[item.name] || '#6c757d'
  }));
};

export const transformProjectProgressData = (data) => {
  if (!data) return [];
  return data.map(item => ({
    name: item.name.length > 15 ? `${item.name.substring(0, 15)}...` : item.name,
    fullName: item.name,
    Progress: item.progress,
    status: item.status
  }));
};

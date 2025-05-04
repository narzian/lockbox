
// Sort functions for the dashboard
export const sortByName = (a: any, b: any, ascending = true) => {
  const factor = ascending ? 1 : -1;
  return a.title.localeCompare(b.title) * factor;
};

export const sortByRecent = (a: any, b: any, ascending = true) => {
  const timeMap: Record<string, number> = {
    "day": 1,
    "days": 1,
    "week": 7,
    "weeks": 7,
    "month": 30,
    "months": 30
  };
  
  const extractTime = (timeStr: string) => {
    const [num, unit] = timeStr.split(' ');
    return parseInt(num) * (timeMap[unit] || 1);
  };
  
  const timeA = extractTime(a.lastUsed);
  const timeB = extractTime(b.lastUsed);
  
  const factor = ascending ? 1 : -1;
  return (timeA - timeB) * factor;
};

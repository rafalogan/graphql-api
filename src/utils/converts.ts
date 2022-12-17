export const stringify = (...data: any[]) => data.map(item => item.toString() || JSON.stringify(item)).join(' ');

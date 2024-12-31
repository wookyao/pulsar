


// 前端分页
export function pagination(page: number, pageSize: number, total: number) {
  return {
    page,
    pageSize,
    total,
    totalPage: Math.ceil(total / pageSize),
  };
}

// 分页加载数据
export function loadPageData<T>(data: T[], page: number, pageSize: number) {
  return data.slice((page - 1) * pageSize, page * pageSize);
}





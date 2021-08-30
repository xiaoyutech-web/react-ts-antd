import network from "./network";

// 登录
export function loginUser(basic) {
  return network({
    url: `/login`,
    method: "get",
    headers: { Authorization: "Basic "+basic },
    
  });
}
//退出登录
export function logoutUser() {
  return network({
    url: `/logout`,
    method: "get",
  });
}
// 注册
export function registerUser(data) {
  return network({
    url: `/register`,
    method: "post",
    data,
  });
}

// 密码重置
export function resetPwd(data) {
  return network({
    url: `/resetPwd`,
    method: "post",
    data,
  });
}
//查询团队列表
export function queryTeamList(params) {
  return network({
    url: `/team/list`,
    method: "get",
    params,
  });
}
//查询产品/模块列表
export function queryProductList(params) {
  return network({
    url: `/product/list`,
    method: "get",
    params,
  });
}

//提交评分
export function submitProductScore(data) {
  return network({
    url: `product/score/add`,
    method: "post",
    data,
  });
}

//按分数排序获取产品列表
export function queryProductScoreList(data) {
  return network({
    url: `product/score/list`,
    method: "post",
    data,
  });
}

//更新产品分数
export function updateProductScore(data) {
  return network({
    url: `product/score/update `,
    method: "post",
    data,
  });
}
















// 任务列表
export function queryTaskList(params) {
  return network({
    url: `/queryTaskList`,
    method: "get",
    params,
  });
}

// 添加任务
export function addTask(data) {
  return network({
    url: `/addTask`,
    method: "post",
    data,
  });
}

// 编辑任务
export function editTask(data) {
  return network({
    url: `/editTask`,
    method: "put",
    data,
  });
}

// 操作任务状态
export function updateTaskStatus(data) {
  return network({
    url: `/updateTaskStatus`,
    method: "put",
    data,
  });
}

// 点亮红星标记
export function updateMark(data) {
  return network({
    url: `/updateMark`,
    method: "put",
    data,
  });
}

// 删除任务
export function deleteTask(data) {
  return network({
    url: `/deleteTask`,
    method: "delete",
    data,
  });
}

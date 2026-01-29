import http from '../common/http.js'
//注册
export const registerApi = (parm)=>{
	return http.post("/wxapi/allApi/add",parm)
}
//登录
export const loginApi = (parm)=>{
	return http.post("/wxapi/allApi/login",parm)
}
//小程序首页轮播图
export const getIndexNewsApi = ()=>{
	return http.get("/wxapi/allApi/getIndexNews")
}
//小程序首页科室
export const getIndexDeptApi = ()=>{
	return http.get("/wxapi/allApi/getIndexDept")
}
//小程序首页专家
export const getIndexDoctorApi = ()=>{
	return http.get("/wxapi/allApi/getIndexDoctor")
}
//医生详情挂号列表
export const getDoctorApi = (parm)=>{
	return http.get("/wxapi/allApi/getDoctor",parm)
}
//新增就诊人
export const visitAddApi = (parm)=>{
	return http.post("/wxapi/allApi/visitAdd",parm)
}
//编辑就诊人
export const visitEditApi = (parm)=>{
	return http.put("/wxapi/allApi/visitEdit",parm)
}
//删除就诊人
export const visitDeleteApi = (parm)=>{
	return http.post("/wxapi/allApi/visitDelete",parm)
}
//就诊人列表
export const getVisitListApi = (parm)=>{
	return http.get("/wxapi/allApi/getVisitList",parm)
}
//就诊人下拉列表
export const getSelectVisitListApi = (parm)=>{
	return http.get("/wxapi/allApi/getSelectVisitList",parm)
}
//挂号
export const makeOrderAddApi = (parm)=>{
	return http.post("/wxapi/allApi/makeOrderAdd",parm)
}
//挂号列表
export const getOrderListApi = (parm)=>{
    return http.get("/wxapi/allApi/getOrderList",parm)
}
export const checkInApi = (parm)=>{
    return http.post("/wxapi/allApi/checkIn",parm)
}
export const reapplyApi = (parm)=>{
    return http.post("/wxapi/allApi/reapply",parm)
}
//取消挂号
export const cancelOrderApi = (parm)=>{
	return http.post("/wxapi/allApi/cancelOrder",parm)
}
//科室查询医生列表
export const getDoctorByDeptIdApi = (parm)=>{
	return http.get("/wxapi/allApi/getDoctorByDeptId",parm)
}
//资讯列表
export const getNewsListApi = (parm)=>{
	return http.get("/wxapi/allApi/getNewsList",parm)
}
//底部挂号列表
export const getCategoryListApi = ()=>{
	return http.get("/wxapi/allApi/getCategoryList")
}
//根据id查询个人信息
export const getWxUserByIdApi = (parm)=>{
	return http.get("/wxapi/allApi/getWxUserById",parm)
}
//更新个人信息
export const updateUserInfoApi = (parm)=>{
	return http.post("/wxapi/allApi/updateUserInfo",parm)
}
//修改密码
export const updatePasswordApi = (parm)=>{
	return http.post("/wxapi/allApi/updatePassword",parm)
}
//反馈
export const addSuggestApi = (parm)=>{
	return http.post("/wxapi/allApi/addSuggest",parm)
}
//就诊列表
export const getVisitOrderListApi = (parm)=>{
	return http.get("/wxapi/allApi/getVisitOrderList",parm)
}
//提交个人信息
export const submitAuthApi = (parm) => {
	return http.post("/wxapi/allApi/submitAuth",parm)
}
//上传照片
export const uploadPhoto = (filePath) => {
	const uploadParams = {
		url: '/wxapi/allApi/uploadPhoto',
		filePath: filePath
	};
	return http.upload(uploadParams)
}
//改签
export const rescheduleOrderApi = (parm) => {
	return http.post("/wxapi/allApi/rescheduleOrder",parm);
}

//自主提问
export const getAiMessages = (question) => {
  return http.post("/api/LLM/ask", question, {
    header: {
      "Content-Type": "application/json"
    }
  });
}
//获取常见问题
export const getCorpus = () => {
	return http.get("/api/LLM/getCommonQuestions",{});
}
//回答常见问题
export const commonAsk = (questionId) => {
	return http.get("/api/LLM/ask",{
		questionId
	})
}

export const joinWaitlistApi = (parm)=>{
	return http.post("/wxapi/allApi/waitlist/join",parm)
}

export const getMyWaitlistApi = (parm)=>{
	return http.get("/wxapi/allApi/waitlist/my",parm)

}
//获取可提前预约天数
export const getConfigDayNum = (parm) => {
	return http.get("/wxapi/allApi/config/scheduleQueryDays",parm);
}
//获取每天预约开始时间
export const getConfigTime = (parm) => {
	return http.get("/wxapi/allApi/config/scheduleQueryTime",parm);
}
//获取前面还有多少人
export const getQueueStatusApi = (parm) => {
	console.log(parm);
	return http.get("/wxapi/allApi/queueStatus",parm);
}
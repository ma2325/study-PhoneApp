/**
 * 复习计划 Mock 数据
 * 包含计算机组成原理和计算机网络的知识点结构
 */

// 考试信息
export const examInfo = {
	examDate: '2026-06-15', // 考试日期
	daysRemaining: 138, // 剩余天数（自动计算）
	todayStudyTarget: 90, // 今日建议学习时长（分钟）
	todayCompleted: 45 // 今日已完成（分钟）
};

// 计算剩余天数
export const calculateDaysRemaining = () => {
	const today = new Date();
	const examDate = new Date(examInfo.examDate);
	const diffTime = examDate - today;
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	return diffDays > 0 ? diffDays : 0;
};

// 课程数据结构
export const courses = [
	{
		id: 'course_01',
		name: '计算机组成原理',
		abbr: '计组',
		color: '#667eea',
		icon: 'cpu',
		totalKnowledge: 35,
		masteredKnowledge: 18,
		overallProgress: 51,
		modules: [
			{
				id: 'mod_01_01',
				name: '计算机系统概述',
				knowledgePoints: [
					{
						id: 'kp_01_01_01',
						name: '计算机发展历程',
						mastery: 85,
						errorRate: 5,
						priority: 'low',
						status: 'completed',
						lastStudyDate: '2026-01-25',
						studyCount: 3
					},
					{
						id: 'kp_01_01_02',
						name: '计算机系统层次结构',
						mastery: 70,
						errorRate: 15,
						priority: 'medium',
						status: 'in-progress',
						lastStudyDate: '2026-01-27',
						studyCount: 2
					},
					{
						id: 'kp_01_01_03',
						name: '计算机性能指标',
						mastery: 60,
						errorRate: 20,
						priority: 'medium',
						status: 'in-progress',
						lastStudyDate: '2026-01-26',
						studyCount: 2
					}
				]
			},
			{
				id: 'mod_01_02',
				name: '数据的表示和运算',
				knowledgePoints: [
					{
						id: 'kp_01_02_01',
						name: '数制与编码',
						mastery: 90,
						errorRate: 3,
						priority: 'low',
						status: 'completed',
						lastStudyDate: '2026-01-20',
						studyCount: 4
					},
					{
						id: 'kp_01_02_02',
						name: '定点数表示',
						mastery: 75,
						errorRate: 12,
						priority: 'medium',
						status: 'completed',
						lastStudyDate: '2026-01-24',
						studyCount: 3
					},
					{
						id: 'kp_01_02_03',
						name: '浮点数表示',
						mastery: 45,
						errorRate: 35,
						priority: 'high',
						status: 'in-progress',
						lastStudyDate: '2026-01-28',
						studyCount: 2
					},
					{
						id: 'kp_01_02_04',
						name: 'ALU设计',
						mastery: 30,
						errorRate: 45,
						priority: 'high',
						status: 'in-progress',
						lastStudyDate: '2026-01-27',
						studyCount: 1
					}
				]
			},
			{
				id: 'mod_01_03',
				name: '存储系统',
				knowledgePoints: [
					{
						id: 'kp_01_03_01',
						name: '存储器层次结构',
						mastery: 65,
						errorRate: 18,
						priority: 'medium',
						status: 'in-progress',
						lastStudyDate: '2026-01-26',
						studyCount: 2
					},
					{
						id: 'kp_01_03_02',
						name: '主存储器',
						mastery: 55,
						errorRate: 25,
						priority: 'medium',
						status: 'in-progress',
						lastStudyDate: '2026-01-25',
						studyCount: 2
					},
					{
						id: 'kp_01_03_03',
						name: 'Cache工作原理',
						mastery: 40,
						errorRate: 38,
						priority: 'high',
						status: 'in-progress',
						lastStudyDate: '2026-01-28',
						studyCount: 1
					},
					{
						id: 'kp_01_03_04',
						name: '虚拟存储器',
						mastery: 35,
						errorRate: 40,
						priority: 'high',
						status: 'in-progress',
						lastStudyDate: '2026-01-27',
						studyCount: 1
					}
				]
			},
			{
				id: 'mod_01_04',
				name: '指令系统',
				knowledgePoints: [
					{
						id: 'kp_01_04_01',
						name: '指令格式',
						mastery: 50,
						errorRate: 28,
						priority: 'medium',
						status: 'in-progress',
						lastStudyDate: '2026-01-24',
						studyCount: 2
					},
					{
						id: 'kp_01_04_02',
						name: '寻址方式',
						mastery: 42,
						errorRate: 32,
						priority: 'high',
						status: 'in-progress',
						lastStudyDate: '2026-01-23',
						studyCount: 1
					},
					{
						id: 'kp_01_04_03',
						name: 'CISC和RISC',
						mastery: 25,
						errorRate: 48,
						priority: 'high',
						status: 'not-started',
						lastStudyDate: null,
						studyCount: 0
					}
				]
			},
			{
				id: 'mod_01_05',
				name: '中央处理器',
				knowledgePoints: [
					{
						id: 'kp_01_05_01',
						name: 'CPU功能和结构',
						mastery: 48,
						errorRate: 30,
						priority: 'medium',
						status: 'in-progress',
						lastStudyDate: '2026-01-22',
						studyCount: 1
					},
					{
						id: 'kp_01_05_02',
						name: '指令执行过程',
						mastery: 38,
						errorRate: 38,
						priority: 'high',
						status: 'in-progress',
						lastStudyDate: '2026-01-21',
						studyCount: 1
					},
					{
						id: 'kp_01_05_03',
						name: '流水线技术',
						mastery: 20,
						errorRate: 55,
						priority: 'high',
						status: 'not-started',
						lastStudyDate: null,
						studyCount: 0
					},
					{
						id: 'kp_01_05_04',
						name: '流水线冲突处理',
						mastery: 15,
						errorRate: 60,
						priority: 'high',
						status: 'not-started',
						lastStudyDate: null,
						studyCount: 0
					}
				]
			},
			{
				id: 'mod_01_06',
				name: '总线与I/O系统',
				knowledgePoints: [
					{
						id: 'kp_01_06_01',
						name: '总线结构',
						mastery: 55,
						errorRate: 22,
						priority: 'medium',
						status: 'in-progress',
						lastStudyDate: '2026-01-20',
						studyCount: 2
					},
					{
						id: 'kp_01_06_02',
						name: 'I/O接口',
						mastery: 35,
						errorRate: 42,
						priority: 'high',
						status: 'not-started',
						lastStudyDate: null,
						studyCount: 0
					},
					{
						id: 'kp_01_06_03',
						name: 'DMA控制',
						mastery: 28,
						errorRate: 50,
						priority: 'high',
						status: 'not-started',
						lastStudyDate: null,
						studyCount: 0
					},
					{
						id: 'kp_01_06_04',
						name: '中断系统',
						mastery: 32,
						errorRate: 45,
						priority: 'high',
						status: 'not-started',
						lastStudyDate: null,
						studyCount: 0
					}
				]
			}
		]
	},
	{
		id: 'course_02',
		name: '计算机网络',
		abbr: '计网',
		color: '#f093fb',
		icon: 'wifi',
		totalKnowledge: 38,
		masteredKnowledge: 15,
		overallProgress: 39,
		modules: [
			{
				id: 'mod_02_01',
				name: '计算机网络体系结构',
				knowledgePoints: [
					{
						id: 'kp_02_01_01',
						name: 'OSI七层模型',
						mastery: 80,
						errorRate: 8,
						priority: 'low',
						status: 'completed',
						lastStudyDate: '2026-01-24',
						studyCount: 3
					},
					{
						id: 'kp_02_01_02',
						name: 'TCP/IP四层模型',
						mastery: 75,
						errorRate: 12,
						priority: 'medium',
						status: 'completed',
						lastStudyDate: '2026-01-23',
						studyCount: 3
					},
					{
						id: 'kp_02_01_03',
						name: '网络性能指标',
						mastery: 65,
						errorRate: 18,
						priority: 'medium',
						status: 'in-progress',
						lastStudyDate: '2026-01-26',
						studyCount: 2
					}
				]
			},
			{
				id: 'mod_02_02',
				name: '物理层',
				knowledgePoints: [
					{
						id: 'kp_02_02_01',
						name: '传输媒体',
						mastery: 70,
						errorRate: 15,
						priority: 'low',
						status: 'completed',
						lastStudyDate: '2026-01-22',
						studyCount: 2
					},
					{
						id: 'kp_02_02_02',
						name: '编码与调制',
						mastery: 55,
						errorRate: 25,
						priority: 'medium',
						status: 'in-progress',
						lastStudyDate: '2026-01-25',
						studyCount: 2
					},
					{
						id: 'kp_02_02_03',
						name: '信道复用技术',
						mastery: 45,
						errorRate: 32,
						priority: 'medium',
						status: 'in-progress',
						lastStudyDate: '2026-01-21',
						studyCount: 1
					}
				]
			},
			{
				id: 'mod_02_03',
				name: '数据链路层',
				knowledgePoints: [
					{
						id: 'kp_02_03_01',
						name: '数据链路层功能',
						mastery: 60,
						errorRate: 20,
						priority: 'medium',
						status: 'in-progress',
						lastStudyDate: '2026-01-27',
						studyCount: 2
					},
					{
						id: 'kp_02_03_02',
						name: '差错检测',
						mastery: 50,
						errorRate: 28,
						priority: 'medium',
						status: 'in-progress',
						lastStudyDate: '2026-01-26',
						studyCount: 2
					},
					{
						id: 'kp_02_03_03',
						name: 'HDLC协议',
						mastery: 38,
						errorRate: 38,
						priority: 'high',
						status: 'in-progress',
						lastStudyDate: '2026-01-24',
						studyCount: 1
					},
					{
						id: 'kp_02_03_04',
						name: 'PPP协议',
						mastery: 42,
						errorRate: 35,
						priority: 'high',
						status: 'in-progress',
						lastStudyDate: '2026-01-23',
						studyCount: 1
					},
					{
						id: 'kp_02_03_05',
						name: 'MAC地址',
						mastery: 55,
						errorRate: 22,
						priority: 'medium',
						status: 'in-progress',
						lastStudyDate: '2026-01-28',
						studyCount: 2
					}
				]
			},
			{
				id: 'mod_02_04',
				name: '网络层',
				knowledgePoints: [
					{
						id: 'kp_02_04_01',
						name: 'IP协议',
						mastery: 62,
						errorRate: 18,
						priority: 'medium',
						status: 'in-progress',
						lastStudyDate: '2026-01-28',
						studyCount: 2
					},
					{
						id: 'kp_02_04_02',
						name: 'IPv4地址与子网划分',
						mastery: 48,
						errorRate: 30,
						priority: 'high',
						status: 'in-progress',
						lastStudyDate: '2026-01-27',
						studyCount: 2
					},
					{
						id: 'kp_02_04_03',
						name: 'ICMP协议',
						mastery: 40,
						errorRate: 35,
						priority: 'high',
						status: 'in-progress',
						lastStudyDate: '2026-01-25',
						studyCount: 1
					},
					{
						id: 'kp_02_04_04',
						name: '路由算法',
						mastery: 32,
						errorRate: 45,
						priority: 'high',
						status: 'in-progress',
						lastStudyDate: '2026-01-24',
						studyCount: 1
					},
					{
						id: 'kp_02_04_05',
						name: 'RIP协议',
						mastery: 25,
						errorRate: 50,
						priority: 'high',
						status: 'not-started',
						lastStudyDate: null,
						studyCount: 0
					},
					{
						id: 'kp_02_04_06',
						name: 'OSPF协议',
						mastery: 20,
						errorRate: 55,
						priority: 'high',
						status: 'not-started',
						lastStudyDate: null,
						studyCount: 0
					}
				]
			},
			{
				id: 'mod_02_05',
				name: '传输层',
				knowledgePoints: [
					{
						id: 'kp_02_05_01',
						name: 'UDP协议',
						mastery: 58,
						errorRate: 22,
						priority: 'medium',
						status: 'in-progress',
						lastStudyDate: '2026-01-26',
						studyCount: 2
					},
					{
						id: 'kp_02_05_02',
						name: 'TCP协议',
						mastery: 52,
						errorRate: 28,
						priority: 'medium',
						status: 'in-progress',
						lastStudyDate: '2026-01-28',
						studyCount: 2
					},
					{
						id: 'kp_02_05_03',
						name: 'TCP三次握手',
						mastery: 45,
						errorRate: 32,
						priority: 'high',
						status: 'in-progress',
						lastStudyDate: '2026-01-27',
						studyCount: 2
					},
					{
						id: 'kp_02_05_04',
						name: 'TCP四次挥手',
						mastery: 42,
						errorRate: 35,
						priority: 'high',
						status: 'in-progress',
						lastStudyDate: '2026-01-26',
						studyCount: 1
					},
					{
						id: 'kp_02_05_05',
						name: 'TCP流量控制',
						mastery: 28,
						errorRate: 48,
						priority: 'high',
						status: 'not-started',
						lastStudyDate: null,
						studyCount: 0
					},
					{
						id: 'kp_02_05_06',
						name: 'TCP拥塞控制',
						mastery: 22,
						errorRate: 58,
						priority: 'high',
						status: 'not-started',
						lastStudyDate: null,
						studyCount: 0
					}
				]
			},
			{
				id: 'mod_02_06',
				name: '应用层',
				knowledgePoints: [
					{
						id: 'kp_02_06_01',
						name: 'DNS协议',
						mastery: 55,
						errorRate: 25,
						priority: 'medium',
						status: 'in-progress',
						lastStudyDate: '2026-01-25',
						studyCount: 2
					},
					{
						id: 'kp_02_06_02',
						name: 'HTTP协议',
						mastery: 65,
						errorRate: 18,
						priority: 'medium',
						status: 'in-progress',
						lastStudyDate: '2026-01-27',
						studyCount: 2
					},
					{
						id: 'kp_02_06_03',
						name: 'HTTPS协议',
						mastery: 38,
						errorRate: 40,
						priority: 'high',
						status: 'in-progress',
						lastStudyDate: '2026-01-23',
						studyCount: 1
					},
					{
						id: 'kp_02_06_04',
						name: 'FTP协议',
						mastery: 30,
						errorRate: 45,
						priority: 'high',
						status: 'not-started',
						lastStudyDate: null,
						studyCount: 0
					},
					{
						id: 'kp_02_06_05',
						name: 'SMTP协议',
						mastery: 25,
						errorRate: 50,
						priority: 'high',
						status: 'not-started',
						lastStudyDate: null,
						studyCount: 0
					}
				]
			}
		]
	}
];

// 获取今日重点复习知识点（优先级高 + 掌握度低）
export const getTodayFocusPoints = () => {
	const focusPoints = [];
	
	courses.forEach(course => {
		course.modules.forEach(module => {
			module.knowledgePoints.forEach(kp => {
				if (kp.priority === 'high' && kp.mastery < 60) {
					focusPoints.push({
						...kp,
						courseName: course.name,
						courseColor: course.color,
						moduleName: module.name
					});
				}
			});
		});
	});
	
	// 按掌握度排序，掌握度越低越靠前
	focusPoints.sort((a, b) => a.mastery - b.mastery);
	
	return focusPoints.slice(0, 5); // 返回前5个
};

// 获取本周学习计划（优先级高的知识点）
export const getWeeklyPlan = () => {
	const weeklyPlan = [];
	
	courses.forEach(course => {
		course.modules.forEach(module => {
			module.knowledgePoints.forEach(kp => {
				if (kp.priority === 'high' || (kp.priority === 'medium' && kp.mastery < 70)) {
					weeklyPlan.push({
						...kp,
						courseName: course.name,
						courseColor: course.color,
						moduleName: module.name
					});
				}
			});
		});
	});
	
	// 按优先级和掌握度排序
	weeklyPlan.sort((a, b) => {
		const priorityMap = { high: 3, medium: 2, low: 1 };
		if (priorityMap[a.priority] !== priorityMap[b.priority]) {
			return priorityMap[b.priority] - priorityMap[a.priority];
		}
		return a.mastery - b.mastery;
	});
	
	return weeklyPlan.slice(0, 10); // 返回前10个
};

// 更新知识点掌握度
export const updateKnowledgeMastery = (courseId, knowledgeId, increment = 10) => {
	const course = courses.find(c => c.id === courseId);
	if (!course) return false;
	
	for (let module of course.modules) {
		const kp = module.knowledgePoints.find(k => k.id === knowledgeId);
		if (kp) {
			kp.mastery = Math.min(100, kp.mastery + increment);
			kp.studyCount++;
			kp.lastStudyDate = new Date().toISOString().split('T')[0];
			
			// 更新状态
			if (kp.mastery >= 80) {
				kp.status = 'completed';
				kp.priority = 'low';
			} else if (kp.mastery >= 40) {
				kp.status = 'in-progress';
			}
			
			// 重新计算优先级
			if (kp.mastery < 60 && kp.errorRate > 30) {
				kp.priority = 'high';
			} else if (kp.mastery < 70 && kp.errorRate > 20) {
				kp.priority = 'medium';
			}
			
			// 更新课程整体进度
			updateCourseProgress(course);
			
			return true;
		}
	}
	
	return false;
};

// 更新课程整体进度
const updateCourseProgress = (course) => {
	let totalMastery = 0;
	let totalCount = 0;
	let masteredCount = 0;
	
	course.modules.forEach(module => {
		module.knowledgePoints.forEach(kp => {
			totalMastery += kp.mastery;
			totalCount++;
			if (kp.mastery >= 80) {
				masteredCount++;
			}
		});
	});
	
	course.overallProgress = Math.round(totalMastery / totalCount);
	course.masteredKnowledge = masteredCount;
	course.totalKnowledge = totalCount;
};

// 导出默认对象
export default {
	examInfo,
	courses,
	getTodayFocusPoints,
	getWeeklyPlan,
	updateKnowledgeMastery,
	calculateDaysRemaining
};

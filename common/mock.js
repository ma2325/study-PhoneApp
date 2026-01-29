/**
 * Mock 数据管理中心
 * 用于前端展示模式，不连接任何后端
 * 所有数据都是模拟数据，仅供演示使用
 */

// ==================== 拍题检索相关 Mock 数据 ====================

// 模拟题库数据（题目文本 → 知识点映射）
export const mockQuestionBank = [
	{
		id: 1,
		questionText: "CPU",
		keywords: ["微指令", "直接编码", "字段直接编码"],
		knowledgePoints: [
			{ id: "kp_001", name: "直接编码" },
			{ id: "kp_002", name: "字段直接编码" }
		]
	}
	// {
	// 	id: 2,
	// 	questionText: "勾股定理",
	// 	keywords: ["直角三角形", "勾股", "平方"],
	// 	knowledgePoints: [
	// 		{ id: "kp_003", name: "勾股定理" },
	// 		{ id: "kp_004", name: "直角三角形性质" }
	// 	]
	// },
	// {
	// 	id: 3,
	// 	questionText: "光合作用",
	// 	keywords: ["光合", "叶绿体", "二氧化碳", "氧气"],
	// 	knowledgePoints: [
	// 		{ id: "kp_005", name: "光合作用原理" },
	// 		{ id: "kp_006", name: "植物细胞结构" }
	// 	]
	// },
	// {
	// 	id: 4,
	// 	questionText: "英语现在完成时",
	// 	keywords: ["have done", "完成时", "时态"],
	// 	knowledgePoints: [
	// 		{ id: "kp_007", name: "现在完成时态" },
	// 		{ id: "kp_008", name: "英语动词变化" }
	// 	]
	// },
	// {
	// 	id: 5,
	// 	questionText: "二次函数",
	// 	keywords: ["抛物线", "二次", "ax²"],
	// 	knowledgePoints: [
	// 		{ id: "kp_009", name: "二次函数图像与性质" },
	// 		{ id: "kp_010", name: "函数解析式" }
	// 	]
	// }
];

// 知识点 → 学习资源映射
export const mockKnowledgeResources = {
	"kp_001": {
		id: "kp_001",
		name: "CPU",
		subject: "物理",
		grade: "初中",
		resources: [
			{
				id: "res_001",
				type: "ppt",
				title: "CPU部分PPT",
				url: "/static/resources/newton_law.ppt",
				preview: "/static/preview/ppt_newton.png",
				description: "详细讲解CPU相关知识点",
				pages: 10
			},
			{
				id: "res_002",
				type: "video",
				title: "CPU实验演示视频",
				url: "/static/resources/inertia_video.mp4",
				preview: "/static/preview/video_inertia.png",
				duration: "05:32"
			},
			{
				id: "res_003",
				type: "note",
				title: "CPU部分笔记",
				url: "/static/resources/newton_note.pdf",
				preview: "/static/preview/note_newton.png",
				pages: 3
			},
			{
				id: "res_004",
				type: "audio",
				title: "CPU部分讲解音频",
				url: "/static/resources/newton_audio.mp3",
				duration: "08:15"
			}
		]
	},
	"kp_002": {
		id: "kp_002",
		name: "力与运动的关系",
		subject: "物理",
		grade: "初中",
		resources: [
			{
				type: "ppt",
				title: "CPU部分PPT",
				url: "/static/resources/force_motion.ppt",
				preview: "/static/preview/ppt_force.png"
			},
			{
				type: "note",
				title: "CPU部分笔记",
				url: "/static/resources/force_note.pdf",
				preview: "/static/preview/note_force.png",
				pages: 5
			}
		]
	},
	"kp_003": {
		id: "kp_003",
		name: "勾股定理",
		subject: "数学",
		grade: "初中",
		resources: [
			{
				type: "ppt",
				title: "勾股定理证明与应用",
				url: "/static/resources/pythagorean.ppt",
				preview: "/static/preview/ppt_pythagorean.png"
			},
			{
				type: "video",
				title: "勾股定理动画演示",
				url: "/static/resources/pythagorean_video.mp4",
				preview: "/static/preview/video_pythagorean.png",
				duration: "06:20"
			},
			{
				type: "note",
				title: "勾股定理例题详解",
				url: "/static/resources/pythagorean_note.pdf",
				preview: "/static/preview/note_pythagorean.png",
				pages: 4
			}
		]
	},
	"kp_005": {
		id: "kp_005",
		name: "光合作用原理",
		subject: "生物",
		grade: "初中",
		resources: [
			{
				type: "ppt",
				title: "光合作用过程详解",
				url: "/static/resources/photosynthesis.ppt",
				preview: "/static/preview/ppt_photo.png"
			},
			{
				type: "video",
				title: "叶绿体工作原理",
				url: "/static/resources/chloroplast_video.mp4",
				preview: "/static/preview/video_chloro.png",
				duration: "07:45"
			}
		]
	},
	"kp_007": {
		id: "kp_007",
		name: "现在完成时态",
		subject: "英语",
		grade: "初中",
		resources: [
			{
				type: "ppt",
				title: "Present Perfect Tense讲解",
				url: "/static/resources/present_perfect.ppt",
				preview: "/static/preview/ppt_tense.png"
			},
			{
				type: "audio",
				title: "时态练习音频",
				url: "/static/resources/tense_audio.mp3",
				duration: "10:00"
			}
		]
	},
	"kp_009": {
		id: "kp_009",
		name: "二次函数图像与性质",
		subject: "数学",
		grade: "初中",
		resources: [
			{
				type: "ppt",
				title: "二次函数完全解析",
				url: "/static/resources/quadratic.ppt",
				preview: "/static/preview/ppt_quadratic.png"
			},
			{
				type: "note",
				title: "抛物线性质总结",
				url: "/static/resources/parabola_note.pdf",
				preview: "/static/preview/note_parabola.png",
				pages: 6
			}
		]
	}
};

// ==================== 智能匹配函数 ====================

/**
 * 模拟 OCR 识别（从图片中提取文字）
 * @param {String} imagePath - 图片路径
 * @returns {Promise} 返回识别出的文字
 */
export const mockOCR = (imagePath) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			// 模拟识别延迟
			const randomTexts = [
				"(1)采用直接编码方式，微指令的操作控制字段的总位数等于控制信号数，即69个。\n（2）采用字段直接编码方式，需要的控制位少。根据题目给出的8个控制字段及各段可激活的控制信号数，再加上每个控制字段至少要留一个码表示不激活任何控制线，8个字段分别给出6、9、4、17、2、8、26、5种状态，对应：3，4，2，5，1，3，5，3位。总位数：26位",
				// "在直角三角形中，两直角边的平方和等于斜边的平方。",
				// "光合作用是绿色植物利用光能将二氧化碳和水转化为有机物的过程。",
				// "I have finished my homework. 这句话使用了现在完成时态。",
				// "二次函数的一般形式为 y = ax² + bx + c，图像是一条抛物线。"
			];
			const randomIndex = Math.floor(Math.random() * randomTexts.length);
			resolve({
				success: true,
				text: randomTexts[randomIndex],
				confidence: 0.92 // 模拟识别置信度
			});
		}, 1500);
	});
};

/**
 * 根据题目文字匹配知识点（模拟 AI 分析）
 * @param {String} questionText - 题目文字
 * @returns {Promise} 返回匹配的知识点列表
 */
export const mockMatchKnowledgePoints = (questionText) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			const text = questionText.toLowerCase();
			let matchedPoints = [];

			// 简单的关键词匹配算法
			mockQuestionBank.forEach(question => {
				let matchCount = 0;
				question.keywords.forEach(keyword => {
					if (text.includes(keyword) || text.includes(keyword.toLowerCase())) {
						matchCount++;
					}
				});

				if (matchCount > 0) {
					matchedPoints.push({
						...question,
						matchScore: matchCount / question.keywords.length // 匹配度
					});
				}
			});

			// 按匹配度排序
			matchedPoints.sort((a, b) => b.matchScore - a.matchScore);

			// 提取知识点
			let knowledgePoints = [];
			matchedPoints.forEach(item => {
				knowledgePoints.push(...item.knowledgePoints);
			});

			// 去重
			knowledgePoints = knowledgePoints.filter((point, index, self) =>
				index === self.findIndex(p => p.id === point.id)
			);

			resolve({
				success: true,
				questionText: questionText,
				knowledgePoints: knowledgePoints.slice(0, 5), // 最多返回5个知识点
				analysisTime: Math.random() * 2 + 1 // 模拟分析耗时
			});
		}, 800);
	});
};

/**
 * 获取知识点的学习资源
 * @param {String} knowledgePointId - 知识点ID
 * @returns {Object} 返回该知识点的所有资源
 */
export const mockGetResources = (knowledgePointId) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			const resources = mockKnowledgeResources[knowledgePointId];
			if (resources) {
				resolve({
					success: true,
					data: resources
				});
			} else {
				resolve({
					success: false,
					message: "未找到相关资源"
				});
			}
		}, 300);
	});
};

// ==================== 其他页面 Mock 数据（保留原有功能） ====================

// 模拟登录
export const mockLogin = (userName, password) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			if (userName && password) {
				resolve({
					code: 200,
					msg: "登录成功",
					data: {
						userId: "mock_user_" + Date.now(),
						userName: userName,
						nickName: "演示用户",
						phone: "138****8888"
					}
				});
			} else {
				resolve({
					code: 400,
					msg: "用户名或密码不能为空"
				});
			}
		}, 500);
	});
};

// 模拟首页轮播图
export const mockIndexNews = () => {
	return {
		code: 200,
		data: [
			{ id: 1, image: "/static/banner1.jpg", title: "欢迎使用学习辅助系统" },
			{ id: 2, image: "/static/banner2.jpg", title: "AI拍题识别功能上线" },
			{ id: 3, image: "/static/banner3.jpg", title: "知识点智能推荐" }
		]
	};
};

// 导出默认配置
export default {
	// 是否启用 Mock 模式（可在这里统一控制）
	enableMock: true,
	
	// 模拟网络延迟（毫秒）
	mockDelay: 500
};

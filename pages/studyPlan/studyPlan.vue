<template>
	<view class="study-plan-page">
		<view class="header-card">
			<view class="exam-countdown">
				<text class="countdown-icon">📅</text>
				<view class="countdown-info">
					<text class="countdown-label">距离考试还有</text>
					<text class="countdown-days">{{ daysRemaining }}</text>
					<text class="countdown-unit">天</text>
				</view>
			</view>
			
			<view class="today-target">
				<view class="target-item">
					<text class="target-label">今日目标</text>
					<text class="target-value">{{ todayStudyTarget }}分钟</text>
				</view>
				<view class="target-item">
					<text class="target-label">已完成</text>
					<text class="target-value completed">{{ todayCompleted }}分钟</text>
				</view>
				<view class="progress-bar">
					<view class="progress-fill" :style="{ width: todayProgress + '%' }"></view>
				</view>
			</view>
		</view>
		
		<view class="course-tabs">
			<view 
				v-for="(course, index) in courses" 
				:key="course.id"
				class="tab-item"
				:class="{ active: currentCourseIndex === index }"
				@click="switchTab(index)"
			>
				{{ course.name }}
			</view>
		</view>

		<view class="plan-list">
			<view v-if="filteredPlans.length === 0" class="empty-state">
				<uv-icon name="list-dot" size="40" color="#ccc"></uv-icon>
				<text>该科目暂无今日计划</text>
			</view>

			<view 
				v-for="(plan, index) in filteredPlans" 
				:key="plan.id" 
				class="plan-item"
				@click="showDetail(plan)"
			>
				<view class="plan-left">
					<view class="time-box">
						<text class="plan-time">{{ plan.time }}</text>
						<view class="time-line"></view>
					</view>
					<view class="plan-content">
						<text class="plan-title">{{ plan.title }}</text>
						<text class="plan-desc">{{ plan.desc }}</text>
						<view class="tags-row">
							<uv-tag :text="plan.courseName" plain size="mini" type="primary"></uv-tag>
							<uv-tag :text="plan.statusText" plain size="mini" :type="plan.statusType" style="margin-left: 5px;"></uv-tag>
						</view>
					</view>
				</view>
				<view class="plan-right">
					<uv-icon name="arrow-right" size="16" color="#ccc"></uv-icon>
				</view>
			</view>
		</view>

		<uv-popup ref="popupRef" mode="bottom" round="12">
			<view class="popup-box" v-if="currentPlan">
				<view class="popup-header">
					<text class="popup-title">计划详情</text>
					<uv-icon name="close" @click="closePopup"></uv-icon>
				</view>
				<view class="popup-content">
					<view class="detail-row">
						<text class="detail-label">科目</text>
						<text class="detail-value">{{ currentPlan.courseName }}</text>
					</view>
					<view class="detail-row">
						<text class="detail-label">任务内容</text>
						<text class="detail-value">{{ currentPlan.title }}</text>
					</view>
					<view class="detail-row">
						<text class="detail-label">建议时长</text>
						<text class="detail-value">{{ currentPlan.duration }}分钟</text>
					</view>
					<view class="detail-row">
						<text class="detail-label">掌握程度</text>
						<text class="detail-value mastery" :class="currentPlan.masteryLevel">
							{{ currentPlan.masteryText }}
						</text>
					</view>
				</view>
				<uv-button type="primary" shape="circle" text="开始学习" @click="startStudy"></uv-button>
			</view>
		</uv-popup>

	</view>
</template>

<script setup>
	import { ref, computed } from 'vue'

	// --- Mock 数据定义 ---
	
	const daysRemaining = ref(45)
	const todayStudyTarget = ref(240) // 分钟
	const todayCompleted = ref(120)   // 分钟
	const todayProgress = computed(() => (todayCompleted.value / todayStudyTarget.value) * 100)

	// 1. 科目 Tab 数据
	const courses = ref([
		{ id: 0, name: '全部' },
		{ id: 1, name: '计算机组成原理' },
		{ id: 2, name: '计算机网络' },
		{ id: 3, name: '数据结构' },
		{ id: 4, name: '英语' }
	])
	
	const currentCourseIndex = ref(0)

	// 2. 计划列表 Mock 数据 (包含不同科目)
	const allPlans = [
		{ 
			id: 101, 
			courseId: 1, 
			courseName: '计组', 
			time: '08:00', 
			title: '复习浮点数运算', 
			desc: '重点看IEEE754标准', 
			statusText: '待完成', 
			statusType: 'warning',
			duration: 45,
			masteryText: '薄弱',
			masteryLevel: 'low'
		},
		{ 
			id: 102, 
			courseId: 2, 
			courseName: '计网', 
			time: '10:00', 
			title: 'TCP三次握手实验', 
			desc: '使用Packet Tracer模拟', 
			statusText: '进行中', 
			statusType: 'primary',
			duration: 60,
			masteryText: '中等',
			masteryLevel: 'medium'
		},
		{ 
			id: 103, 
			courseId: 4, 
			courseName: '英语', 
			time: '14:00', 
			title: '2024真题阅读Part A', 
			desc: '完成2篇阅读理解', 
			statusText: '已完成', 
			statusType: 'success',
			duration: 40,
			masteryText: '熟练',
			masteryLevel: 'high'
		},
		{ 
			id: 104, 
			courseId: 3, 
			courseName: '数据结构', 
			time: '16:00', 
			title: '二叉树遍历算法', 
			desc: '手写非递归实现', 
			statusText: '待完成', 
			statusType: 'info',
			duration: 90,
			masteryText: '中等',
			masteryLevel: 'medium'
		}
	]

	// 3. 计算属性：根据选中的 Tab 筛选列表
	const filteredPlans = computed(() => {
		const selectedCourse = courses.value[currentCourseIndex.value]
		if (selectedCourse.id === 0) {
			return allPlans // "全部"显示所有
		}
		// 根据 courseId 或 name 筛选
		// 注意：这里简单用 courseName 包含匹配，或者你可以用 courseId 精确匹配
		// 演示数据里 courseId 对应关系：1-计组, 2-计网...
		return allPlans.filter(p => p.courseId === selectedCourse.id)
	})

	// --- 交互逻辑 ---

	const switchTab = (index) => {
		currentCourseIndex.value = index
	}

	// 弹窗相关
	const popupRef = ref(null)
	const currentPlan = ref(null)

	const showDetail = (plan) => {
		currentPlan.value = plan
		popupRef.value.open()
	}

	const closePopup = () => {
		popupRef.value.close()
	}
	
	const startStudy = () => {
		uni.showToast({
			title: '开始学习计时...',
			icon: 'none'
		})
		closePopup()
	}

</script>

<style lang="scss" scoped>
	.study-plan-page {
		min-height: 100vh;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		padding-bottom: 100rpx;
		
		/* --- 修复顶部遮挡问题 --- */
		padding-top: calc(var(--status-bar-height) + 20rpx); 
		box-sizing: border-box;
		/* ----------------------- */
	}

	/* 顶部卡片 */
	.header-card {
		margin: 0 30rpx 30rpx;
		background: rgba(255, 255, 255, 0.15);
		backdrop-filter: blur(10px);
		border-radius: 20rpx;
		padding: 30rpx;
		color: #fff;
		box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
	}

	.exam-countdown {
		display: flex;
		align-items: center;
		margin-bottom: 30rpx;
		
		.countdown-icon { font-size: 60rpx; margin-right: 20rpx; }
		.countdown-info {
			display: flex; align-items: baseline;
			.countdown-label { font-size: 28rpx; margin-right: 10rpx; opacity: 0.9; }
			.countdown-days { font-size: 48rpx; font-weight: bold; margin-right: 5rpx; }
			.countdown-unit { font-size: 24rpx; opacity: 0.8; }
		}
	}

	.today-target {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		
		.target-item {
			width: 48%;
			background: rgba(0, 0, 0, 0.1);
			padding: 15rpx;
			border-radius: 12rpx;
			margin-bottom: 20rpx;
			display: flex;
			flex-direction: column;
			
			.target-label { font-size: 24rpx; opacity: 0.8; margin-bottom: 5rpx; }
			.target-value { 
				font-size: 32rpx; font-weight: bold;
				&.completed { color: #8fd3f4; }
			}
		}
		
		.progress-bar {
			width: 100%; height: 8rpx; background: rgba(255, 255, 255, 0.2); border-radius: 4rpx; overflow: hidden;
			.progress-fill { height: 100%; background: #8fd3f4; transition: width 0.3s ease; }
		}
	}

	/* Tab 标签栏 */
	.course-tabs {
		display: flex;
		padding: 0 30rpx;
		margin-bottom: 20rpx;
		overflow-x: auto; /* 支持横向滚动 */
		white-space: nowrap;
		
		.tab-item {
			padding: 12rpx 30rpx;
			background: rgba(255, 255, 255, 0.8);
			border-radius: 30rpx;
			margin-right: 20rpx;
			font-size: 28rpx;
			color: #666;
			transition: all 0.3s;
			
			&.active {
				background: #fff;
				color: #667eea;
				font-weight: bold;
				transform: scale(1.05);
			}
		}
	}

	/* 列表区域 */
	.plan-list {
		padding: 0 30rpx;
		
		.empty-state {
			background: #fff; border-radius: 20rpx; padding: 60rpx 0;
			display: flex; flex-direction: column; align-items: center; justify-content: center;
			color: #999; font-size: 28rpx;
			text { margin-top: 20rpx; }
		}
		
		.plan-item {
			background: #fff;
			border-radius: 20rpx;
			padding: 25rpx;
			margin-bottom: 20rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
			
			&:active { background-color: #fafafa; }

			.plan-left {
				display: flex;
				flex: 1;
				
				.time-box {
					display: flex; flex-direction: column; align-items: center; margin-right: 20rpx; min-width: 80rpx;
					.plan-time { font-size: 28rpx; font-weight: bold; color: #333; margin-bottom: 8rpx; }
					.time-line { width: 2rpx; flex: 1; background: #eee; min-height: 30rpx; }
				}
				
				.plan-content {
					flex: 1;
					.plan-title { font-size: 30rpx; font-weight: bold; color: #333; margin-bottom: 6rpx; display: block; }
					.plan-desc { font-size: 24rpx; color: #999; margin-bottom: 12rpx; display: block; }
					.tags-row { display: flex; align-items: center; }
				}
			}
		}
	}
	
	/* 弹窗样式 */
	.popup-box {
		padding: 30rpx;
		background: #fff;
		.popup-header { 
			display: flex; justify-content: space-between; align-items: center; margin-bottom: 30rpx;
			.popup-title { font-size: 32rpx; font-weight: bold; }
		}
		.popup-content {
			margin-bottom: 30rpx;
			.detail-row {
				display: flex; justify-content: space-between; padding: 20rpx 0; border-bottom: 1px solid #f5f5f5;
				.detail-label { color: #999; }
				.detail-value { 
					color: #333; font-weight: 500;
					&.mastery {
						&.low { color: #ff4d4f; }
						&.medium { color: #faad14; }
						&.high { color: #52c41a; }
					}
				}
			}
		}
	}
</style>
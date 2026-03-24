<template>
	<view class="profile-container">

		<view class="profile-header">
			<template v-if="isLoading">
				<view class="header-content">
					<view class="skeleton-avatar"></view>
					<view class="skeleton-info">
						<view class="skeleton-line skeleton-nickname"></view>
						<view class="skeleton-line skeleton-motto"></view>
					</view>
				</view>
			</template>

			<template v-else>
				<view class="header-content">
					<view class="user-avatar-box">
						<uv-image shape="circle" :src="userInfo.avatar" width="140rpx" height="140rpx"></uv-image>
					</view>

					<view class="user-info">
						<view class="name-row">
							<text class="nickname">{{ isLoggedIn ? userInfo.nickName : '请点击登录' }}</text>
							<view class="tag-wrap" v-if="isLoggedIn">
								<uv-tag :text="userInfo.level" type="warning" size="mini" shape="circle" plain></uv-tag>
							</view>
						</view>
						<text class="motto" v-if="isLoggedIn">{{ userInfo.motto }}</text>
						<text class="motto" v-else @click="toLogin">登录同步学习进度</text>
					</view>
				</view>

				<view class="stats-row" v-if="isLoggedIn">
					<view class="stat-item">
						<text class="num">{{ userInfo.studyDays }}</text>
						<text class="label">坚持天数</text>
					</view>
					<view class="stat-line"></view>
					<view class="stat-item">
						<text class="num">{{ userInfo.questionCount }}</text>
						<text class="label">累计刷题</text>
					</view>
					<view class="stat-line"></view>
					<view class="stat-item">
						<text class="num">{{ userInfo.collectionCount }}</text>
						<text class="label">资料收藏</text>
					</view>
				</view>
			</template>

			<view class="header-curve"></view>
		</view>

		<view class="content-wrapper">

			<view class="menu-card">
				<view class="card-header">学习工具箱</view>

				<view class="menu-item" hover-class="item-hover" @click="toStudyPlan">
					<view class="item-left">
						<view class="icon-box blue-bg">
							<uv-icon name="calendar" color="#3C9CFF" size="20"></uv-icon>
						</view>
						<text class="item-title">我的计划</text>
					</view>
					<view class="item-right">
						<text class="sub-text">今日剩余 2 项</text>
						<uv-icon name="arrow-right" color="#C0C4CC" size="14"></uv-icon>
					</view>
				</view>

				<view class="menu-item" hover-class="item-hover" @click="toScanHistory">
					<view class="item-left">
						<view class="icon-box green-bg">
							<uv-icon name="camera-fill" color="#19BE6B" size="20"></uv-icon>
						</view>
						<text class="item-title">拍题记录</text>
					</view>
					<uv-icon name="arrow-right" color="#C0C4CC" size="14"></uv-icon>
				</view>

				<view class="menu-item" hover-class="item-hover" @click="toMistakes">
					<view class="item-left">
						<view class="icon-box orange-bg">
							<uv-icon name="edit-pen" color="#FF9900" size="20"></uv-icon>
						</view>
						<text class="item-title">错题归纳</text>
					</view>
					<uv-icon name="arrow-right" color="#C0C4CC" size="14"></uv-icon>
				</view>

				<view class="menu-item" hover-class="item-hover" @click="toResources">
					<view class="item-left">
						<view class="icon-box cyan-bg">
							<uv-icon name="folder-fill" color="#4e09b5" size="20"></uv-icon>
						</view>
						<text class="item-title">离线资料库</text>
					</view>
					<uv-icon name="arrow-right" color="#C0C4CC" size="14"></uv-icon>
				</view>
			</view>

			<view class="menu-card" v-if="isLoggedIn">
				<view class="card-header">
					<text>最近搜题</text>
					<text class="clear-btn" @click="clearHistory">清空</text>
				</view>

				<view class="history-list">
					<view class="history-item" v-for="(item, index) in searchHistory" :key="index" @click="toQuestionDetail(item)">
						<uv-icon name="clock" color="#999" size="14"></uv-icon>
						<text class="history-text uv-line-1">{{ item.title }}</text>
					</view>
					<view class="empty-tip" v-if="searchHistory.length === 0">暂无搜索记录</view>
				</view>
			</view>

			<view class="menu-card">
				<view class="card-header">账号管理</view>

				<view class="menu-item" hover-class="item-hover" @click="modifyInfo">
					<view class="item-left">
						<view class="icon-box yellow-bg">
							<uv-icon name="account-fill" color="#FFB800" size="20"></uv-icon>
						</view>
						<text class="item-title">修改信息</text>
					</view>
					<uv-icon name="arrow-right" color="#C0C4CC" size="14"></uv-icon>
				</view>

				<view class="menu-item" hover-class="item-hover" @click="showAbout">
					<view class="item-left">
						<view class="icon-box purple-bg">
							<uv-icon name="info-circle" color="#666" size="20"></uv-icon>
						</view>
						<text class="item-title">关于我们</text>
					</view>
					<uv-icon name="arrow-right" color="#C0C4CC" size="14"></uv-icon>
				</view>
			</view>

			<view class="logout-section" v-if="isLoggedIn">
				<button class="logout-btn" hover-class="logout-hover" @click="handleLogout">退出登录</button>
			</view>

		</view>
	</view>
</template>

<script setup>
	import { ref, reactive, computed } from 'vue';
	import { onShow } from '@dcloudio/uni-app'

	// --- 状态变量 ---
	const isLoading = ref(true);
	
	// Mock 用户数据
	const userInfo = reactive({
		nickName: '未登录',
		avatar: '/static/user.jpg',
		motto: '今天也要元气满满！',
		level: 'Lv.1 备考萌新',
		studyDays: 0,
		questionCount: 0,
		collectionCount: 0
	});

	// Mock 历史记录数据
	const searchHistory = ref([
		{ id: 1, title: '计算机网络 TCP三次握手详解' },
		{ id: 2, title: '数据结构 二叉树遍历算法' },
		{ id: 3, title: '英语考研核心词汇List 1' }
	]);

	// 计算属性：判断是否登录
	const isLoggedIn = ref(false);

	// --- 方法 ---

	// 模拟获取用户信息
	const loadUserData = () => {
		isLoading.value = true;
		const userId = uni.getStorageSync("userId");
		
		setTimeout(() => {
			if (userId) {
				isLoggedIn.value = true;
				// 模拟后端返回的数据
				Object.assign(userInfo, {
					nickName: '演示用户',
					avatar: '/static/user.jpg', // 确保 static 目录下有图片
					motto: '星光不问赶路人，时光不负有心人',
					level: 'Lv.5 学霸附体',
					studyDays: 45,
					questionCount: 128,
					collectionCount: 12
				});
			} else {
				isLoggedIn.value = false;
				// 重置数据
				Object.assign(userInfo, {
					nickName: '未登录',
					avatar: '/static/user.jpg',
					studyDays: 0,
					questionCount: 0,
					collectionCount: 0
				});
			}
			isLoading.value = false;
		}, 600); // 模拟网络延迟
	};

	// 页面显示时加载
	onShow(() => {
		loadUserData();
	});

	// --- 路由跳转 ---
	const toLogin = () => uni.navigateTo({ url: "/pages/login/login" });
	
	const toStudyPlan = () => uni.switchTab({ url: "/pages/studyPlan/studyPlan" });
	
	// 以下页面如果还没做，可以先指向主页或者提示
	const toScanHistory = () => uni.showToast({ title: '功能开发中', icon: 'none' });
	const toMistakes = () => uni.showToast({ title: '功能开发中', icon: 'none' });
	
	// 复用之前的 resourceViewer 或者跳转首页资料tab
	const toResources = () => uni.switchTab({ url: "/pages/index/index" }); 

	const modifyInfo = () => uni.showToast({ title: '演示模式不可修改', icon: 'none' });
	
	const toQuestionDetail = (item) => {
		uni.showToast({ title: '查看: ' + item.title, icon: 'none' });
	}

	const clearHistory = () => {
		searchHistory.value = [];
		uni.showToast({ title: '记录已清空', icon: 'none' });
	}

	const showAbout = () => {
		uni.showModal({
			title: '关于',
			content: '这是一个基于 uni-app 重构的学习辅助小程序原型。\n当前版本：v1.0.0 (Mock Mode)',
			showCancel: false
		});
	}

	const handleLogout = () => {
		uni.showModal({
			title: '提示',
			content: '确定要退出登录吗？',
			success: (res) => {
				if (res.confirm) {
					uni.removeStorageSync("userId");
					uni.removeStorageSync("userInfo");
					loadUserData(); // 刷新页面状态
					uni.showToast({ title: '已退出', icon: 'none' });
				}
			}
		});
	};
</script>

<style lang="scss" scoped>
	/* 页面整体背景 */
	page { background-color: #F5F7FA; }
	.profile-container { min-height: 100vh; }

	/* --- 头部设计 --- */
	.profile-header {
		position: relative;
		/* 改为紫色渐变，契合学习氛围 */
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		padding: 40rpx 40rpx 100rpx 40rpx;
		color: #fff;
		overflow: hidden;
	}

	.header-curve {
		position: absolute;
		bottom: -50rpx; left: -10%; width: 120%; height: 100rpx;
		background-color: #F5F7FA;
		border-radius: 50% 50% 0 0;
		z-index: 1;
	}

	.header-content {
		position: relative; z-index: 2;
		display: flex; align-items: center; margin-top: 40rpx;
	}

	.user-avatar-box {
		border: 4rpx solid rgba(255, 255, 255, 0.6);
		border-radius: 50%; margin-right: 30rpx;
		box-shadow: 0 8rpx 16rpx rgba(0, 0, 0, 0.15);
		background-color: #fff;
	}

	.user-info {
		flex: 1; display: flex; flex-direction: column;
		.name-row {
			display: flex; align-items: center; margin-bottom: 12rpx;
			.nickname { font-size: 40rpx; font-weight: 600; margin-right: 20rpx; text-shadow: 0 2rpx 4rpx rgba(0,0,0,0.1); }
		}
		.motto { font-size: 26rpx; opacity: 0.9; font-weight: 300; }
	}

	/* 统计数据栏 */
	.stats-row {
		position: relative; z-index: 2;
		display: flex; justify-content: space-around; align-items: center;
		margin-top: 40rpx; padding-top: 30rpx;
		border-top: 1px solid rgba(255,255,255,0.2);
		
		.stat-item {
			display: flex; flex-direction: column; align-items: center;
			.num { font-size: 36rpx; font-weight: bold; margin-bottom: 4rpx; }
			.label { font-size: 22rpx; opacity: 0.8; }
		}
		.stat-line { width: 1px; height: 30rpx; background: rgba(255,255,255,0.3); }
	}

	/* --- 内容区域 --- */
	.content-wrapper {
		position: relative; z-index: 10;
		padding: 0 30rpx; margin-top: -40rpx;
	}

	/* 卡片样式 */
	.menu-card {
		background-color: #ffffff; border-radius: 24rpx;
		padding: 10rpx 0; margin-bottom: 30rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
	}
	
	.card-header {
		padding: 24rpx 30rpx 10rpx; font-size: 28rpx; color: #909399; font-weight: bold;
		display: flex; justify-content: space-between;
		
		.clear-btn { font-weight: normal; font-size: 24rpx; color: #999; }
	}

	.menu-item {
		display: flex; justify-content: space-between; align-items: center;
		padding: 28rpx 30rpx; background-color: #fff;
		&:active { background-color: #f9f9f9; }
	}

	.item-left {
		display: flex; align-items: center;
		.item-title { font-size: 30rpx; color: #333; margin-left: 24rpx; }
	}
	
	.item-right {
		display: flex; align-items: center;
		.sub-text { font-size: 24rpx; color: #999; margin-right: 10rpx; }
	}

	/* 图标背景 */
	.icon-box {
		width: 70rpx; height: 70rpx; border-radius: 20rpx;
		display: flex; align-items: center; justify-content: center;
		&.blue-bg { background-color: rgba(60, 156, 255, 0.1); }
		&.green-bg { background-color: rgba(25, 190, 107, 0.1); }
		&.orange-bg { background-color: rgba(255, 153, 0, 0.1); }
		&.yellow-bg { background-color: rgba(255, 184, 0, 0.1); }
		&.purple-bg { background-color: rgba(144, 147, 153, 0.1); }
		&.cyan-bg { background-color: rgba(24, 181, 102, 0.1); }
	}

	/* 历史记录列表 */
	.history-list {
		padding: 0 30rpx 20rpx;
		.history-item {
			padding: 20rpx 0; border-bottom: 1px dashed #eee;
			display: flex; align-items: center;
			&:last-child { border-bottom: none; }
			.history-text { font-size: 26rpx; color: #666; margin-left: 15rpx; }
		}
		.empty-tip { text-align: center; padding: 20rpx; color: #ccc; font-size: 24rpx; }
	}

	/* 退出按钮 */
	.logout-section { margin: 40rpx 0 60rpx; }
	.logout-btn {
		background-color: #ffffff; color: #FF4D4F; font-size: 32rpx;
		height: 96rpx; line-height: 96rpx; border-radius: 48rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
		&::after { border: none; }
	}
	.logout-hover { background-color: #FFF0F0; }

	/* 骨架屏动画 */
	@keyframes skeleton-blink {
		0% { opacity: 0.6; background-color: rgba(255, 255, 255, 0.3); }
		50% { opacity: 1; background-color: rgba(255, 255, 255, 0.5); }
		100% { opacity: 0.6; background-color: rgba(255, 255, 255, 0.3); }
	}
	.skeleton-avatar { width: 140rpx; height: 140rpx; border-radius: 50%; margin-right: 30rpx; animation: skeleton-blink 1.5s infinite; }
	.skeleton-info { flex: 1; }
	.skeleton-line { height: 32rpx; border-radius: 8rpx; animation: skeleton-blink 1.5s infinite; margin-bottom: 16rpx; }
	.skeleton-nickname { width: 40%; height: 40rpx; }
	.skeleton-motto { width: 70%; }
</style>
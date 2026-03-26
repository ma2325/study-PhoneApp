<template>
	<view class="page-container">
		<swiper class="swiper-container" circular :indicator-dots="true" :autoplay="true" :interval="3000"
			:duration="500">
			<swiper-item class="item" v-for="(item, index) in bannerList" :key="index">
				<image class="imgs" :src="item" mode="aspectFill"></image>
			</swiper-item>
		</swiper>

		<view class="section-box">
			<view class="section-header">
				<uv-icon name="file-text" size="24" color="#409EFF"></uv-icon>
				<text class="section-title">课程课件</text>
			</view>
			
			<view class="material-list">
				<view v-if="docList.length === 0" class="empty-tip">暂无课件资源</view>
				
				<view v-for="(item, index) in docList" :key="index" class="material-item" @click="goToViewer(item)">
					<view class="icon-wrapper" :class="getIconClass(item.type)">
						<text class="file-type">{{ item.type.toUpperCase() }}</text>
					</view>
					<view class="file-info">
						<text class="file-name">{{ item.title }}</text>
						<text class="file-size">{{ item.fileSize || '未知大小' }} • {{ formatDate(item.createTime) }}</text>
					</view>
					<uv-icon name="arrow-right" size="16" color="#ccc"></uv-icon>
				</view>
			</view>
		</view>

		<view class="section-box">
			<view class="section-header">
				<uv-icon name="play-circle-fill" size="24" color="#F56C6C"></uv-icon>
				<text class="section-title">课程视频</text>
			</view>
			
			<view class="video-list">
				<view v-if="videoList.length === 0" class="empty-tip">暂无视频资源</view>

				<view v-for="(item, index) in videoList" :key="index" class="video-card" @click="goToViewer(item)">
					<view class="video-cover-container">
						<image class="video-cover" :src="item.coverUrl || '/static/banner/b1.jpg'" mode="aspectFill"></image>
						<view class="play-mask">
							<uv-icon name="play-circle-fill" size="50" color="rgba(255,255,255,0.8)"></uv-icon>
						</view>
					</view>
					<view class="video-info">
						<text class="video-title">{{ item.title }}</text>
						<text class="video-desc">{{ item.fileSize || '未知大小' }} • {{ formatDate(item.createTime) }}</text>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script setup>
	import { ref } from 'vue'
	import { onShow } from '@dcloudio/uni-app'

	// --- 1. 状态定义 ---
	const bannerList = ref([
		'/static/banner/b1.jpg', 
		'/static/banner/b2.jpg'
	])

	const docList = ref([]) // 用于存放 pdf, ppt, note 等文档
	const videoList = ref([]) // 用于存放 video 视频

	// 临时硬编码测试用户，后续可从 uni.getStorageSync('userInfo') 获取
	const currentUserId = 'test001' 
	
	// API 基础路径，请替换为你的真实后端地址
	const API_BASE_URL = 'http://localhost:3000' 

	// --- 2. 获取资源列表数据 ---
	const fetchResources = () => {
		uni.showNavigationBarLoading()
		uni.request({
			url: `${API_BASE_URL}/api/resource/list`,
			method: 'GET',
			data: {
				userId: currentUserId,
				pageNumber: 1,
				pageSize: 50 // 首页暂时拉取前50条，实际开发可做分页
			},
			success: (res) => {
							if (res.data.success && res.data.code === 200) {
								const allResources = res.data.data.list || []
								
								// 1. 筛选视频列表
								videoList.value = allResources.filter(item => {
									const type = (item.type || '').toLowerCase()
									// 👇 就是这里，千万不能漏掉这行！
									const title = (item.title || '').toLowerCase() 
									
									return ['video', 'mp4'].includes(type) || title.endsWith('.mp4')
								})
								
								// 2. 筛选课件列表
								docList.value = allResources.filter(item => {
									const type = (item.type || '').toLowerCase()
									// 👇 还有这里，也不能漏掉这行！
									const title = (item.title || '').toLowerCase() 
									
									// 如果已经是视频了，就不要放到课件里了
									if (title.endsWith('.mp4')) return false; 
									
									return ['pdf', 'ppt', 'pptx', 'note', 'txt'].includes(type) || 
										   title.endsWith('.pdf') || 
										   title.endsWith('.ppt') || 
										   title.endsWith('.pptx')
								})
								
							} else {
								uni.showToast({ title: res.data.msg || '获取列表失败', icon: 'none' })
							}
						},
			fail: (err) => {
				console.error('请求失败', err)
				uni.showToast({ title: '网络请求失败', icon: 'none' })
			},
			complete: () => {
				uni.hideNavigationBarLoading()
			}
		})
	}

	// --- 3. 生命周期 ---
	// 每次显示页面时刷新数据（保证上传新文件后首页能更新）
	onShow(() => {
		fetchResources()
	})

	// --- 4. 辅助方法 ---
	
	// 点击跳转到资源详情页 (resourceViewer)
	const goToViewer = (item) => {
		// 传递 resourceId 给你的 resourceViewer.vue
		uni.navigateTo({
			url: `/pages/resourceViewer/resourceViewer?resourceId=${item.resourceId}`
		})
	}

	// 动态获取图标背景色
	const getIconClass = (type) => {
		if (type === 'pdf') return 'pdf-bg'
		if (type === 'ppt') return 'ppt-bg'
		return 'default-bg'
	}

	// 简单的时间格式化 (把 ISO 字符串切出 YYYY-MM-DD)
	const formatDate = (dateString) => {
		if (!dateString) return ''
		return dateString.split('T')[0]
	}

</script>

<style lang="scss" scoped>
	.page-container {
		background-color: #f5f7fa;
		min-height: 100vh;
		padding-bottom: 20px;
	}

	/* 轮播图 */
	.swiper-container {
		height: 180px;
		background-color: #fff;
		.item { height: 100%; }
		.imgs { width: 100%; height: 100%; }
	}

	/* 通用板块样式 */
	.section-box {
		background-color: #ffffff;
		margin: 15px;
		border-radius: 12px;
		padding: 15px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
	}

	.section-header {
		display: flex;
		align-items: center;
		margin-bottom: 15px;
		padding-bottom: 10px;
		border-bottom: 1px solid #f0f0f0;
		
		.section-title {
			font-size: 16px;
			font-weight: bold;
			color: #333;
			margin-left: 8px;
		}
	}
	
	.empty-tip {
		text-align: center;
		color: #999;
		font-size: 14px;
		padding: 20px 0;
	}

	/* 文档列表样式 */
	.material-list {
		.material-item {
			display: flex;
			align-items: center;
			padding: 12px 0;
			border-bottom: 1px dashed #eee;
			
			&:last-child { border-bottom: none; }
			&:active { background-color: #f9f9f9; }

			.icon-wrapper {
				width: 40px;
				height: 40px;
				border-radius: 8px;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right: 12px;
				
				&.pdf-bg {
					background-color: #FFF0F0;
					border: 1px solid #FFDCDC;
					.file-type { color: #F56C6C; font-size: 10px; font-weight: bold; }
				}
				&.ppt-bg {
					background-color: #FFF4E5;
					border: 1px solid #FFE4C4;
					.file-type { color: #E6A23C; font-size: 10px; font-weight: bold; }
				}
				&.default-bg {
					background-color: #E8F4FF;
					border: 1px solid #D1E8FF;
					.file-type { color: #409EFF; font-size: 10px; font-weight: bold; }
				}
			}

			.file-info {
				flex: 1;
				display: flex;
				flex-direction: column;
				.file-name {
					font-size: 14px;
					color: #333;
					margin-bottom: 4px;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 1;
					-webkit-box-orient: vertical;
				}
				.file-size {
					font-size: 12px;
					color: #999;
				}
			}
		}
	}

	/* 视频列表样式 */
	.video-list {
		.video-card {
			margin-bottom: 20px;
			background: #fafafa;
			border-radius: 8px;
			overflow: hidden;
			box-shadow: 0 2px 8px rgba(0,0,0,0.04);
			
			&:last-child { margin-bottom: 0; }
			&:active { opacity: 0.9; }
			
			.video-cover-container {
				width: 100%;
				height: 180px;
				position: relative;
				
				.video-cover {
					width: 100%;
					height: 100%;
					display: block;
				}
				
				.play-mask {
					position: absolute;
					top: 0; left: 0; right: 0; bottom: 0;
					background: rgba(0,0,0,0.2);
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}
			
			.video-info {
				padding: 12px;
				.video-title {
					font-size: 15px;
					font-weight: bold;
					color: #333;
					display: block;
					margin-bottom: 5px;
				}
				.video-desc {
					font-size: 12px;
					color: #999;
				}
			}
		}
	}
</style>
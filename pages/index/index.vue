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
				<text class="section-title">课程PPT</text>
			</view>
			
			<view class="material-list">
				<view v-for="(item, index) in pdfList" :key="index" class="material-item" @click="openPdf(item)">
					<view class="icon-wrapper pdf-bg">
						<text class="file-type">PDF</text>
					</view>
					<view class="file-info">
						<text class="file-name">{{ item.title }}</text>
						<text class="file-size">{{ item.size }} • {{ item.date }}</text>
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
				<view v-for="(item, index) in videoList" :key="index" class="video-card">
					<video 
						:id="'myVideo'+index" 
						class="video-player" 
						:src="item.path" 
						:poster="item.poster"
						controls
						:show-fullscreen-btn="true"
					></video>
					<view class="video-info">
						<text class="video-title">{{ item.title }}</text>
						<text class="video-desc">{{ item.desc }}</text>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script setup>
	import { ref } from 'vue'

	// --- 1. 本地轮播图数据 ---
	const bannerList = ref([
		'/static/banner/b1.jpg', // 请确保static目录下有这些图片，否则显示空白
		'/static/banner/b2.jpg'
	])

	// --- 2. 本地 PDF 列表数据 ---
	const pdfList = ref([
		{ 
			title: '计算机组成原理.pdf', 
			path: '/static/materials/计算机组成原理.pdf', // 对应 static 目录
			size: '2.5MB', 
			date: '2025-10-24' 
		},
		{ 
			title: '计算机网络.pdf', 
			path: '/static/materials/计算机网络.pdf', 
			size: '1.8MB', 
			date: '2025-10-20' 
		}
	])

	// --- 3. 本地视频列表数据 ---
	const videoList = ref([
		{
			title: '第一章：数据包传输',
			desc: '实验操作',
			path: '/static/video/计网实验第1课.mp4', // 对应 static 目录
			poster: '/static/banner/b1.jpg'    // 视频封面
		},
		{
			title: '第二章：网络搭建',
			desc: '实验操作',
			path: '/static/video/计网实验第2课.mp4',
			poster: '/static/banner/b2.jpg'
		}
	])

	// --- 方法：打开 PDF ---
	const openPdf = (item) => {
		// #ifdef H5
		// H5 环境直接新窗口打开
		window.open(item.path);
		// #endif

		// #ifdef MP-WEIXIN || APP-PLUS
		// 小程序或App需使用 openDocument
		// 注意：在小程序中打开本地 static 文件可能有兼容性限制
		// 通常做法是先 downloadFile (哪怕是本地) 获取临时路径，或者直接使用路径
		uni.showLoading({ title: '打开中...' });
		
		uni.openDocument({
			filePath: item.path, // 尝试直接使用相对路径 (部分真机可能需要改为绝对路径或下载)
			showMenu: true,
			success: function () {
				uni.hideLoading();
				console.log('打开文档成功');
			},
			fail: function (err) {
				uni.hideLoading();
				console.error(err);
				
				// 备用方案：如果相对路径打不开，尝试模拟下载（实际开发中通常文件在服务器）
				uni.showToast({
					title: '本地预览模式: ' + item.title,
					icon: 'none'
				})
			}
		});
		// #endif
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

	/* PDF 列表样式 */
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
					.file-type {
						color: #F56C6C;
						font-size: 10px;
						font-weight: bold;
					}
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
					// 超出省略
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
			
			&:last-child { margin-bottom: 0; }
			
			.video-player {
				width: 100%;
				height: 180px;
				display: block;
			}
			
			.video-info {
				padding: 10px;
				.video-title {
					font-size: 15px;
					font-weight: bold;
					color: #333;
					display: block;
					margin-bottom: 5px;
				}
				.video-desc {
					font-size: 12px;
					color: #666;
				}
			}
		}
	}
</style>
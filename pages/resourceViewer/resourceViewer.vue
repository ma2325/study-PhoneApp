<template>
	<view class="viewer-page">
		
		<!-- 顶部工具栏 -->
		<view class="toolbar">
			<view class="toolbar-left">
				<uv-icon name="arrow-left" size="22" color="#fff" @click="goBack"></uv-icon>
				<text class="resource-title">{{ resourceInfo.title }}</text>
			</view>
			<view class="toolbar-right">
				<uv-tag :text="getTypeName(resourceInfo.type)" size="mini" type="warning"></uv-tag>
			</view>
		</view>

		<!-- 主内容区 -->
		<view class="content-wrapper">
			<!-- 资源显示区 -->
			<view class="resource-area" :class="{ 'with-sidebar': showKnowledgeBar }">
				<!-- PPT 预览 -->
				<view v-if="resourceInfo.type === 'ppt'" class="ppt-viewer">
					<swiper 
						class="ppt-swiper" 
						:current="currentPage" 
						@change="onPageChange"
						:indicator-dots="false"
					>
						<swiper-item v-for="(page, index) in pptPages" :key="index">
							<view class="ppt-page">
								<image :src="page.image" mode="aspectFit" class="ppt-image"></image>
								<view class="page-indicator">{{ index + 1 }} / {{ pptPages.length }}</view>
							</view>
						</swiper-item>
					</swiper>
					
					<view class="ppt-controls">
						<uv-button 
							text="上一页" 
							size="small" 
							:disabled="currentPage === 0"
							@click="prevPage"
						></uv-button>
						<text class="page-info">第 {{ currentPage + 1 }} 页 / 共 {{ pptPages.length }} 页</text>
						<uv-button 
							text="下一页" 
							size="small"
							:disabled="currentPage === pptPages.length - 1"
							@click="nextPage"
						></uv-button>
					</view>
				</view>

				<!-- 视频播放 -->
				<view v-else-if="resourceInfo.type === 'video'" class="video-viewer">
					<video 
						:src="resourceInfo.url" 
						class="video-player"
						controls
						:initial-time="currentTime"
						@timeupdate="onVideoTimeUpdate"
						@loadedmetadata="onVideoLoaded"
						id="myVideo"
					></video>
					
					<view class="video-info">
						<text class="time-display">{{ formatTime(currentTime) }} / {{ formatTime(videoDuration) }}</text>
					</view>
				</view>

				<!-- 音频播放 -->
				<view v-else-if="resourceInfo.type === 'audio'" class="audio-viewer">
					<view class="audio-container">
						<view class="audio-cover">
							<uv-icon name="volume" size="80" color="#667eea"></uv-icon>
						</view>
						
						<view class="audio-info-box">
							<text class="audio-title">{{ resourceInfo.title }}</text>
							<text class="audio-duration">时长：{{ resourceInfo.duration }}</text>
						</view>
						
						<view class="audio-progress">
							<slider 
								:value="audioProgress" 
								@changing="onAudioSliderChange"
								@change="onAudioSliderChangeEnd"
								activeColor="#667eea"
								backgroundColor="#e0e0e0"
								block-size="16"
							></slider>
							<view class="progress-time">
								<text>{{ formatTime(currentTime) }}</text>
								<text>{{ formatTime(audioDuration) }}</text>
							</view>
						</view>
						
						<view class="audio-controls">
							<uv-button 
								:text="isPlaying ? '暂停' : '播放'" 
								type="primary"
								@click="toggleAudioPlay"
								size="large"
								:customStyle="{ width: '200px' }"
							></uv-button>
						</view>
					</view>
				</view>

				<!-- 笔记/PDF 预览 -->
				<view v-else-if="resourceInfo.type === 'note'" class="note-viewer">
					<scroll-view 
						scroll-y 
						class="note-scroll"
						:scroll-into-view="scrollToId"
						@scroll="onNoteScroll"
					>
						<view v-for="(section, index) in noteSections" :key="index" 
							:id="'section-' + index"
							class="note-section">
							<view class="section-title">{{ section.title }}</view>
							<view class="section-content">{{ section.content }}</view>
						</view>
					</scroll-view>
					
					<view class="note-info">
						<text>第 {{ currentSection + 1 }} 节 / 共 {{ noteSections.length }} 节</text>
					</view>
				</view>
			</view>

			<!-- 知识点进度条侧边栏 -->
			<view v-if="showKnowledgeBar" class="knowledge-sidebar">
				<view class="sidebar-header">
					<uv-icon name="tags-fill" size="18" color="#667eea"></uv-icon>
					<text class="sidebar-title">知识点导航</text>
					<uv-icon 
						name="close" 
						size="18" 
						color="#909399" 
						@click="toggleKnowledgeBar"
						class="close-btn"
					></uv-icon>
				</view>

				<view class="knowledge-timeline">
					<view 
						v-for="(point, index) in knowledgePoints" 
						:key="index"
						class="timeline-item"
						:class="{ active: isPointActive(point) }"
						@click="jumpToPoint(point)"
					>
						<view class="timeline-dot"></view>
						<view class="timeline-content">
							<text class="point-name">{{ point.name }}</text>
							<text class="point-position">{{ getPositionText(point) }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部控制栏 -->
		<view class="bottom-bar">
			<view class="bar-item" @click="toggleKnowledgeBar">
				<uv-icon :name="showKnowledgeBar ? 'eye-off' : 'eye'" size="20" color="#667eea"></uv-icon>
				<text class="bar-text">{{ showKnowledgeBar ? '隐藏导航' : '显示导航' }}</text>
			</view>
			
			<view class="bar-item" @click="showProgress">
				<uv-icon name="list" size="20" color="#667eea"></uv-icon>
				<text class="bar-text">进度概览</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			resourceInfo: {},
			knowledgeName: '',
			
			// 通用状态
			showKnowledgeBar: true,
			currentTime: 0,
			
			// PPT 相关
			currentPage: 0,
			pptPages: [],
			
			// 视频相关
			videoDuration: 0,
			videoContext: null,
			
			// 音频相关
			audioDuration: 0,
			audioProgress: 0,
			isPlaying: false,
			audioContext: null,
			
			// 笔记相关
			currentSection: 0,
			scrollToId: '',
			noteSections: [],
			
			// 知识点标记（AI识别的位置）
			knowledgePoints: []
		};
	},
	
	onLoad(options) {
		// 解析传递的参数
		if (options.resource) {
			this.resourceInfo = JSON.parse(decodeURIComponent(options.resource));
		}
		if (options.knowledgeName) {
			this.knowledgeName = decodeURIComponent(options.knowledgeName);
		}
		if (options.initialPage) {
					this.currentPage = parseInt(options.initialPage);
					console.log('检测到指定页码跳转，目标索引:', this.currentPage);
				}
		if (options.targetPosition) {
			// 如果传递了目标位置，自动定位
			const position = JSON.parse(decodeURIComponent(options.targetPosition));
			this.jumpToPosition(position);
		}
		
		this.initResource();
		this.loadKnowledgePoints();
	},
	
	onReady() {
		// 初始化媒体组件
		if (this.resourceInfo.type === 'video') {
			this.videoContext = uni.createVideoContext('myVideo', this);
		} else if (this.resourceInfo.type === 'audio') {
			this.audioContext = uni.createInnerAudioContext();
			this.audioContext.src = this.resourceInfo.url;
			this.audioContext.onTimeUpdate(() => {
				this.currentTime = this.audioContext.currentTime;
				this.audioProgress = (this.currentTime / this.audioDuration) * 100;
			});
			this.audioContext.onEnded(() => {
				this.isPlaying = false;
			});
			this.audioContext.onCanplay(() => {
				this.audioDuration = this.audioContext.duration;
			});
		}
	},
	
	onUnload() {
		// 清理资源
		if (this.audioContext) {
			this.audioContext.destroy();
		}
	},
	
	methods: {
		// 初始化资源数据
		initResource() {
			if (this.resourceInfo.type === 'ppt') {
				// 模拟 PPT 页面数据（实际应从服务器获取）
				const pageCount = this.resourceInfo.pages || 10;
				this.pptPages = Array.from({ length: pageCount }, (_, i) => ({
					image: `/static/ppt-preview/PPT${i + 1}.JPG`,
					pageNumber: i + 1
				}));
			} else if (this.resourceInfo.type === 'note') {
				// 模拟笔记章节数据
				this.noteSections = [
					{
						title: '1. 定义与基本概念',
						content: '这是第一部分的详细内容，包含了基本定义和核心概念的讲解...\n\n在这一节中，我们将深入探讨相关的基础知识。'
					},
					{
						title: '2. 重要定理',
						content: '本节介绍核心定理及其证明过程...\n\n定理的应用场景非常广泛，需要重点掌握。'
					},
					{
						title: '3. 典型例题',
						content: '通过实际例题来加深理解...\n\n例题1：...\n解析：...'
					},
					{
						title: '4. 易错点分析',
						content: '常见的易错点包括...\n\n需要特别注意的地方有：...'
					},
					{
						title: '5. 总结与拓展',
						content: '本章内容总结...\n\n进一步的学习资源推荐：...'
					}
				];
			}
		},
		
		// 加载知识点标记（AI识别的位置）
		loadKnowledgePoints() {
			// 模拟 AI 识别出的知识点在资源中的位置
			if (this.resourceInfo.type === 'ppt') {
				this.knowledgePoints = [
					{ name: 'CPU寄存器', position: 1, type: 'page' },
					{ name: '指令周期', position: 3, type: 'page' },
					{ name: '微指令', position: 7, type: 'page' }
				];
			} else if (this.resourceInfo.type === 'video') {
				this.knowledgePoints = [
					{ name: '引言', position: 0, type: 'time' },
					{ name: '理论讲解', position: 120, type: 'time' }, // 2分钟
					{ name: '例题演示', position: 280, type: 'time' }, // 4分40秒
					{ name: '总结', position: 420, type: 'time' } // 7分钟
				];
				this.videoDuration = 480; // 8分钟
			} else if (this.resourceInfo.type === 'audio') {
				this.knowledgePoints = [
					{ name: '知识点1', position: 60, type: 'time' },
					{ name: '知识点2', position: 180, type: 'time' },
					{ name: '知识点3', position: 300, type: 'time' }
				];
				this.audioDuration = 420; // 7分钟
			} else if (this.resourceInfo.type === 'note') {
				this.knowledgePoints = [
					{ name: '基本概念', position: 0, type: 'section' },
					{ name: '重要定理', position: 1, type: 'section' },
					{ name: '典型例题', position: 2, type: 'section' }
				];
			}
		},
		
		// PPT 翻页
		prevPage() {
			if (this.currentPage > 0) {
				this.currentPage--;
			}
		},
		
		nextPage() {
			if (this.currentPage < this.pptPages.length - 1) {
				this.currentPage++;
			}
		},
		
		onPageChange(e) {
			this.currentPage = e.detail.current;
		},
		
		// 视频时间更新
		onVideoTimeUpdate(e) {
			this.currentTime = e.detail.currentTime;
		},
		
		onVideoLoaded(e) {
			this.videoDuration = e.detail.duration;
		},
		
		// 音频控制
		toggleAudioPlay() {
			if (this.isPlaying) {
				this.audioContext.pause();
				this.isPlaying = false;
			} else {
				this.audioContext.play();
				this.isPlaying = true;
			}
		},
		
		onAudioSliderChange(e) {
			const time = (e.detail.value / 100) * this.audioDuration;
			this.currentTime = time;
		},
		
		onAudioSliderChangeEnd(e) {
			const time = (e.detail.value / 100) * this.audioDuration;
			this.audioContext.seek(time);
		},
		
		// 笔记滚动
		onNoteScroll(e) {
			// 根据滚动位置更新当前章节
			const scrollTop = e.detail.scrollTop;
			// 简化处理：假设每个章节高度相等
			this.currentSection = Math.floor(scrollTop / 300);
		},
		
		// 跳转到指定知识点
		jumpToPoint(point) {
			if (point.type === 'page') {
				// PPT 跳转到指定页
				this.currentPage = point.position;
			} else if (point.type === 'time') {
				// 视频/音频跳转到指定时间
				if (this.resourceInfo.type === 'video' && this.videoContext) {
					this.videoContext.seek(point.position);
				} else if (this.resourceInfo.type === 'audio' && this.audioContext) {
					this.audioContext.seek(point.position);
					this.currentTime = point.position;
				}
			} else if (point.type === 'section') {
				// 笔记跳转到指定章节
				this.scrollToId = `section-${point.position}`;
				this.currentSection = point.position;
			}
			
			uni.showToast({
				title: `已跳转到：${point.name}`,
				icon: 'success',
				duration: 1500
			});
		},
		
		// 通用跳转方法
		jumpToPosition(position) {
			const point = this.knowledgePoints.find(p => p.position === position.value);
			if (point) {
				this.jumpToPoint(point);
			}
		},
		
		// 判断知识点是否激活
		isPointActive(point) {
			if (point.type === 'page') {
				return this.currentPage === point.position;
			} else if (point.type === 'time') {
				return Math.abs(this.currentTime - point.position) < 5; // 5秒内算激活
			} else if (point.type === 'section') {
				return this.currentSection === point.position;
			}
			return false;
		},
		
		// 获取位置文本
		getPositionText(point) {
			if (point.type === 'page') {
				return `第 ${point.position + 1} 页`;
			} else if (point.type === 'time') {
				return this.formatTime(point.position);
			} else if (point.type === 'section') {
				return `第 ${point.position + 1} 节`;
			}
			return '';
		},
		
		// 格式化时间
		formatTime(seconds) {
			const min = Math.floor(seconds / 60);
			const sec = Math.floor(seconds % 60);
			return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
		},
		
		// 切换知识点侧边栏
		toggleKnowledgeBar() {
			this.showKnowledgeBar = !this.showKnowledgeBar;
		},
		
		// 显示进度概览
		showProgress() {
			const total = this.knowledgePoints.length;
			const viewed = this.knowledgePoints.filter(p => this.isPointActive(p)).length;
			
			uni.showModal({
				title: '学习进度',
				content: `已学习 ${viewed} / ${total} 个知识点\n进度：${Math.round((viewed / total) * 100)}%`,
				showCancel: false
			});
		},
		
		// 获取资源类型名称
		getTypeName(type) {
			const nameMap = {
				'ppt': 'PPT',
				'video': '视频',
				'note': '笔记',
				'audio': '音频'
			};
			return nameMap[type] || '资源';
		},
		
		// 返回上一页
		goBack() {
			uni.navigateBack();
		}
	}
};
</script>

<style lang="scss" scoped>
.viewer-page {
	width: 100vw;
	height: 100vh;
	background: #1a1a1a;
	display: flex;
	flex-direction: column;
}

.toolbar {
	height: 50px;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 15px;
	
	.toolbar-left {
		display: flex;
		align-items: center;
		flex: 1;
		
		.resource-title {
			margin-left: 10px;
			color: white;
			font-size: 16px;
			font-weight: 500;
		}
	}
	
	.toolbar-right {
		display: flex;
		align-items: center;
	}
}

.content-wrapper {
	flex: 1;
	display: flex;
	overflow: hidden;
}

.resource-area {
	flex: 1;
	background: #2a2a2a;
	position: relative;
	
	&.with-sidebar {
		width: calc(100% - 280px);
	}
}

// PPT 样式
.ppt-viewer {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	
	.ppt-swiper {
		flex: 1;
	}
	
	.ppt-page {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		
		.ppt-image {
			width: 100%;
			height: 100%;
		}
		
		.page-indicator {
			position: absolute;
			bottom: 20px;
			right: 20px;
			background: rgba(0, 0, 0, 0.6);
			color: white;
			padding: 5px 15px;
			border-radius: 20px;
			font-size: 12px;
		}
	}
	
	.ppt-controls {
		height: 60px;
		background: #1a1a1a;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 20px;
		
		.page-info {
			color: #fff;
			font-size: 14px;
		}
	}
}

// 视频样式
.video-viewer {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	
	.video-player {
		flex: 1;
		width: 100%;
	}
	
	.video-info {
		height: 40px;
		background: #1a1a1a;
		display: flex;
		align-items: center;
		justify-content: center;
		
		.time-display {
			color: #fff;
			font-size: 14px;
		}
	}
}

// 音频样式
.audio-viewer {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	
	.audio-container {
		width: 80%;
		max-width: 500px;
		
		.audio-cover {
			width: 200px;
			height: 200px;
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 0 auto 30px;
		}
		
		.audio-info-box {
			text-align: center;
			margin-bottom: 30px;
			
			.audio-title {
				display: block;
				color: #fff;
				font-size: 18px;
				font-weight: bold;
				margin-bottom: 10px;
			}
			
			.audio-duration {
				display: block;
				color: #999;
				font-size: 14px;
			}
		}
		
		.audio-progress {
			margin-bottom: 30px;
			
			.progress-time {
				display: flex;
				justify-content: space-between;
				margin-top: 10px;
				
				text {
					color: #999;
					font-size: 12px;
				}
			}
		}
		
		.audio-controls {
			display: flex;
			justify-content: center;
		}
	}
}

// 笔记样式
.note-viewer {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	
	.note-scroll {
		flex: 1;
		padding: 20px;
	}
	
	.note-section {
		margin-bottom: 30px;
		background: #333;
		border-radius: 8px;
		padding: 20px;
		
		.section-title {
			color: #667eea;
			font-size: 18px;
			font-weight: bold;
			margin-bottom: 15px;
		}
		
		.section-content {
			color: #ddd;
			font-size: 15px;
			line-height: 1.8;
			white-space: pre-wrap;
		}
	}
	
	.note-info {
		height: 40px;
		background: #1a1a1a;
		display: flex;
		align-items: center;
		justify-content: center;
		
		text {
			color: #fff;
			font-size: 14px;
		}
	}
}

// 知识点侧边栏
.knowledge-sidebar {
	width: 280px;
	background: #222;
	border-left: 1px solid #333;
	display: flex;
	flex-direction: column;
	
	.sidebar-header {
		height: 50px;
		display: flex;
		align-items: center;
		padding: 0 15px;
		border-bottom: 1px solid #333;
		
		.sidebar-title {
			flex: 1;
			margin-left: 8px;
			color: #fff;
			font-size: 15px;
			font-weight: 500;
		}
		
		.close-btn {
			cursor: pointer;
		}
	}
	
	.knowledge-timeline {
		flex: 1;
		padding: 20px 15px;
		overflow-y: auto;
	}
	
	.timeline-item {
		position: relative;
		padding-left: 30px;
		padding-bottom: 25px;
		cursor: pointer;
		
		&:not(:last-child)::before {
			content: '';
			position: absolute;
			left: 6px;
			top: 20px;
			bottom: -5px;
			width: 2px;
			background: #444;
		}
		
		.timeline-dot {
			position: absolute;
			left: 0;
			top: 5px;
			width: 14px;
			height: 14px;
			background: #444;
			border-radius: 50%;
			transition: all 0.3s;
		}
		
		.timeline-content {
			display: flex;
			flex-direction: column;
			
			.point-name {
				color: #ddd;
				font-size: 14px;
				margin-bottom: 5px;
			}
			
			.point-position {
				color: #999;
				font-size: 12px;
			}
		}
		
		&.active {
			.timeline-dot {
				background: #667eea;
				box-shadow: 0 0 10px rgba(102, 126, 234, 0.6);
				transform: scale(1.3);
			}
			
			.point-name {
				color: #667eea;
				font-weight: bold;
			}
		}
		
		&:hover {
			.timeline-dot {
				background: #667eea;
			}
			
			.point-name {
				color: #667eea;
			}
		}
	}
}

// 底部控制栏
.bottom-bar {
	height: 60px;
	background: #1a1a1a;
	border-top: 1px solid #333;
	display: flex;
	align-items: center;
	justify-content: space-around;
	
	.bar-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		cursor: pointer;
		
		.bar-text {
			color: #ddd;
			font-size: 12px;
			margin-top: 5px;
		}
		
		&:active {
			opacity: 0.7;
		}
	}
}
</style>

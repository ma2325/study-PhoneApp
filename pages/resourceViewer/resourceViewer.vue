<template>
	<view class="viewer-page">
		
		<view class="toolbar">
			<view class="toolbar-left">
				<uv-icon name="arrow-left" size="22" color="#fff" @click="goBack"></uv-icon>
				<text class="resource-title">{{ resourceInfo.title || '资源预览' }}</text>
			</view>
			<view class="toolbar-right">
				<uv-tag :text="getTypeName(resourceInfo.type)" size="mini" type="warning"></uv-tag>
			</view>
		</view>

		<view class="content-wrapper">
			<view class="resource-area" :class="{ 'with-sidebar': showKnowledgeBar }">
				
				<view v-if="['pdf', 'ppt', 'pptx', 'doc', 'docx'].includes((resourceInfo.type || '').toLowerCase())" class="doc-viewer">
					<view class="doc-placeholder">
						<view class="icon-circle">
							<uv-icon :name="resourceInfo.type === 'pdf' ? 'file-text-fill' : 'grid-fill'" size="60" color="#fff"></uv-icon>
						</view>
						<text class="doc-tip">{{ resourceInfo.title }}</text>
						<text class="doc-sub-tip">小程序暂不支持直接内嵌显示此格式</text>
						<uv-button 
							text="全屏打开文档" 
							type="primary" 
							shape="circle" 
							@click="openNativeDocument"
							:customStyle="{ marginTop: '30px', width: '180px' }"
						></uv-button>
						<text v-if="targetPage > 1" class="page-hint">🎯 建议您翻阅至第 {{ targetPage }} 页查看相关知识点</text>
					</view>
				</view>

				<view v-else-if="['video', 'mp4', 'other'].includes((resourceInfo.type || '').toLowerCase())" class="video-viewer">
					<video 
						v-if="resourceInfo.url"
						:src="resourceInfo.url" 
						class="video-player"
						controls
						:initial-time="currentTime"
						@timeupdate="onVideoTimeUpdate"
						@loadedmetadata="onVideoLoaded"
						id="myVideo"
					></video>
					<view v-else class="doc-placeholder">
						<uv-icon name="play-circle" size="60" color="#666"></uv-icon>
						<text class="doc-sub-tip">暂无视频播放地址</text>
					</view>
				</view>

				<view v-else class="doc-viewer">
					<view class="doc-placeholder">
						<text class="doc-sub-tip">暂不支持预览该格式资源</text>
					</view>
				</view>
			</view>

			<view v-if="showKnowledgeBar" class="knowledge-sidebar">
				<view class="sidebar-header">
					<uv-icon name="tags-fill" size="18" color="#667eea"></uv-icon>
					<text class="sidebar-title">知识点导航</text>
					<uv-icon name="close" size="18" color="#909399" @click="toggleKnowledgeBar" class="close-btn"></uv-icon>
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

		<view class="bottom-bar">
			<view class="bar-item" @click="toggleKnowledgeBar">
				<uv-icon :name="showKnowledgeBar ? 'eye-off' : 'eye'" size="20" color="#667eea"></uv-icon>
				<text class="bar-text">{{ showKnowledgeBar ? '隐藏导航' : '显示导航' }}</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			resourceInfo: {
				title: '',
				type: '',
				url: ''
			},
			resourceId: '', 
			userId: 'test001',
			API_BASE_URL: 'http://localhost:3000',
			
			// 状态
			showKnowledgeBar: true,
			targetPage: 1, // AI 溯源传递过来的目标页码
			currentTime: 0,
			videoDuration: 0,
			videoContext: null,
			knowledgePoints: []
		};
	},
	
	onLoad(options) {
		console.log('Viewer options:', options);

		// 1. 接收 AI 溯源传递过来的初始页码
		if (options.initialPage) {
			this.targetPage = parseInt(options.initialPage);
		}

		// 2. 接收 fileName (如果是从 RAG 检索跳过来的，因为 RAG 接口没返回 resourceId)
		if (options.fileName) {
			const fileName = decodeURIComponent(options.fileName);
			this.resourceInfo = {
				title: fileName,
				type: this.guessFileType(fileName),
				// 【兜底逻辑】：如果后端没有返回真实 URL，我们在本地找同名文件测试
				url: `/static/materials/${fileName}` 
			};
			this.loadMockKnowledge(fileName);
			return;
		}

		// 3. 接收 resourceId (如果是从首页资源列表跳过来的)
		if (options.resourceId) {
			this.resourceId = options.resourceId;
			this.fetchResourceInfo(this.resourceId);
			return;
		}

		// 4. 兼容最老版本的对象传参
		if (options.resource) {
			this.resourceInfo = JSON.parse(decodeURIComponent(options.resource));
		}
	},
	
	onReady() {
		if (['video', 'mp4', 'other'].includes((this.resourceInfo.type || '').toLowerCase())) {
			this.videoContext = uni.createVideoContext('myVideo', this);
		}
	},
	
	methods: {
		// 根据后缀名猜测类型
		guessFileType(fileName) {
			if (!fileName) return 'other';
			const ext = fileName.split('.').pop().toLowerCase();
			if (['mp4', 'avi'].includes(ext)) return 'video';
			return ext;
		},

		// 获取资源详情 (从首页跳过来时调用)
		fetchResourceInfo(resourceId) {
			uni.showLoading({ title: '加载中...' });
			uni.request({
				url: `${this.API_BASE_URL}/api/resource/info`, 
				method: 'GET',
				data: { userId: this.userId, resourceId: resourceId },
				success: (res) => {
					if (res.data.success && res.data.code === 200) {
						const backendData = res.data.data;
						this.resourceInfo = {
							id: backendData.resourceId,
							title: backendData.fileName,
							type: this.guessFileType(backendData.fileName),
							// 兜底：如果后端没给真实 url，尝试去本地 static 下找同名文件
							url: backendData.fileUrl || `/static/materials/${backendData.fileName}`, 
						};
						this.loadMockKnowledge(backendData.fileName);
					} else {
						uni.showToast({ title: '资源不存在', icon: 'none' });
					}
				},
				complete: () => uni.hideLoading()
			});
		},
		
		// 打开原生文档查看器 (重点功能)
		openNativeDocument() {
			if (!this.resourceInfo.url) {
				return uni.showToast({ title: '文件地址不存在', icon: 'none' });
			}

			const filePath = this.resourceInfo.url;
			uni.showLoading({ title: '正在打开文档...' });

			// 如果是网络地址(http开头)，必须先 downloadFile；如果是本地静态路径(/static)，可直接 openDocument。
			// 这里为了最强兼容性，统一走一遍 downloadFile
			uni.downloadFile({
				url: filePath,
				success: (res) => {
					if (res.statusCode === 200) {
						uni.openDocument({
							filePath: res.tempFilePath,
							showMenu: true,
							success: () => uni.hideLoading(),
							fail: (err) => {
								uni.hideLoading();
								console.error(err);
								uni.showToast({ title: '文档格式可能不支持', icon: 'none' });
							}
						});
					} else {
						uni.hideLoading();
						uni.showToast({ title: '文件加载失败', icon: 'none' });
					}
				},
				fail: () => {
					// 下载失败的话，尝试把它当成本地相对路径直接打开
					uni.openDocument({
						filePath: filePath,
						success: () => uni.hideLoading(),
						fail: () => {
							uni.hideLoading();
							uni.showToast({ title: '找不到该文件', icon: 'none' });
						}
					})
				}
			});
		},

		// --- 以下为原有的辅助方法 ---
		loadMockKnowledge(title) {
			// 加载侧边栏的假数据
			this.knowledgePoints = [
				{ name: '引言与概念', position: 1, type: 'page' },
				{ name: '核心知识解析', position: this.targetPage > 1 ? this.targetPage : 3, type: 'page' },
				{ name: '课后总结', position: 10, type: 'page' }
			];
		},

		onVideoTimeUpdate(e) { this.currentTime = e.detail.currentTime; },
		onVideoLoaded(e) { this.videoDuration = e.detail.duration; },
		
		toggleKnowledgeBar() { this.showKnowledgeBar = !this.showKnowledgeBar; },
		
		jumpToPoint(point) { uni.showToast({ title: '仅作导航演示', icon: 'none' }); },
		isPointActive(point) { return false; },
		getPositionText(point) { return `第 ${point.position} 页/秒`; },
		
		getTypeName(type) {
			const t = (type || '').toLowerCase();
			if (['ppt', 'pptx'].includes(t)) return '课件';
			if (['pdf', 'doc', 'docx'].includes(t)) return '文档';
			if (['video', 'mp4', 'other'].includes(t)) return '视频';
			return '资源';
		},
		goBack() { uni.navigateBack(); }
	}
};
</script>

<style lang="scss" scoped>
.viewer-page {
	width: 100vw; height: 100vh; background: #1a1a1a; display: flex; flex-direction: column;
}

.toolbar {
	height: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: space-between; padding: 0 15px;
	.toolbar-left { display: flex; align-items: center; flex: 1; .resource-title { margin-left: 10px; color: white; font-size: 16px; font-weight: 500; } }
}

.content-wrapper { flex: 1; display: flex; overflow: hidden; }

.resource-area {
	flex: 1; background: #222; position: relative; display: flex; align-items: center; justify-content: center;
	&.with-sidebar { width: calc(100% - 280px); }
}

// 文档占位 UI
.doc-viewer {
	width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;
	.doc-placeholder {
		display: flex; flex-direction: column; align-items: center;
		.icon-circle { width: 100px; height: 100px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(245, 87, 108, 0.4); }
		.doc-tip { color: #fff; font-size: 18px; font-weight: bold; margin-bottom: 10px; text-align: center; padding: 0 20px;}
		.doc-sub-tip { color: #999; font-size: 14px; }
		.page-hint { margin-top: 20px; color: #E6A23C; font-size: 14px; background: rgba(230, 162, 60, 0.1); padding: 8px 15px; border-radius: 20px;}
	}
}

.video-viewer {
	width: 100%; height: 100%; display: flex; flex-direction: column;
	.video-player { flex: 1; width: 100%; }
}

// 侧边栏
.knowledge-sidebar {
	width: 280px; background: #2a2a2a; border-left: 1px solid #333; display: flex; flex-direction: column;
	.sidebar-header { height: 50px; display: flex; align-items: center; padding: 0 15px; border-bottom: 1px solid #333; .sidebar-title { flex: 1; margin-left: 8px; color: #fff; font-size: 15px; font-weight: 500; } .close-btn { cursor: pointer; } }
	.knowledge-timeline { flex: 1; padding: 20px 15px; overflow-y: auto; }
	.timeline-item {
		position: relative; padding-left: 30px; padding-bottom: 25px; cursor: pointer;
		&:not(:last-child)::before { content: ''; position: absolute; left: 6px; top: 20px; bottom: -5px; width: 2px; background: #444; }
		.timeline-dot { position: absolute; left: 0; top: 5px; width: 14px; height: 14px; background: #444; border-radius: 50%; transition: all 0.3s; }
		.timeline-content { display: flex; flex-direction: column; .point-name { color: #ddd; font-size: 14px; margin-bottom: 5px; } .point-position { color: #999; font-size: 12px; } }
		&.active { .timeline-dot { background: #667eea; box-shadow: 0 0 10px rgba(102, 126, 234, 0.6); transform: scale(1.3); } .point-name { color: #667eea; font-weight: bold; } }
	}
}

.bottom-bar {
	height: 60px; background: #1a1a1a; border-top: 1px solid #333; display: flex; align-items: center; justify-content: space-around;
	.bar-item { display: flex; flex-direction: column; align-items: center; cursor: pointer; .bar-text { color: #ddd; font-size: 12px; margin-top: 5px; } }
}
</style>
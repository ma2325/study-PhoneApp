<template>
	<view class="resource-page">
		<!-- 知识点标题 -->
		<view class="knowledge-header">
			<text class="knowledge-title">{{ knowledgeName }}</text>
			<view class="knowledge-meta">
				<uv-tag text="初中" type="primary" size="mini" shape="circle"></uv-tag>
				<uv-tag :text="subject" type="success" size="mini" shape="circle" customStyle="margin-left: 10px"></uv-tag>
			</view>
		</view>

		<!-- 加载状态 -->
		<view v-if="loading" class="loading-container">
			<uv-loading-icon mode="circle" size="50"></uv-loading-icon>
			<text class="loading-text">正在加载资源...</text>
		</view>

		<!-- 资源列表 -->
		<view v-else-if="resources.length > 0" class="resources-section">
			<view class="section-title">
				<uv-icon name="folder-open" size="22" color="#409EFF"></uv-icon>
				<text class="title-text">学习资源 ({{ resources.length }})</text>
			</view>

			<view class="resource-list">
				<view 
					v-for="(resource, index) in resources" 
					:key="index"
					class="resource-item"
					@click="openResource(resource)"
				>
					<!-- 资源图标 -->
					<view class="resource-icon" :class="'icon-' + resource.type">
						<uv-icon :name="getIconName(resource.type)" size="28" color="#fff"></uv-icon>
					</view>

					<!-- 资源信息 -->
					<view class="resource-info">
						<text class="resource-title">{{ resource.title }}</text>
						<view class="resource-meta">
							<uv-tag :text="getTypeName(resource.type)" size="mini" plain></uv-tag>
							<text class="resource-detail">{{ getResourceDetail(resource) }}</text>
						</view>
						<text v-if="resource.description" class="resource-desc">{{ resource.description }}</text>
					</view>

					<!-- 操作按钮 -->
					<view class="resource-action">
						<uv-icon name="arrow-right" size="20" color="#909399"></uv-icon>
					</view>
				</view>
			</view>
		</view>

		<!-- 空状态 -->
		<view v-else class="empty-container">
			<uv-empty mode="data" text="暂无相关资源"></uv-empty>
		</view>

		<!-- 底部提示 -->
		<view class="footer-tip">
			<uv-icon name="info-circle" size="16" color="#909399"></uv-icon>
			<text class="tip-text">点击资源即可查看详情（演示模式）</text>
		</view>
	</view>
</template>

<script>
import { mockGetResources } from '../../common/mock.js';

export default {
	data() {
		return {
			knowledgeId: '',
			knowledgeName: '',
			subject: '',
			resources: [],
			loading: true
		};
	},
	
	onLoad(options) {
		if (options.id) {
			this.knowledgeId = options.id;
		}
		if (options.name) {
			this.knowledgeName = decodeURIComponent(options.name);
		}
		
		this.loadResources();
	},
	
	methods: {
		// 加载资源
		async loadResources() {
			this.loading = true;
			try {
				const result = await mockGetResources(this.knowledgeId);
				if (result.success && result.data) {
					this.resources = result.data.resources || [];
					this.subject = result.data.subject || '未知';
				} else {
					uni.showToast({
						title: '加载失败',
						icon: 'none'
					});
				}
			} catch (error) {
				console.error('加载资源失败:', error);
				uni.showToast({
					title: '加载失败',
					icon: 'none'
				});
			} finally {
				this.loading = false;
			}
		},

		// 获取资源类型图标
		getIconName(type) {
			const iconMap = {
				'ppt': 'file-text',
				'video': 'play-circle',
				'note': 'edit-pen',
				'audio': 'volume'
			};
			return iconMap[type] || 'file';
		},

		// 获取资源类型名称
		getTypeName(type) {
			const nameMap = {
				'ppt': 'PPT课件',
				'video': '视频',
				'note': '笔记',
				'audio': '音频'
			};
			return nameMap[type] || '未知';
		},

		// 获取资源详细信息
		getResourceDetail(resource) {
			if (resource.duration) {
				return ` · ${resource.duration}`;
			}
			if (resource.pages) {
				return ` · ${resource.pages}页`;
			}
			return '';
		},

		// 打开资源
		openResource(resource) {
			// 1. 定义默认参数
			let urlParams = `resource=${encodeURIComponent(JSON.stringify(resource))}&knowledgeName=${encodeURIComponent(this.knowledgeName)}`;
			
			// 2.针对特定知识点的 PPT 跳转逻辑
			if (resource.type === 'ppt') {
				let targetIndex = 0; // 默认第1页 (索引0)
				
				// 逻辑：如果知识点是"直接编码"，跳转到第7页(索引6)
				if (this.knowledgeName === '直接编码') {
					targetIndex = 6; 
				} 
				// 逻辑：如果知识点是"字段直接编码"，跳转到第8页(索引7)
				else if (this.knowledgeName === '字段直接编码') {
					targetIndex = 7;
				}
				
				// 只有当需要跳转时才追加参数
				if (targetIndex > 0) {
					urlParams += `&initialPage=${targetIndex}`;
				}
			}
			uni.navigateTo({
				url: `/pages/resourceViewer/resourceViewer?${urlParams}`
			});
		
		}
	}
};
</script>

<style lang="scss" scoped>
.resource-page {
	min-height: 100vh;
	background: #f5f7fa;
	padding: 20px;
}

.knowledge-header {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	border-radius: 16px;
	padding: 25px 20px;
	margin-bottom: 25px;
	box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
	
	.knowledge-title {
		font-size: 20px;
		font-weight: bold;
		color: white;
		line-height: 1.4;
		display: block;
		margin-bottom: 12px;
	}
	
	.knowledge-meta {
		display: flex;
		align-items: center;
	}
}

.loading-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 80px 0;
	
	.loading-text {
		margin-top: 20px;
		font-size: 14px;
		color: #909399;
	}
}

.resources-section {
	.section-title {
		display: flex;
		align-items: center;
		margin-bottom: 15px;
		
		.title-text {
			margin-left: 8px;
			font-size: 16px;
			font-weight: bold;
			color: #303133;
		}
	}
}

.resource-list {
	.resource-item {
		background: white;
		border-radius: 12px;
		padding: 15px;
		margin-bottom: 12px;
		display: flex;
		align-items: center;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
		transition: all 0.3s;
		
		&:active {
			transform: scale(0.98);
			box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
		}
		
		.resource-icon {
			width: 50px;
			height: 50px;
			border-radius: 12px;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-right: 12px;
			flex-shrink: 0;
			
			&.icon-ppt {
				background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
			}
			
			&.icon-video {
				background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
			}
			
			&.icon-note {
				background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
			}
			
			&.icon-audio {
				background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
			}
		}
		
		.resource-info {
			flex: 1;
			min-width: 0;
			
			.resource-title {
				font-size: 15px;
				font-weight: 500;
				color: #303133;
				display: block;
				margin-bottom: 6px;
			}
			
			.resource-meta {
				display: flex;
				align-items: center;
				margin-bottom: 4px;
				
				.resource-detail {
					font-size: 12px;
					color: #909399;
					margin-left: 6px;
				}
			}
			
			.resource-desc {
				font-size: 12px;
				color: #909399;
				line-height: 1.4;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				overflow: hidden;
			}
		}
		
		.resource-action {
			margin-left: 10px;
			flex-shrink: 0;
		}
	}
}

.empty-container {
	padding: 80px 0;
}

.footer-tip {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 20px 0;
	margin-top: 20px;
	
	.tip-text {
		margin-left: 6px;
		font-size: 12px;
		color: #909399;
	}
}
</style>

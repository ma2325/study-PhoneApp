<template>
	<view class="scan-page">
		<!-- 顶部标题区 -->
		<view class="header-section">
			<view class="title-area">
				<uv-icon name="scan" size="28" color="#409EFF"></uv-icon>
				<text class="main-title">拍题检索知识点</text>
			</view>
			<text class="subtitle">上传题目图片或输入文字，快速定位相关知识点</text>
		</view>

		<!-- 上传/输入区域 -->
		<view class="input-section">
			<!-- 图片上传 -->
			<view class="upload-area" @click="chooseImage">
				<view v-if="!uploadedImage" class="upload-placeholder">
					<uv-icon name="camera-fill" size="50" color="#c0c4cc"></uv-icon>
					<text class="upload-tip">点击拍照或上传题目图片</text>
					<text class="upload-hint">支持 JPG、PNG 格式</text>
				</view>
				<view v-else class="uploaded-container">
					<image :src="uploadedImage" class="uploaded-img" mode="aspectFit"></image>
					<view class="image-actions">
						<uv-button text="重新上传" size="small" type="warning" @click.stop="chooseImage"></uv-button>
					</view>
				</view>
			</view>

			<!-- 文字输入 -->
			<view class="text-input-area">
				<view class="input-label">
					<uv-icon name="edit-pen" size="18" color="#606266"></uv-icon>
					<text class="label-text">或直接输入题目文字</text>
				</view>
				<uv-textarea 
					v-model="questionText" 
					placeholder="例如：一个物体在不受外力作用时..."
					:autoHeight="true"
					:maxlength="500"
					count
				></uv-textarea>
			</view>

			<!-- 识别按钮 -->
			<uv-button 
				type="primary" 
				text="开始识别" 
				@click="startRecognition"
				:loading="isRecognizing"
				:disabled="!uploadedImage && !questionText"
				size="large"
				:customStyle="{ marginTop: '20px' }"
			></uv-button>
		</view>

		<!-- 识别结果区域 -->
		<view v-if="recognizedText && !isRecognizing" class="result-section">
			<view class="section-header">
				<uv-icon name="file-text-fill" size="20" color="#67C23A"></uv-icon>
				<text class="section-title">识别结果</text>
			</view>
			<view class="recognized-text-box">
				<text class="recognized-text">{{ recognizedText }}</text>
			</view>
		</view>

		<!-- 知识点匹配结果 -->
		<view v-if="knowledgePoints.length > 0 && !isAnalyzing" class="knowledge-section">
			<view class="section-header">
				<uv-icon name="tags-fill" size="20" color="#E6A23C"></uv-icon>
				<text class="section-title">匹配到的知识点 ({{ knowledgePoints.length }})</text>
			</view>
			
			<view class="knowledge-list">
				<view 
					v-for="(point, index) in knowledgePoints" 
					:key="point.id"
					class="knowledge-item"
					@click="viewResources(point)"
				>
					<view class="knowledge-left">
						<view class="knowledge-badge">{{ index + 1 }}</view>
						<view class="knowledge-info">
							<text class="knowledge-name">{{ point.name }}</text>
						</view>
					</view>
					<uv-icon name="arrow-right" size="18" color="#909399"></uv-icon>
				</view>
			</view>
		</view>

		<!-- 加载状态 -->
		<view v-if="isRecognizing || isAnalyzing" class="loading-section">
			<uv-loading-icon mode="circle" size="50"></uv-loading-icon>
			<text class="loading-text">{{ isRecognizing ? '正在识别图片...' : '正在分析知识点...' }}</text>
		</view>

		<!-- 底部提示 -->
		<view class="footer-tip">
			<uv-icon name="info-circle" size="16" color="#909399"></uv-icon>
			<text class="tip-text">本功能为前端演示版本，使用模拟数据</text>
		</view>
	</view>
</template>

<script>
import { mockOCR, mockMatchKnowledgePoints } from '../../common/mock.js';

export default {
	data() {
		return {
			uploadedImage: '', // 上传的图片路径
			questionText: '', // 用户输入的题目文字
			recognizedText: '', // OCR识别出的文字
			knowledgePoints: [], // 匹配到的知识点列表
			isRecognizing: false, // 是否正在识别
			isAnalyzing: false // 是否正在分析
		};
	},
	
	methods: {
		// 选择图片
		chooseImage() {
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: (res) => {
					this.uploadedImage = res.tempFilePaths[0];
					this.questionText = ''; // 清空文字输入
					// 清空之前的结果
					this.recognizedText = '';
					this.knowledgePoints = [];
				}
			});
		},

		// 开始识别
		async startRecognition() {
			this.recognizedText = '';
			this.knowledgePoints = [];

			if (this.uploadedImage) {
				// 有图片：先 OCR 识别，再匹配知识点
				this.isRecognizing = true;
				try {
					const ocrResult = await mockOCR(this.uploadedImage);
					if (ocrResult.success) {
						this.recognizedText = ocrResult.text;
						this.isRecognizing = false;
						
						// 继续分析知识点
						await this.analyzeKnowledge(this.recognizedText);
					}
				} catch (error) {
					this.isRecognizing = false;
					uni.showToast({
						title: '识别失败',
						icon: 'none'
					});
				}
			} else if (this.questionText) {
				// 仅有文字：直接匹配知识点
				this.recognizedText = this.questionText;
				await this.analyzeKnowledge(this.questionText);
			}
		},

		// 分析知识点
		async analyzeKnowledge(text) {
			this.isAnalyzing = true;
			try {
				const result = await mockMatchKnowledgePoints(text);
				if (result.success) {
					this.knowledgePoints = result.knowledgePoints;
					
					if (this.knowledgePoints.length === 0) {
						uni.showToast({
							title: '未匹配到相关知识点',
							icon: 'none',
							duration: 2000
						});
					} else {
						uni.showToast({
							title: `成功匹配 ${this.knowledgePoints.length} 个知识点`,
							icon: 'success',
							duration: 1500
						});
					}
				}
			} catch (error) {
				uni.showToast({
					title: '分析失败',
					icon: 'none'
				});
			} finally {
				this.isAnalyzing = false;
			}
		},

		// 查看知识点资源
		viewResources(knowledgePoint) {
			// 跳转到资源详情页，传递知识点ID和名称
			uni.navigateTo({
				url: `/pages/scanResource/scanResource?id=${knowledgePoint.id}&name=${encodeURIComponent(knowledgePoint.name)}`
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.scan-page {
	min-height: 100vh;
	background: linear-gradient(to bottom, #f5f7fa 0%, #ffffff 100%);
	padding: 20px;
}

.header-section {
	margin-bottom: 30px;
	text-align: center;
	
	.title-area {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 10px;
		
		.main-title {
			font-size: 24px;
			font-weight: bold;
			color: #303133;
			margin-left: 10px;
		}
	}
	
	.subtitle {
		font-size: 14px;
		color: #909399;
		line-height: 1.6;
	}
}

.input-section {
	margin-bottom: 30px;
	
	.upload-area {
		background: white;
		border-radius: 12px;
		padding: 40px 20px;
		margin-bottom: 20px;
		border: 2px dashed #dcdfe6;
		min-height: 200px;
		display: flex;
		align-items: center;
		justify-content: center;
		
		.upload-placeholder {
			display: flex;
			flex-direction: column;
			align-items: center;
			
			.upload-tip {
				margin-top: 15px;
				font-size: 14px;
				color: #606266;
			}
			
			.upload-hint {
				margin-top: 8px;
				font-size: 12px;
				color: #c0c4cc;
			}
		}
		
		.uploaded-container {
			width: 100%;
			
			.uploaded-img {
				width: 100%;
				max-height: 400px;
				border-radius: 8px;
			}
			
			.image-actions {
				margin-top: 15px;
				text-align: center;
			}
		}
	}
	
	.text-input-area {
		margin-bottom: 20px;
		
		.input-label {
			display: flex;
			align-items: center;
			margin-bottom: 10px;
			
			.label-text {
				margin-left: 6px;
				font-size: 14px;
				color: #606266;
				font-weight: 500;
			}
		}
	}
}

.result-section, .knowledge-section {
	margin-bottom: 30px;
	
	.section-header {
		display: flex;
		align-items: center;
		margin-bottom: 15px;
		
		.section-title {
			margin-left: 8px;
			font-size: 16px;
			font-weight: bold;
			color: #303133;
		}
	}
}

.recognized-text-box {
	background: white;
	border-radius: 12px;
	padding: 20px;
	border-left: 4px solid #67C23A;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
	
	.recognized-text {
		font-size: 15px;
		line-height: 1.8;
		color: #606266;
	}
}

.knowledge-list {
	.knowledge-item {
		background: white;
		border-radius: 12px;
		padding: 15px;
		margin-bottom: 12px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
		transition: all 0.3s;
		
		&:active {
			transform: scale(0.98);
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
		}
		
		.knowledge-left {
			display: flex;
			align-items: center;
			flex: 1;
			
			.knowledge-badge {
				width: 32px;
				height: 32px;
				background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
				color: white;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 14px;
				font-weight: bold;
				margin-right: 12px;
				flex-shrink: 0;
			}
			
			.knowledge-info {
				flex: 1;
				
				.knowledge-name {
					font-size: 15px;
					color: #303133;
					font-weight: 500;
					line-height: 1.4;
				}
			}
		}
	}
}

.loading-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 60px 0;
	
	.loading-text {
		margin-top: 20px;
		font-size: 14px;
		color: #909399;
	}
}

.footer-tip {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 20px 0;
	
	.tip-text {
		margin-left: 6px;
		font-size: 12px;
		color: #909399;
	}
}
</style>

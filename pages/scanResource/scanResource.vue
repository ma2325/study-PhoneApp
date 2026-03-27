<template>
	<view class="scan-page">
		<view class="header-section">
			<view class="title-area">
				<uv-icon name="scan" size="28" color="#409EFF"></uv-icon>
				<text class="main-title">AI 智能搜题</text>
			</view>
			<text class="subtitle">上传题目图片或输入文字，AI将直接解答并溯源课件</text>
		</view>

		<view class="input-section">
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

			<view class="text-input-area">
				<view class="input-label">
					<uv-icon name="edit-pen" size="18" color="#606266"></uv-icon>
					<text class="label-text">或直接输入题目文字</text>
				</view>
				<uv-textarea 
					v-model="questionText" 
					placeholder="例如：已知一个树结构每个节点最多有两个孩子求总节点数"
					:autoHeight="true"
					:maxlength="500"
					count
				></uv-textarea>
			</view>

			<uv-button 
				type="primary" 
				text="开始 AI 检索" 
				@click="startSearch"
				:loading="isSearching"
				:disabled="!uploadedImage && !questionText"
				size="large"
				:customStyle="{ marginTop: '20px' }"
			></uv-button>
		</view>

		<view v-if="extractedText && !isSearching" class="result-section">
			<view class="section-header">
				<uv-icon name="scan" size="20" color="#909399"></uv-icon>
				<text class="section-title">识别文本</text>
			</view>
			<view class="recognized-text-box">
				<text class="recognized-text">{{ extractedText }}</text>
			</view>
		</view>

		<view v-if="aiAnswer && !isSearching" class="ai-section">
			<view class="section-header">
				<uv-icon name="info-circle-fill" size="20" color="#67C23A"></uv-icon>
				<text class="section-title">AI 智能解析</text>
			</view>
			
			<view class="ai-keywords" v-if="aiKeywords">
				<text class="keyword-label">核心概念：</text>
				<text class="keyword-text">{{ aiKeywords }}</text>
			</view>

			<view class="ai-answer-box">
				<text class="ai-answer-text">{{ aiAnswer }}</text>
			</view>
		</view>

		<view v-if="sourceFiles.length > 0 && !isSearching" class="source-section">
			<view class="section-header">
				<uv-icon name="file-text-fill" size="20" color="#409EFF"></uv-icon>
				<text class="section-title">溯源出处 (发现于 {{ sourceFiles.length }} 个课件)</text>
			</view>
			
			<view class="source-list">
				<view 
					v-for="(file, index) in sourceFiles" 
					:key="index"
					class="source-item"
					@click="viewSourceResource(file)"
				>
					<view class="source-left">
						<view class="source-icon">
							<uv-icon name="file-text" size="24" color="#409EFF"></uv-icon>
						</view>
						<view class="source-info">
							<text class="source-name">{{ file.fileName }}</text>
							<view class="source-meta">
								<uv-tag :text="file.subject || '通用'" size="mini" type="primary" plain></uv-tag>
								<text class="source-detail">匹配相似度: {{ (file.bestScore * 100).toFixed(1) }}%</text>
							</view>
							<text class="source-snippet" v-if="file.snippets && file.snippets.length > 0">
								"...{{ file.snippets[0].substring(0, 40).replace(/[\r\n]/g, '') }}..."
							</text>
						</view>
					</view>
					<view class="source-right">
						<text class="page-hint">第 {{ file.pages[0] }} 页</text>
						<uv-icon name="arrow-right" size="18" color="#909399"></uv-icon>
					</view>
				</view>
			</view>
		</view>

		<view v-if="isSearching" class="loading-section">
			<uv-loading-icon mode="circle" size="50"></uv-loading-icon>
			<text class="loading-text">AI 正在深度检索知识库，请稍候...</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			uploadedImage: '', // 图片路径
			questionText: '', // 文字输入
			isSearching: false, // 加载状态
			
			// 后端返回的数据映射
			extractedText: '', // OCR提取的文字
			aiKeywords: '', // AI总结的关键词
			aiAnswer: '', // AI的解答
			sourceFiles: [], // 溯源文件列表
			
			// 替换为你真实的后端地址
			API_BASE_URL: 'http://localhost:3000' 
		};
	},
	
	methods: {
		chooseImage() {
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: (res) => {
					this.uploadedImage = res.tempFilePaths[0];
					this.questionText = ''; 
					this.clearResults();
				}
			});
		},

		clearResults() {
			this.extractedText = '';
			this.aiKeywords = '';
			this.aiAnswer = '';
			this.sourceFiles = [];
		},

		async startSearch() {
			this.clearResults();
			this.isSearching = true;

			try {
				if (this.uploadedImage) {
					// 走图文识别搜索接口 (POST /material/ocr-search)
					await this.searchByImage();
				} else if (this.questionText) {
					// 走纯文字语义搜索接口 (GET /material/search)
					await this.searchByText();
				}
			} catch (error) {
				console.error('检索异常:', error);
				uni.showToast({ title: '网络或服务器异常', icon: 'none' });
			} finally {
				this.isSearching = false;
			}
		},

		// 识图搜索
		searchByImage() {
			return new Promise((resolve, reject) => {
				uni.uploadFile({
					url: `${this.API_BASE_URL}/material/ocr-search`,
					filePath: this.uploadedImage,
					name: 'image', // 接口要求的文件字段名
					// 如果需要限定学科，可以在这里加 formData: { subject: '数据结构' }
					success: (uploadRes) => {
						try {
							// uni.uploadFile 返回的 data 是字符串，需要自行解析
							const resData = JSON.parse(uploadRes.data);
							if (resData.code === 200) {
								this.extractedText = resData.extractedText;
								this.aiKeywords = resData.aiKeywords;
								this.aiAnswer = resData.aiAnswer;
								this.sourceFiles = resData.data || [];
								resolve();
							} else {
								uni.showToast({ title: resData.msg || '识别失败', icon: 'none' });
								reject(resData.msg);
							}
						} catch (e) {
							reject(e);
						}
					},
					fail: (err) => reject(err)
				});
			});
		},

		// 文本搜索
		searchByText() {
			return new Promise((resolve, reject) => {
				uni.request({
					url: `${this.API_BASE_URL}/material/search`,
					method: 'GET',
					data: {
						queryText: this.questionText
					},
					success: (res) => {
						if (res.data.code === 200) {
							this.aiKeywords = res.data.aiKeywords;
							this.aiAnswer = res.data.aiAnswer;
							this.sourceFiles = res.data.data || [];
							resolve();
						} else {
							uni.showToast({ title: res.data.msg || '搜索失败', icon: 'none' });
							reject(res.data.msg);
						}
					},
					fail: (err) => reject(err)
				});
			});
		},

		// 点击前往资源详情页
		viewSourceResource(file) {
			// 将最相关的页码（pages数组的第一个）作为初始页码传给 viewer
			const targetPage = file.pages && file.pages.length > 0 ? file.pages[0] : 1;
			
			// 跳转逻辑。你可以根据后端的资源 ID 或 fileName 进行跳转。
			// 这里假设直接把 fileName 和页码传过去
			uni.navigateTo({
				url: `/pages/resourceViewer/resourceViewer?fileName=${encodeURIComponent(file.fileName)}&initialPage=${targetPage}`
			});
		}
	}
};
</script>

<style lang="scss" scoped>
/* 样式保留了你原有的设计语言，对新增的块做了适配 */
.scan-page {
	min-height: 100vh;
	background: linear-gradient(to bottom, #f5f7fa 0%, #ffffff 100%);
	padding: 20px;
	padding-bottom: 40px;
}

.header-section {
	margin-bottom: 30px;
	text-align: center;
	.title-area {
		display: flex; align-items: center; justify-content: center; margin-bottom: 10px;
		.main-title { font-size: 24px; font-weight: bold; color: #303133; margin-left: 10px; }
	}
	.subtitle { font-size: 14px; color: #909399; line-height: 1.6; }
}

.input-section {
	margin-bottom: 30px;
	.upload-area {
		background: white; border-radius: 12px; padding: 40px 20px; margin-bottom: 20px; border: 2px dashed #dcdfe6; min-height: 200px; display: flex; align-items: center; justify-content: center;
		.upload-placeholder {
			display: flex; flex-direction: column; align-items: center;
			.upload-tip { margin-top: 15px; font-size: 14px; color: #606266; }
			.upload-hint { margin-top: 8px; font-size: 12px; color: #c0c4cc; }
		}
		.uploaded-container {
			width: 100%;
			.uploaded-img { width: 100%; max-height: 400px; border-radius: 8px; }
			.image-actions { margin-top: 15px; text-align: center; }
		}
	}
	.text-input-area {
		margin-bottom: 20px;
		.input-label { display: flex; align-items: center; margin-bottom: 10px; .label-text { margin-left: 6px; font-size: 14px; color: #606266; font-weight: 500; } }
	}
}

/* 公共块标题 */
.section-header {
	display: flex; align-items: center; margin-bottom: 15px;
	.section-title { margin-left: 8px; font-size: 16px; font-weight: bold; color: #303133; }
}

/* 识别原文本区域 */
.result-section {
	margin-bottom: 25px;
	.recognized-text-box {
		background: #fdfdfd; border-radius: 8px; padding: 15px; border: 1px solid #ebeef5;
		.recognized-text { font-size: 14px; line-height: 1.6; color: #606266; word-break: break-all; }
	}
}

/* AI 结果区域 */
.ai-section {
	margin-bottom: 30px;
	.ai-keywords {
		margin-bottom: 10px; padding: 10px 15px; background: #f0f9eb; border-radius: 8px;
		.keyword-label { font-weight: bold; color: #67C23A; font-size: 13px; }
		.keyword-text { color: #529b2e; font-size: 13px; }
	}
	.ai-answer-box {
		background: white; border-radius: 12px; padding: 20px; border-left: 4px solid #67C23A; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
		.ai-answer-text { font-size: 15px; line-height: 1.8; color: #303133; white-space: pre-wrap; }
	}
}

/* 溯源列表区域 */
.source-section {
	margin-bottom: 30px;
	.source-list {
		.source-item {
			background: white; border-radius: 12px; padding: 15px; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); transition: all 0.3s;
			&:active { transform: scale(0.98); }
			.source-left {
				display: flex; flex: 1; overflow: hidden;
				.source-icon { width: 40px; height: 40px; background: #ecf5ff; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 12px; flex-shrink: 0; }
				.source-info {
					flex: 1; display: flex; flex-direction: column; overflow: hidden;
					.source-name { font-size: 15px; font-weight: 500; color: #303133; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
					.source-meta { display: flex; align-items: center; margin-bottom: 4px; .source-detail { font-size: 12px; color: #909399; margin-left: 8px; } }
					.source-snippet { font-size: 12px; color: #b3b6bc; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
				}
			}
			.source-right {
				display: flex; flex-direction: column; align-items: flex-end; margin-left: 10px; flex-shrink: 0;
				.page-hint { font-size: 12px; color: #e6a23c; margin-bottom: 4px; background: #fdf6ec; padding: 2px 6px; border-radius: 4px; }
			}
		}
	}
}

.loading-section {
	display: flex; flex-direction: column; align-items: center; padding: 60px 0;
	.loading-text { margin-top: 20px; font-size: 14px; color: #909399; }
}
</style>
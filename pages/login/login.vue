<template>
	<view class="login-wrapper">
		<view class="login-card">
			<view class="avatar-container">
				<uv-image src="/static/user.jpg" shape="circle" width="80px" height="80px"></uv-image>
			</view>

			<view class="welcome-text">
				<view class="title">欢迎回来</view>
				<view class="subtitle">请输入您的账号和密码</view>
			</view>

			<uv-form labelPosition="left" :model="addModel" :rules="rules" ref="addRef">
				<uv-form-item prop="userName" borderBottom>
					<uv-input placeholder="请输入账号" v-model="addModel.userName" border="none" clearable>
						<template #prefix>
							<uv-icon name="account" size="22" color="#999"></uv-icon>
						</template>
					</uv-input>
				</uv-form-item>
				<uv-form-item prop="password" borderBottom>
					<uv-input type="password" placeholder="请输入密码" v-model="addModel.password" border="none" clearable>
						<template #prefix>
							<uv-icon name="lock" size="22" color="#999"></uv-icon>
						</template>
					</uv-input>
				</uv-form-item>
			</uv-form>

			<view class="login-button-container">
				<uv-button type="primary" text="登 录" @click="commit"></uv-button>
			</view>

			<view class="register-link-container">
				<text>还没有账号？</text>
				<text class="link" @click="toRegister">立即注册</text>
			</view>

		</view>
	</view>
</template>

<script setup>
	import {
		reactive,
		ref
	} from 'vue';
	import {
		loginApi
	} from '../../api/index.js'
	const addRef = ref();
	//表单绑定对象
	const addModel = reactive({
		userName: '',
		password: ''
	})
	//表单验证规则
	const rules = reactive({
		'userName': {
			type: 'string',
			required: true,
			message: '请输入账号',
			trigger: ['blur', 'change']
		},
		'password': {
			type: 'string',
			required: true,
			message: '请输入密码',
			trigger: ['blur', 'change']
		}
	})
	//去注册
	const toRegister = () => {
		uni.navigateTo({
			url: '/pages/register/register'
		})
	}
	const commit = async () => {
		const start = Date.now();
		addRef.value.validate().then(async (vali) => {
			if (vali) {
				// let res = await loginApi(addModel)
				// if (res && res.code == 200) {
				// 	console.log(res.data)
				// 	//存储用户的信息
				// 	uni.setStorageSync("userId", res.data.userId)
				// 	uni.setStorageSync("start",start);
				// 	uni.switchTab({
				// 		url: '../index/index'
				// 	})
				// }
				const User = {
					userId: '1',
					userName: '1',
					token: 'token-abcdefg'
				};
				uni.setStorageSync("userId", User.userId)
				uni.setStorageSync("start",start);
				uni.switchTab({
					url: '../index/index'
				})
			}
		})

	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}

	.login-wrapper {
		width: 100vw;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		// 优雅的渐变背景
		background: linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%);
	}

	.login-card {
		width: 88%;
		max-width: 400px;
		background-color: #ffffff;
		border-radius: 15px;
		padding: 0 30px 30px; // 上边距由头像撑开
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
		position: relative;
	}

	// 头像容器
	.avatar-container {
		// 使用 transform 实现精准的居中定位
		position: absolute;
		top: -40px; // 向上偏移头像高度的一半
		left: 50%;
		transform: translateX(-50%);
		border: 4px solid #fff;
		border-radius: 50%;
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
	}
	
	// 欢迎语
	.welcome-text {
		text-align: center;
		padding-top: 60px; // 为头像留出空间
		margin-bottom: 25px;

		.title {
			font-size: 24px;
			font-weight: bold;
			color: #333;
		}

		.subtitle {
			font-size: 14px;
			color: #999;
			margin-top: 8px;
		}
	}
	
	// 输入框自定义样式
	::v-deep .uv-form-item__body {
		background-color: #f7f8fa;
		padding: 4px 12px;
		border-radius: 8px;
		
		.uv-input__content__prefix-icon {
			margin-right: 8px;
		}
	}
	
	// 登录按钮
	.login-button-container {
		margin-top: 40px;
		
		.uv-button {
			height: 45px;
			border-radius: 8px;
			// 按钮也使用渐变色，与背景呼应
			background: linear-gradient(to right, #667eea, #764ba2) !important;
		}
	}
	
	// 注册链接
	.register-link-container {
		margin-top: 20px;
		text-align: center;
		font-size: 14px;
		color: #999;
		
		.link {
			color: #764ba2;
			font-weight: bold;
			margin-left: 5px;
		}
	}
</style>
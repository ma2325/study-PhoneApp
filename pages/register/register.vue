<template>
	<view class="register-wrapper">
		<view class="register-card">
			<view class="avatar-uploader">
				<uv-image src="/static/user.jpg" shape="circle" width="80px" height="80px"></uv-image>
				<view class="camera-icon">
					<uv-icon name="camera-fill" color="#ffffff" size="20"></uv-icon>
				</view>
			</view>

			<view class="title-container">
				<view class="main-title">创建您的账户</view>
				<view class="subtitle">加入我们，开启新的旅程</view>
			</view>

			<uv-form labelWidth="80" labelPosition="left" :model="userInfo" :rules="rules" ref="formRef">
				<uv-form-item prop="name">
					<uv-input placeholder="请输入您的姓名" v-model="userInfo.name" border="none">
						<template #prefix>
							<uv-icon name="account-fill" size="22"></uv-icon>
						</template>
					</uv-input>
				</uv-form-item>
				<uv-form-item prop="phone">
					<uv-input type='number' placeholder="请输入您的联系方式 (可选)" v-model="userInfo.phone" border="none">
						<template #prefix>
							<uv-icon name="phone-fill" size="22"></uv-icon>
						</template>
					</uv-input>
				</uv-form-item>
				<uv-form-item prop="email">
					<uv-input placeholder="请输入您的邮箱 (可选)" v-model="userInfo.email" border="none">
						<template #prefix>
							<uv-icon name="email-fill" size="22"></uv-icon>
						</template>
					</uv-input>
				</uv-form-item>
				<uv-form-item prop="userName">
					<uv-input placeholder="请输入您的账号" v-model="userInfo.userName" border="none">
						<template #prefix>
							<uv-icon name="phone-fill" size="22"></uv-icon>
						</template>
					</uv-input>
				</uv-form-item>
				<uv-form-item prop="password">
					<uv-input type='password' placeholder="请输入您的密码" v-model="userInfo.password" border="none">
						<template #prefix>
							<uv-icon name="lock-fill" size="22"></uv-icon>
						</template>
					</uv-input>
				</uv-form-item>
				<uv-form-item prop="confirm">
					<uv-input type='password' placeholder="请确认您的密码" v-model="userInfo.confirm" border="none">
						<template #prefix>
							<uv-icon name="reload" size="22"></uv-icon>
						</template>
					</uv-input>
				</uv-form-item>
			</uv-form>

			<view class="button-container">
				<uv-button color="#7C4DFF" text="注 册" @click="commit"></uv-button>
			</view>
			
			<view class="login-link-container">
				<text>已有账户？</text>
				<text class="link" @click="toLogin">立即登录</text>
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
		registerApi
	} from '../../api/index.js'
	
	const formRef = ref()
	
	const userInfo = reactive({
		userName: '',
		password: '',
		confirm: '',
		phone: '',
		name: '',
		email: ''
	})

	const rules = reactive({
		'name': {
			type: 'string',
			required: true,
			message: '请输入您的姓名',
			trigger: ['blur', 'change']
		},
		'phone': [
			{
				required: false,
				message: '请输入您的联系方式',
				trigger: ['blur', 'change']
			},
			{
				validator: (rule, value, callback) => {
					if (!value) {
						return true;
					}
					if (uni.$u.test.mobile(value)) {
						return true;
					}
					return false;
				},
				message: '请输入正确的11位手机号码',
				trigger: ['change', 'blur']
			}
		],
		'email': [{
			type: 'email',
			required: false,
			message: '请输入正确的邮箱格式',
			trigger: ['blur', 'change']
		}],
		'userName': {
			type: 'string',
			required: true,
			message: '请输入您的账号',
			trigger: ['blur', 'change']
		},
		'password': {
			type: 'string',
			required: true,
			message: '请输入您的密码',
			trigger: ['blur', 'change']
		},
		confirm: [{
			required: true,
			message: '请确认您的密码',
			trigger: ['blur', 'change']
		}, {
			validator: (rule, value, callback) => {
				if (value !== userInfo.password) {
					return false;
				}
				return true;
			},
			message: '两次输入的密码不一致',
			trigger: ['change', 'blur']
		}]
	})

	const toLogin = () => {
		uni.navigateTo({
			url: '/pages/login/login'
		})
	}

	const commit = () => {
		formRef.value.validate().then(async (valid) => {
			if (valid) {
				
				const params = {
					userName: userInfo.userName,
					password: userInfo.password,
					phone: userInfo.phone,
					name: userInfo.name,
					nickName: userInfo.name,
					email: userInfo.email
				};
				
				let res = await registerApi(params) 
				
				if (res && res.code == 200) {
					uni.showToast({
						title: '注册成功！',
						icon: 'success',
						duration: 1500
					});
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/login/login'
						})
					}, 1500);
				}
			}
		})
	}
</script>

<style scoped lang="scss">
	page {
		height: 100%;
	}

	.register-wrapper {
		min-height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 20px 0;
		// A beautiful purple gradient
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		box-sizing: border-box;
	}

	.register-card {
		width: 90%;
		max-width: 420px;
		background-color: #ffffff;
		border-radius: 16px;
		padding: 0 25px 30px;
		box-shadow: 0 10px 35px rgba(0, 0, 0, 0.1);
		position: relative;
	}
	
	.avatar-uploader {
		position: absolute;
		top: -40px;
		left: 50%;
		transform: translateX(-50%);

		.uv-image {
			border: 4px solid #fff;
		}

		.camera-icon {
			position: absolute;
			bottom: 4px;
			right: 4px;
			width: 28px;
			height: 28px;
			border-radius: 50%;
			background-color: rgba(0, 0, 0, 0.4);
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
	
	.title-container {
		text-align: center;
		padding-top: 60px;
		margin-bottom: 25px;

		.main-title {
			font-size: 24px;
			font-weight: bold;
			color: #333;
		}

		.subtitle {
			font-size: 14px;
			color: #aaa;
			margin-top: 8px;
		}
	}
	
	// Custom styles for form items
	:deep(.uv-form-item) {
		background-color: #f7f8fa;
		border-radius: 8px;
		padding: 0 12px;
		margin-bottom: 18px;
		
		.uv-line {
			border: none !important;
		}
		
		.uv-input__content__prefix-icon {
			margin-right: 8px;
		}
	}

	.button-container {
		margin-top: 30px;
		.uv-button {
			height: 48px;
			border-radius: 8px;
		}
	}

	.login-link-container {
		margin-top: 25px;
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
//const baseUrl = 'https://misaka16483.abrdns.com';
const baseUrl = 'http://localhost:8089';
//const baseUrl = 'http://192.168.31.70:8069'  
const http = (options = {}) => {
	return new Promise((resolve, reject) => {
		uni.request({
			url: baseUrl + options.url || '',
			method: options.type || 'GET',
			data: options.data || {},
			header: options.header || {},
		}).then((response) => {
			// console.log(response)
			if (response.data && response.data.code == 200) {
				resolve(response.data);
			} else {
				// console.log('')
				uni.showToast({
					icon: 'none',
					title: response.data.msg,
					duration: 2000
				});
				reject(response.data)
			}

		}).catch(error => {
			reject(error)
		})
	});
}
const get = (url, data, options = {}) => {
	options.type = 'get';
	options.data = data;
	options.url = url;
	return http(options)
}
const post = (url, data, options = {}) => {
	options.type = 'post';
	options.data = data;
	options.url = url;
	return http(options)
}
const put = (url, data, options = {}) => {
	options.type = 'put';
	options.data = data;
	options.url = url;
	return http(options)
}
const upload = (parm) => {
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: baseUrl + parm.url,
			filePath: parm.filePath,
			name: 'file',
			formData: {
				openid: uni.getStorageSync('openid')
			},
			success: (res) => {
				try {
					const data = JSON.parse(res.data)
					if (data.code === 200) {
						data.data = baseUrl + data.data
						resolve(data)
					} else {
						uni.showToast({
							icon: 'none',
							title: data.message || '上传失败'
						})
						reject(data)
					}
				} catch (e) {
					console.error('上传返回解析失败:', e, res.data)
					reject(e)
				}
			},
			fail: (error) => {
				reject(error)
			}
		})
	})
}

export default {
	get,
	post,
	put,
	upload,
	baseUrl
}

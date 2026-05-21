import axios from 'axios'

// 【统一配置地址和端口】
const service = axios.create({
  baseURL: 'http://127.0.0.1:8000', // 只在这里写一次！
  timeout: 5000
})

export default service
import axios from 'axios';
import queryString from 'query-string';

const axiosClient = axios.create({
    baseURL : process.env.API_URL,
    paramsSerializer : (params) => queryString.stringify(params)
})

axiosClient.interceptors.response.use(res => {
    if(res && res.data) return res.data
})


export default axiosClient
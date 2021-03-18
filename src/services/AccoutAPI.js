import axiosClient from './AxiosClient';

class AccountAPI {
    login(data){
        const url = 'account/login';
        return axiosClient.post(url,data);
    }
}


export default new AccountAPI();
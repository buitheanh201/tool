import axiosClient from './AxiosClient';

class SubjectAPI {

    findAll(){
        const url = '/subject';
        return axiosClient.get(url)
    }

    create(data){
        const url = '/subject';
        return axiosClient.post(url,data);
    }

}


export default new SubjectAPI();
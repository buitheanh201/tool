import axiosClient from './AxiosClient';

class SubjectAPI {

    findAll(){
        const url = '/subject';
        return axiosClient.get(url)
    }

}


export default new SubjectAPI();
import axiosClient from './AxiosClient';


class TeacherAPI {
        create(data) {
            const url = '/teacher';
            return axiosClient.post(url,data);
        }
        findAll(){
            const url = '/teacher';
            return axiosClient.get(url);
        }
}


export default new TeacherAPI();
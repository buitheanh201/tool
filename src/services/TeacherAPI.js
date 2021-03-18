import axiosClient from './AxiosClient';


class TeacherAPI {
        create(data) {
            const url = '/teacher';
            return axiosClient.post(url,data);
        }
}


export default new TeacherAPI();
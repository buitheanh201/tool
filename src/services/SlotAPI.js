import AxiosClient from './AxiosClient';


class SlotAPI {

    findAll(){
        const url = '/slot';
        return AxiosClient.get(url)
    }
    findOne(id){
        const url = `/slot/${id}`;
        return AxiosClient.get(url);
    }
}

export default new SlotAPI();
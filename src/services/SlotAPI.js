import AxiosClient from './AxiosClient';


class SlotAPI {

    findAll(){
        const url = '/slot';
        return AxiosClient.get(url)
    }

}

export default new SlotAPI();
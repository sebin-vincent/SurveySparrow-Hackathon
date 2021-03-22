import Api from '../Api';
import EndPoints from '../Endpoints';

export const getAllCollections = () => {
    let url = EndPoints.getUrl('getAllCollections');
    return Api.get(url);
};

export const createCollection = (req) => {
    let url = EndPoints.getUrl('createCollection');
    return Api.post(url, req);
};

export const deleteCollection = (id) => {
    let url = EndPoints.getUrl('deleteCollection', [id]);
    return Api.delete(url);
}

export const updateCollection = (id, req) => {
    let url = EndPoints.getUrl('deleteCollection', [id]);
    return Api.put(url, req);
}
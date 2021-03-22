import Api from '../Api';
import EndPoints from '../Endpoints';

export const getAllKahoots = () => {
    let url = EndPoints.getUrl('getAllKahoots');
    return Api.get(url);
};

export const getKahootDetail = (id) => {
    let url = EndPoints.getUrl('getKahootDetail', [id]);
    return Api.get(url);
};

export const draftKahoot = (req) => {
    let url = EndPoints.getUrl('draftKahoot');
    return Api.post(url, req);
};

export const updateKahoot = (id, req) => {
    let url = EndPoints.getUrl('updateKahoot', [id]);
    return Api.put(url, req);
};

export const deleteKahoot = (id) => {
    let url = EndPoints.getUrl('deleteKahoot', [id]);
    return Api.delete(url);
};

export const addQuestion = (id, req) => {
    let url = EndPoints.getUrl('addQuestion', [id]);
    return Api.post(url, req);
};

export const updateQuestion = (kahootId, questionId, req) => {
    let url = EndPoints.getUrl('updateQuestion', [kahootId, questionId]);
    return Api.post(url, req);
};

export const deleteQuestion = (kahootId, questionId) => {
    let url = EndPoints.getUrl('deleteQuestion', [kahootId, questionId]);
    return Api.delete(url);
};
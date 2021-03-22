import { getBaseURL } from "../config/Utils";

const BASE_URL = getBaseURL() || "http://localhost:3000";
const VERSION = "v1";

const API_ENDPOINTS = {
    googleLogin: "/google-signin",

    getAllCollections: `/api/${VERSION}/collections`,
    createCollection: `/api/${VERSION}/collections`,
    deleteCollection: `/api/${VERSION}/collections/{:id}`,
    updateCollection: `/api/${VERSION}/collections/{:id}`,

    getAllKahoots: `/api/${VERSION}/kahoots`,
    getKahootDetail: `/api/${VERSION}/kahoots/{:id}`,
    draftKahoot: `/api/${VERSION}/kahoots/draft`,
    updateKahoot: `/api/${VERSION}/kahoots/{:id}`,
    deleteKahoot: `/api/${VERSION}/kahoots/{:id}`,

    addQuestion: `/api/${VERSION}/kahoots/{:id}/questions`,
    updateQuestion: `/api/${VERSION}/kahoots/{:kahootId}/questions/{:questionId}`,
    deleteQuestion: `/api/${VERSION}/kahoots/{:kahootId}/questions/{:questionId}`,
};

const replaceParams = (url, params) => {
    const regex = /\{:[A-Za-z0-9-_]+\}/g;
    let index = 0;
    const path = url ? url.replace(regex, () => params[index++]) : "";
    return path;
};

const Endpoints = {

    getUrl: (key, params = []) => {
        const endpoint = API_ENDPOINTS[key];
        const path = replaceParams(endpoint, params);
        return path;
    },

    getFullUrl: (key, params = []) => {
        const path = Endpoints.getUrl(key, params);
        const url = BASE_URL + path;
        return url;
    },

};

export default Endpoints;
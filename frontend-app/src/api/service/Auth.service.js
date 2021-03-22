import Api from "../Api";
import Endpoints from "../Endpoints";

export const getGoogleAccessToken = (tokenId) => {
    let url = Endpoints.getUrl("googleLogin");
    let reqBody = { tokenId };

    return Api.post(url, reqBody);
};
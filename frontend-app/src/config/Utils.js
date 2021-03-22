import moment from 'moment';
import Config from './properties.json';

export const getBaseURL = () => {
    let url = Config.BASE_URL || '';
    return url;
};

export const getGoogleClientId = () => {
    let clientId = Config.GOOGLE_CLIENT_ID || '';
    return clientId;
};

export const setAccessToken = (accessToken) => {
    localStorage.setItem("__ACCESS_TOKEN", accessToken);
};

export const getAccessToken = () => {
    return localStorage.getItem("__ACCESS_TOKEN");
};

export const setRefreshToken = (refreshToken) => {
    localStorage.setItem("__REFRESH_TOKEN", refreshToken);
};

export const getRefreshToken = () => {
    return localStorage.getItem("__REFRESH_TOKEN");
};

export const setGoogleIdToken = (idToken) => {
    localStorage.setItem("__GOOGLE_ID_TOKEN", idToken);
};

export const getGoolgeIdToken = () => {
    return localStorage.getItem("__GOOGLE_ID_TOKEN");
};

export const setToken = (accessToken, refreshToken, googleIdToken) => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setGoogleIdToken(googleIdToken);
};

export const clearTokens = () => {
    setAccessToken("");
    setRefreshToken("");
    setGoogleIdToken("");
};

export const getAsset = (fileName, path = "") => {
    let assetPath;
    try {
        let asset = require(`../asset/${path ? `${path}/` : ""}${fileName}`);
        if (typeof asset === 'string') assetPath = asset;
        else if (typeof asset === 'object') assetPath = asset.default;
        else assetPath = ""
    }
    catch {
        assetPath = "";
    }
    return assetPath;
};

export const formatDate = (date, format) => {
    let formattedDate;
    try {
        formattedDate = moment(date).format(format);
    }
    catch {
        formattedDate = "";
    }
    return formattedDate;
};

export const isUserAuthenticated = () => {
    let isAuthenticated = getAccessToken() ? true : false;
    return isAuthenticated;
};

export const DEFAULT_QUESTION_STATE = {
    id: '',
    questionNumber: 1,
    question: "",
    choices: [
        {
            answer: "",
            correct: false,
        },
        {
            answer: "",
            correct: false,
        },
        {
            answer: "",
            correct: false,
        },
        {
            answer: "",
            correct: false,
        }
    ],
    type: 'quiz',
    time: '30',
    points: true,
    pointsMultiplier: '1',
    answerOptions: '1',
};
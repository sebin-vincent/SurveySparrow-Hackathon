import {
    GAME_SET_PIN,
    GAME_SET_PLAYER_NAME
} from "../ActionTypes";

export function setPlayerName(name) {
    return {
        type: GAME_SET_PLAYER_NAME,
        payload: name
    };
};

export function setGamePin(pin) {
    return {
        type: GAME_SET_PIN,
        payload: pin
    };
};
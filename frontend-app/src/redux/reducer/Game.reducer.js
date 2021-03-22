import {
    GAME_SET_PIN,
    GAME_SET_PLAYER_NAME
} from "../ActionTypes";

const initialState = {
    playerName: "Player 1",
    gamePin: ""
};

const GameReducer = (state = initialState, action) => {

    switch (action.type) {

        case GAME_SET_PLAYER_NAME:
            state = {
                ...state,
                playerName: action.payload
            };
            break;

        case GAME_SET_PIN:
            state = {
                ...state,
                gamePin: action.payload
            };
            break;

        default:
            break;

    }

    return state;

};

export default GameReducer;
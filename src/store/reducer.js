import ActionTypes from "./types";

const initialState = {
    web3: null,
    chainId: null,
    walletAddress: null,
    shortAddress: null,
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.SET_WEB3:
            return {
                ...state,
                web3: action.web3,
            };
        case ActionTypes.LOGOUT:
            return {
                initialState
            };
        case ActionTypes.SET_CHAINID:
            return {
                ...state,
                chainId: action.chainId,
            };
        case ActionTypes.SET_ADDRESS:
            return {
                ...state,
                walletAddress: action.walletAddress,
                shortAddress: action.shortAddress,
            };
        default:
            return state;
    }
};

export default rootReducer;

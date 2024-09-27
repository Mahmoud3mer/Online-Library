const INITIAL_STATE = {
    adminProfile: {}
}

export const GetProfileReducer = (state = INITIAL_STATE, action: any) => {
    switch (action.type) {
        case 'GET_PROFILE':
            return {
                ...state,
                adminProfile: action.payload
            };
        default:
            return state;
}
};
export default function authReducer(state, action) {
    switch(action.type) {
        case 'SIGN_IN': return { login: action.value };
        case 'SIGN_OUT': return { login: action.value };
        default: return state;
    }
}
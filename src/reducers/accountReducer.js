import * as types from './../actions/account/actionTypes'

const initialState = {
    data : {}
}

const myReducer = (state = initialState,action) => {
    switch(action.type){
        case types.LOGIN_REQUEST : {
            return {...state,isFetchingLogin : true}
        }
        case types.LOGIN_SUCCESS : {
            return {...state,isFetchingLogin : false,data : action.payload }
        }
        case types.LOGIN_FAILURE : {
            return {...state,isFetchingLogin : false,data : action.error}
        }
        default : return {...state}
    }
}

export default myReducer;
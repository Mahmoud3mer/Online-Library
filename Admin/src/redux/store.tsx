import { applyMiddleware, createStore } from "redux";
import { GetProfileReducer } from "./reducer";
// import { composeWithDevTools } from "redux-devtools-extension";
import { thunk } from "redux-thunk";

const myStore = createStore(GetProfileReducer, applyMiddleware(thunk))

export default myStore;
import axios from "axios"
import { apiUrl } from "../utils/apiUrl";



export const GetAddminProfil = () => (dispatch: any) => {
    const token: string | null = localStorage.getItem('token');
    return axios.get(`${apiUrl}/user-settings`, { 'headers': { 'token': token } })
    .then((res) => {
        dispatch({
            type: 'GET_PROFILE',
            payload: res.data.user
        })
    })
    .catch((err) => {
        console.log(err);
    })
}
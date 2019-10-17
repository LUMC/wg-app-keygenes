import axios from "axios";

import {protocol} from '../../constants/types'

export const directProtocol = (config, data) => async (dispatch) => {
    let bodyFormData = new FormData();
    bodyFormData.set('email', data.email);
    bodyFormData.set('training', data.training);
    bodyFormData.append('file', data.file[0]);
    const result = await axios({
        method: 'post',
        url: config.tool_reference,
        data: bodyFormData,
        config: { headers: {'Content-Type': 'multipart/form-data',  'Accept': 'text/html' }}
    });
    if(result.data.includes("Succesfully submitted. Please check your email in a few minutes")){
        dispatch({
            type:protocol.PROTOCOL_COMPLETED
        });
    }else{
        dispatch({
            type:protocol.PROTOCOL_FAILED
        });
    }
};
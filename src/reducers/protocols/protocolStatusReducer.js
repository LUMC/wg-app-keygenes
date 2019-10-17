import {protocol} from "../../constants/types";

export default (state='', action) => {
    switch (action.type) {
        case protocol.PROTOCOL_COMPLETED:
            return protocol.PROTOCOL_COMPLETED;

        case protocol.PROTOCOL_FAILED:
            return protocol.PROTOCOL_FAILED;
        default:
            return ''
    }
}
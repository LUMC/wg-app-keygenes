import {modules} from "../../../constants/types";

export default (state= {}, action) => {
    switch (action.type) {
        case modules.geneFinder.SET_ACTIVE_TISSUE:
            return action.payload.data.counts;
        default:
            return state;
    }
}
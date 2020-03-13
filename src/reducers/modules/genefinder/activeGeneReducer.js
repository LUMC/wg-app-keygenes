import {modules} from '../../../constants/types'
import _ from "lodash"

export default (state={}, action) => {
    switch (action.type) {
        case modules.geneFinder.SET_ACTIVE_GENE:
            return action.payload;
        default:
            return state;
    }
}
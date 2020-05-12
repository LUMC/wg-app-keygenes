import {modules} from '../../../constants/types'
import _ from "lodash"

export default (state='', action) => {
    switch (action.type) {
        case modules.geneFinder.SET_ACTIVE_STAGE:
            return action.payload;
        default:
            return state;
    }
}
import {modules} from '../../../constants/types'
import _ from "lodash"

export default (state='', action) => {
    switch (action.type) {
        case modules.geneFinder.SET_ACTIVE_TISSUE:
            return action.payload.activeTissue;
        default:
            return state;
    }
}
import {modules} from '../../../constants/types'
import _ from "lodash"

export default (state=[], action) => {
    switch (action.type) {
        case modules.geneFinder.GET_GENE_COUNTS:
            return _.values(action.payload)
        case modules.geneFinder.SET_ACTIVE_GENE:
            return []
        default:
            return state;
    }
}
import {modules} from '../../../constants/types'
import _ from "lodash"

export default (state=[], action) => {
    switch (action.type) {
        case modules.geneFinder.GET_GENE_COUNTS:
            return _.values(action.payload)
        default:
            return state;
    }
}
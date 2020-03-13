import {modules} from '../../../constants/types'
import _ from "lodash"

export default (state=[], action) => {
    switch (action.type) {
        case modules.geneFinder.GET_SUGGESTIONS:
            const items= [];
            _.values(action.payload).forEach(
                (item, value) => {
                    if(!item.symbol){
                        items.push({
                            title: `${item.ensg}`,
                            description: item.description,
                            id:item.id,
                            ensg: item.ensg
                        })
                    }else{
                        items.push({
                            title: `${item.symbol} | ${item.ensg}`,
                            description: item.description,
                            id:item.id,
                            ensg: item.ensg
                        })
                    }

                }
            );
            return items;
        default:
            return state;
    }
}
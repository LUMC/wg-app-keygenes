import SascWebApi from "../../apis/SascWeb";
import {modules} from "../../constants/types";


export const getGeneSuggestions = (searchTerm) => async (dispatch) =>{
    const result = await SascWebApi.get(`/items/gene?limit=5&filter[symbol][logical]=or&
    filter[symbol][rlike]=${searchTerm}%&filter[description][logical]=or&
    filter[description][rlike]=${searchTerm}%&filter[ensg][logical]=or&filter[ensg][rlike]=${searchTerm}%
    &filter[symbol][nnull]`);
    dispatch({type: modules.geneFinder.GET_SUGGESTIONS, payload: result.data.data})
};

export const getGeneCounts = (id) => async (dispatch) =>{
    const result = await SascWebApi.get(`/items/transcript?filter[gene][eq]=${id}`);
    dispatch({type: modules.geneFinder.GET_GENE_COUNTS, payload: result.data.data})
};
export const setGene = (item) =>{
    return {type:modules.geneFinder.SET_ACTIVE_GENE, payload:item}
}
export const setTissue = (activeTissue) =>  async (dispatch) =>{
    const result = await SascWebApi.post(`/custom/data/tissue-data`,
        {tissueId: activeTissue.id, amount: 20})
    dispatch({type: modules.geneFinder.SET_ACTIVE_TISSUE, payload: {activeTissue:activeTissue, data:result.data}})
}

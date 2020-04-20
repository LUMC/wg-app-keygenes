import {combineReducers} from "redux";
import suggestionsReducer from "./suggestionsReducer";
import activeGeneReducer from "./activeGeneReducer";
import transcriptsReducer from "./transcriptsReducer";
import activeTissueReducer from "./activeTissueReducer";
import tissueCountsReducer from "./tissueCountsReducer";
import tissueGenesReducer from "./tissueGenesReducer";

export const geneFinderReducers = combineReducers({
    suggestions: suggestionsReducer,
    activeGene: activeGeneReducer,
    geneCounts: transcriptsReducer,
    activeTissue: activeTissueReducer,
    tissueCounts: tissueCountsReducer,
    tissueGenes: tissueGenesReducer
});
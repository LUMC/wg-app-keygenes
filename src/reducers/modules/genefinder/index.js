import {combineReducers} from "redux";
import suggestionsReducer from "./suggestionsReducer";
import activeGeneReducer from "./activeGeneReducer";
import transcriptsReducer from "./transcriptsReducer";

 export const geneFinderReducers = combineReducers({
    suggestions: suggestionsReducer,
    activeGene: activeGeneReducer,
     geneCounts: transcriptsReducer
});
import {combineReducers} from "redux";
import {geneFinderReducers} from "./genefinder";

export const modules = combineReducers({
    geneFinder: geneFinderReducers
});
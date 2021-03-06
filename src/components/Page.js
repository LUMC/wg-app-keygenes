
import React, {Component} from 'react'
import ModuleLoader from './modules/moduleLoader'
import {Grid, Header} from "semantic-ui-react";
import {setTissue} from "../actions/modules/geneFinderActions";

class Page extends Component{

    getCollection (collection){
        if (!collection){
            return null
        }
        if (collection in this.props.collections){
            return this.props.collections[collection]
        }
        else{
            return null
        }
    }
    renderModules(){
        return this.props.config.settings.map(
            (setting, key) =>{
                if (setting.module === 'form'){
                    return(
                        <ModuleLoader
                            getGeneSuggestions={this.props.getGeneSuggestions}
                            getGeneCounts={this.props.getGeneCounts}
                            onSubmit={this.props.onSubmit}
                            page={this.props.config.name}
                            key={`module-${this.props.config.reference}-${key}`}
                            collection={{
                                'form': this.getCollection(setting.collection),
                                'inputs': this.getCollection('inputs')
                            }}
                            setting={setting}
                            protocolStatus={this.props.protocolStatus}
                        />
                    )
                }
                if(setting.module === 'transcript-finder'){
                    return (
                        <ModuleLoader
                            setTissue={this.props.setTissue}
                            modulesData={this.props.modulesData}
                            setGene={this.props.setGene}
                            getGeneSuggestions={this.props.getGeneSuggestions}
                            getGeneCounts={this.props.getGeneCounts}
                            page={this.props.config.name}
                            key={`module-${this.props.config.reference}-${key}`}
                            collection={{
                                'tissue': this.getCollection('tissue'),
                                'stage': this.getCollection('stage')
                            }}
                            setting={setting}
                        />
                    )
                }
                return (
                    <ModuleLoader
                        modulesData={this.props.modulesData}
                        setGene={this.props.setGene}
                        getGeneSuggestions={this.props.getGeneSuggestions}
                        getGeneCounts={this.props.getGeneCounts}
                        page={this.props.config.name}
                        key={`module-${this.props.config.reference}-${key}`}
                        collection={this.getCollection(setting.collection)}
                        setting={setting}
                    />
                )
            }
        )
    }
    render() {
        if (!this.props.path){
            return null
        }
        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column>
                        <Header as='h1' dividing>
                            {this.props.config.name}
                        </Header>
                    </Grid.Column>
                </Grid.Row>
                {this.renderModules()}
            </Grid>
        )
    }

}
export  default  Page;
import React, {Component} from 'react'
import {Grid, Tab} from 'semantic-ui-react'
import GeneFinder from "./GeneFinder";
import TissueFinder from "./TissueFinder";
import ModuleLoader from "../moduleLoader";
import {isMobile} from "react-device-detect";

class GeneBrowser extends Component {
    panes = [
        {
            menuItem: { key: 'genefinder', icon: 'dna', content: 'Search a gene' },
            render: () => (
                <Tab.Pane attached={false}>
                    <GeneFinder
                        collection={this.props.collection}
                        moduleData={this.props.moduleData}
                        getGeneSuggestions={this.props.getGeneSuggestions}
                        setGene={this.props.setGene}
                        setting={this.props.setting}
                        getGeneCounts={this.props.getGeneCounts}
                    />
            </Tab.Pane>)
        },
        {
            menuItem: { key: 'tissueFinder', icon: 'heart', content: 'View tissues' },
            render: () => <Tab.Pane attached={false}>
                <TissueFinder
                    collection={this.props.collection}
                    setTissue={this.props.setTissue}
                    moduleData={this.props.moduleData}
                />
            </Tab.Pane>,
        },
    ];

    render() {
        if(isMobile) return <p>The KeyGenes browser module is only accessible by desktop or tablet!</p>
        return (
            <Grid.Column width={16}>
                <Tab
                    menu={{secondary: true, pointing: true}}
                    panes={this.panes}
                />
            </Grid.Column>
        )
    }
}

export default GeneBrowser

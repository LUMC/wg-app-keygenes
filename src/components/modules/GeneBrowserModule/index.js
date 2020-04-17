import React, {Component} from 'react'
import {Grid, Tab} from 'semantic-ui-react'
import GeneFinder from "./GeneFinder";

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
            render: () => <Tab.Pane attached={false}>Coming soon!</Tab.Pane>,
        },
    ];

    render() {
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
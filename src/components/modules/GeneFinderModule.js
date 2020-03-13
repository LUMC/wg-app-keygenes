import React, {Component} from 'react'
import {Button, Card, Container, Form, Grid, Header, Icon, Search} from "semantic-ui-react";
import _ from 'lodash'
import Page from "../Page";


const initialState = {isLoading: false, value: '', selected: false}

class GeneFinderModule extends Component {
    state = initialState;


    renderCoords = (data) =>{
        for(let i = 0; i < data.length; i++){
            data[i].x = tissueLegenda.indexOf(data[i].tissue);
            data[i].y = groupLegenda.indexOf(data[i].group);
            data[i].colour = data[i].y;
        }
        return data

    };
    renderGraph(){
        if(this.state.selected && this.props.moduleData.geneCounts.length > 0) {
            console.log(this.props.collection);
            const coordData = this.renderCoords(this.props.moduleData.getGeneCounts);
            // const firstT = _.filter(coordData, (v) => _.includes('1t', v.group));
            // const secondT = _.filter(coordData, (v) => _.includes('2t', v.group));
            // const adult = _.filter(coordData, (v) => _.includes('adult', v.group));
            //
            // var trace1 = {
            //     x: _.map(firstT, 'x'),
            //     y: _.map(firstT, 'count'),
            //     mode: 'markers',
            //     type: 'scatter',
            //     name: 'First trimester',
            //     opacity: 0.5,
            //     marker: {
            //         size: 20
            //     }
            // };
            //
            // var trace2 = {
            //     x: _.map(secondT, 'x'),
            //     y: _.map(secondT, 'count'),
            //     mode: 'markers',
            //     type: 'scatter',
            //     name: 'Second trimester',
            //     opacity: 0.5,
            //     marker: {
            //         size: 20
            //     }
            // };
            //
            // var trace3 = {
            //     x: _.map(adult, 'x'),
            //     y: _.map(adult, 'count'),
            //     mode: 'markers',
            //     type: 'scatter',
            //     name: 'Adult',
            //     opacity: 0.5,
            //     marker: {
            //         size: 20
            //     }
            // };
            //
            // return (<Plot
            //     data={[trace1, trace2, trace3]}
            //     layout={{width: 1200, height: 600, title: `Transcription in gene ${this.state.value}`, hovermode:'closest',
            //         xaxis: {
            //             tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
            //                 15, 16, 17, 18, 19, 20, 21, 22, 23],
            //             ticktext: tissueLegenda
            //         }}}
            // />)
        }
        return null
    }
    handleResultSelect = (e, { result }) => {
        this.props.setGene(result)
        this.setState({value: "", selected:true})
        this.props.getGeneCounts(result.id)
    }
    handleSearchChange = (event) =>{
        this.props.getGeneSuggestions(event.target.value);
        this.setState({value: event.target.value, selected:false})
    }
    render() {
        const {isLoading, value} = this.state;
        return (
            <>
                <Grid.Row>
                    <Grid.Column width={8}>
                        <Form>
                            <Form.Field>
                                <label>Search using the Gene ID</label>
                                <Search
                                    loading={isLoading}
                                    onResultSelect={this.handleResultSelect}
                                    onSearchChange={_.debounce(this.handleSearchChange, 500, {
                                        leading: true,
                                    })}
                                    results={this.props.moduleData.suggestions}
                                    value={value}
                                    {...this.props}
                                />
                            </Form.Field>
                        </Form>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column style={{textAlign: "center"}} width={16}>
                        {this.renderGraph()}
                    </Grid.Column>
                </Grid.Row>

            </>
        )
    }

}

export default GeneFinderModule;
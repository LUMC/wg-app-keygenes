import React, {Component} from 'react'
import {
    Button,
    Card,
    Container,
    Dimmer,
    Form,
    Grid,
    Header,
    Icon,
    Image,
    Loader,
    Search,
    Segment
} from "semantic-ui-react";
import _ from 'lodash'
import Plot from 'react-plotly.js';


const initialState = {isLoading: false, value: '', selected: false, tissues: [], stages:[]}

class GeneFinderModule extends Component {
    state = initialState;


    generatePlotTraces = (data) =>{
        const plotTraces = [];
        const stage_groups = _.groupBy(data, 'stage')
        const stages  = this.state.stages;
        Object.keys(stage_groups).forEach(function(key) {
            let items = _.remove(stage_groups[key], function(currentObject) {
                return currentObject.count !== "nan";
            });
            const trace = {
                x: _.map(items, 'tissue'),
                y: _.map(items, 'count'),
                mode: 'markers',
                type: 'scatter',
                name: stages[key],
                opacity: 0.5,
                marker: {
                    size: 20
                }
            };
            plotTraces.push(trace)
        });
        return plotTraces
    }
    renderGraph(){
        if(this.props.moduleData.geneCounts.length > 0) {
            const plotTraces = this.generatePlotTraces(this.props.moduleData.geneCounts)
            return (
                    <Plot
                    data={plotTraces}
                    layout={{width: 1200, height: 600, hovermode:'closest',
                        title: `Transcription in ${this.props.moduleData.activeGene.ensg}\ 
${this.props.moduleData.activeGene.symbol?` (${this.props.moduleData.activeGene.symbol})`:''}\
${this.props.moduleData.activeGene.description?` - ${this.props.moduleData.activeGene.description}`:''}`,
                        xaxis: {
                            tickvals: _.range(1, this.props.collection.tissue.length+1),
                            ticktext: _.values(this.state.tissues)
                        }}}
                    />
            )
        }else if(this.state.selected){
            return(
                <div>
                    <Segment>
                        <Dimmer active inverted>
                            <Loader content='Preparing transcription data...' />
                        </Dimmer>
                        <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
                    </Segment>
                </div>
            )
        }
        return null
    }

    handleResultSelect = (e, { result }) => {
        this.props.setGene(result)
        this.setState({value: result.ensg, selected:true})
        this.props.getGeneCounts(result.id)
    }
    handleSearchChange = (event) =>{
        this.props.getGeneSuggestions(event.target.value);
        this.setState({value: event.target.value, selected:false})
    }
    componentDidMount() {
        this.setState({tissues:_.chain(this.props.collection.tissue).keyBy('id').mapValues('name').value()})
        this.setState({stages:_.chain(this.props.collection.stage).keyBy('id').mapValues('name').value()})
    }

    render() {
        const {isLoading, value, tissues, stages} = this.state;
        if(tissues.length < 1 || stages.length < 1){
            return (
                <div>
                    <Segment>
                        <Dimmer active inverted>
                            <Loader content='Loading' />
                        </Dimmer>
                        <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
                    </Segment>
                </div>
            )
        }
        return (
            <>
                <Grid.Row centered>
                    <Grid.Column width={8}>
                        <Form >
                            <Form.Field>
                                <label>Search using the Gene symbol or ENSG-code</label>
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
                    <Grid.Column width={16}>
                        {this.renderGraph()}
                    </Grid.Column>
                </Grid.Row>
            </>
        )
    }

}

export default GeneFinderModule;
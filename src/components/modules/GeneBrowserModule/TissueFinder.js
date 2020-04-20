import React, {Component} from 'react'
import {
    Button,
    Card,
    Container,
    Dimmer, Dropdown,
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
import Plot from '../../../../node_modules/react-plotly.js/react-plotly';


const initialState = {isLoading: false, value: '', selected: false, stages: [], options: [], genes:[]}

class TissueFinder extends Component {

    state = initialState;

    componentDidMount() {
        this.setState({stages: _.chain(this.props.collection.stage).keyBy('id').mapValues('name').value()})
        this.setState({
            options: _.map(this.props.collection.tissue, (state) => ({
                key: state.id,
                text: state.name,
                value: state.id,
            }))
        })
    }

    setActiveTissue = (e, data) => {
        this.props.setTissue({id:data.value, text: e.target.innerText})
    }
    generatePlotTraces = (data, genes) => {
        const plotTraces = [];
        const stage_groups = _.groupBy(data, 'stage')
        const stages = this.state.stages;
        Object.keys(stage_groups).forEach(function (key) {
            let items = _.remove(stage_groups[key], function (currentObject) {
                return currentObject.count !== "nan";
            });
            const trace = {
                x: _.map(items, 'ensg'),
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
    renderGraph() {
        if (this.props.moduleData.tissueCounts.length > 0) {
            const genes = _.map(this.props.moduleData.tissueGenes, (gene) => (gene.ensg))
            const plotTraces = this.generatePlotTraces(this.props.moduleData.tissueCounts, genes)
            return (
                <Plot
                    data={plotTraces}
                    layout={{
                        width: 1100, height: 600, hovermode: 'closest',
                        title: `Top 25 expressed genes in ${this.props.moduleData.activeTissue.text} tissue`,
                        xaxis: {
                            categoryorder: "array",
                            categoryarray: _.values(genes)
                        }
                    }}
                />
            )
        } else if (this.state.selected) {
            return (
                <div>
                    <Segment>
                        <Dimmer active inverted>
                            <Loader content='Preparing transcription data...'/>
                        </Dimmer>
                        <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png'/>
                    </Segment>
                </div>
            )
        }
        return null
    }

    render() {
        const active=this.props.moduleData.activeTissue.id
        return (
            <Grid>
                <Grid.Row centered>
                    <Grid.Column width={8}>
                        <Form>
                            <Form.Field>
                                <label>Select a tissue</label>
                                <Dropdown value={active} placeholder='Tissue' search selection options={this.state.options}
                                          onChange={this.setActiveTissue}/>
                            </Form.Field>
                        </Form>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row centered>
                    <Grid.Column width={16}>
                        <center>
                            {this.renderGraph()}
                        </center>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

export default TissueFinder;
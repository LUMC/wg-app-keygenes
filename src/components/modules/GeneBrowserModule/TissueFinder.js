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
    Image, Input,
    Loader,
    Search,
    Segment, Table
} from "semantic-ui-react";
import _ from 'lodash'
import Plot from '../../../../node_modules/react-plotly.js/react-plotly';
import SmartDataTable from "react-smart-data-table";


const initialState = {isLoading: false, value: '', selected: false, stages: [], options: [], genes: []}

class TissueFinder extends Component {

    header = {
        columnKey: {
            text: 'Column 1',
            invisible: false,
            sortable: true,
            filterable: true,
        },
        tableActions: {
            text: 'Actions',
            invisible: false,
            sortable: false,
            filterable: false,
        }
    }
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
        this.props.setTissue({id: data.value, text: e.target.innerText})
    }
    generatePlotTraces = (data, genes) => {
        data = _.map(data, (item) => {
            if (genes.includes(item.ensg)) return item
        })
        console.log(data)
        data = _.compact(data)
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
            let genes = _.map(this.props.moduleData.tissueGenes, (gene, index) => {
                if (index < 20) {
                    return gene.ensg
                }
                return null
            })
            genes = _.compact(genes)
            const plotTraces = this.generatePlotTraces(this.props.moduleData.tissueCounts, genes)
            return (
                <>
                    <Header as='h3' dividing>
                        Top 25 expressed genes in {this.props.moduleData.activeTissue.text} tissue
                    </Header>
                    <center>
                    <Plot
                        data={plotTraces}
                        layout={{
                            width: 1100, height: 600, hovermode: 'closest',
                            xaxis: {
                                categoryorder: "array",
                                categoryarray: _.values(genes)
                            }
                        }}
                    />
                    </center>
                </>
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

    renderTableContent = () => {
        return this.props.moduleData.tissueGenes.map(
            (gene, index) => (
                <Table.Row>
                    <Table.Cell>{index + 1}</Table.Cell>
                    <Table.Cell>{gene.ensg}</Table.Cell>
                    <Table.Cell>{gene.symbol}</Table.Cell>
                    <Table.Cell>{gene.description}</Table.Cell>
                    <Table.Cell>{gene.count_avg}</Table.Cell>
                </Table.Row>
            )
        )
    }

    renderTable() {
        if (!this.props.moduleData.tissueGenes.length > 0) {
            return null
        }
        return (
            <>
                <Header as='h3' dividing>
                    Top 100 expressed genes in {this.props.moduleData.activeTissue.text} tissue
                </Header>
                <Form>
                    <Form.Group>
                        <Form.Field
                            width={10}
                        >
                            <Input action={{icon: 'search'}} placeholder='Search...'/>
                        </Form.Field>
                        <Form.Field
                            width={3}
                        >
                            <button className=" primary ui labeled icon button">
                                <i className="file icon right"></i>
                                Save to CSV file
                            </button>
                        </Form.Field>
                    </Form.Group>
                </Form>
                <Table basic>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>#</Table.HeaderCell>
                            <Table.HeaderCell>ENSG</Table.HeaderCell>
                            <Table.HeaderCell>Symbol</Table.HeaderCell>
                            <Table.HeaderCell>Description</Table.HeaderCell>
                            <Table.HeaderCell>Average count</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.renderTableContent()}
                    </Table.Body>
                </Table>
            </>
        )
    }

    render() {
        const active = this.props.moduleData.activeTissue.id
        return (
            <Grid>
                <Grid.Row centered>
                    <Grid.Column width={8}>
                        <Form>
                            <Form.Field>
                                <label>Select a tissue</label>
                                <Dropdown value={active} placeholder='Tissue' search selection
                                          options={this.state.options}
                                          onChange={this.setActiveTissue}/>
                            </Form.Field>
                        </Form>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row centered>
                    <Grid.Column width={16}>
                            {this.renderGraph()}
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={16}>
                        {this.renderTable()}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

export default TissueFinder;
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
import Plotly from 'plotly.js-basic-dist'
import createPlotlyComponent from 'react-plotly.js/factory';
import CsvDownload from 'react-json-to-csv'

const stages = [
    {
        key: 1,
        text: 'all',
        value: -1
    },
    {
        key: 2,
        text: 'adult',
        value: 1
    },
    {
        key: 3,
        text: 'fetal',
        value: 0
    },
]

const initialState = {stages: [], options: [], searchTerm: '', downloadData: [], stageOptions: stages, stageActive: -1, stageName: 'all'}

class TissueFinder extends Component {

    state = initialState;

    componentDidMount() {
        this.setState({stages: _.chain(this.props.collection.stage).
            keyBy('id').
            mapValues('name').value()})
        this.setState({
            options: _.map(this.props.collection.tissue, (state) => ({
                key: state.id,
                text: state.name,
                value: state.id,
            }))
        })
    }

    setActiveTissue = (e, data) => {
        this.props.setTissue({id: data.value, text: e.target.innerText}, this.state.stageActive)
    }
    generatePlotTraces = (data, genes) => {
        data = _.map(data, (item) => {
            if (genes.includes(item.symbol)) return item
        })
        data = _.compact(data)
        const plotTraces = [];
        const stage_groups = _.groupBy(data, 'stage')
        const stages = this.state.stages;
        Object.keys(stage_groups).forEach(function (key) {
            let items = _.remove(stage_groups[key], function (currentObject) {
                return currentObject.count !== "nan";
            });
            const trace = {
                x: _.map(items, 'symbol'),
                y: _.map(items, 'CPM'),
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
        const Plot = createPlotlyComponent(Plotly);
        if (this.props.moduleData.tissueCounts.length > 0) {
            let genes = _.map(this.props.moduleData.tissueGenes, (gene, index) => {
                if (index < 20) {
                    return gene.symbol
                }
                return null
            })
            genes = _.compact(genes)
            const plotTraces = this.generatePlotTraces(this.props.moduleData.tissueCounts, genes)
            console.log(genes)
            return (
                <>
                    <Header as='h3' dividing>
                        Top 20 expressed genes in {this.state.stageName} {this.props.moduleData.activeTissue.text} tissue
                    </Header>
                    <center>
                        <Plot
                            className={'full-size large'}
                            data={plotTraces}
                            layout={{
                                showlegend: true,
                                height: 600, hovermode: 'closest',
                                xaxis: {
                                    categoryarray: _.values(genes)
                                },
                                yaxis:{
                                    title: "Counts per million (CPM)"
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
        }else if (this.props.moduleData.geneCounts.length === 0 && this.props.moduleData.activeTissue != ''){
            return <div><center><b>No gene expression found!</b></center></div>
        }
        return null
    }

    renderTableContent = () => {
        const content = this.props.moduleData.tissueGenes.map(
            (gene, index) => {
                if (!(gene.ensg.includes(this.state.searchTerm)
                    || gene.symbol.includes(this.state.searchTerm)
                    || gene.description.includes(this.state.searchTerm))) return null
                return (
                    <Table.Row key={`tissueItem-${index}`}>
                        <Table.Cell>{index + 1}</Table.Cell>
                        <Table.Cell>
                            <a
                                className={'tableLink'}
                                href={`https://www.ensembl.org/Homo_sapiens/Gene/Summary?db=core;g=${gene.ensg}`}
                                target={'_blank'}
                            >
                                {gene.ensg}
                            </a>
                        </Table.Cell>
                        <Table.Cell>{gene.symbol}</Table.Cell>
                        <Table.Cell>{gene.description}</Table.Cell>
                        <Table.Cell>{gene.CPM_avg}</Table.Cell>
                    </Table.Row>
                )
            }
        )
        return _.compact(content)
    }
    setActiveStage = (e, data) =>{
        this.setState({stageActive: data.value})
        this.setState({stageName: e.target.innerText})
        if(this.props.moduleData.activeTissue.id != ''){
            this.props.setTissue(this.props.moduleData.activeTissue, data.value)
        }
    }
    filterGeneResults = (e) => {
        this.setState({searchTerm: e.target.value})
    }

    renderTable() {
        if (!this.props.moduleData.tissueGenes.length > 0) {
            return null
        }
        return (
            <>
                <Header as='h3' dividing>
                    Top 100 expressed genes in {this.state.stageName} {this.props.moduleData.activeTissue.text} tissue
                </Header>
                <Form>
                    <Form.Group>
                        <Form.Field
                            width={10}
                        >
                            <Input onChange={this.filterGeneResults} action={{icon: 'search'}} placeholder='Search...'/>
                        </Form.Field>
                        <Form.Field
                            width={3}
                        >
                            <CsvDownload
                                filename={`KeyGenes-${this.props.moduleData.activeTissue.text}-tissue.csv`}
                                data={this.renderDownloadData()}
                                className=" primary ui labeled icon button" >
                                <i className="file icon right"></i>
                                Save table (.CSV)
                            </CsvDownload>
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
                            <Table.HeaderCell>Average CPM</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.renderTableContent()}
                    </Table.Body>
                </Table>
            </>
        )
    }
    renderDownloadData = () =>{
        return _.compact(_.map(this.props.moduleData.tissueGenes, (
            (gene) => ({
                ENSG: gene.ensg,
                Symbol: gene.symbol,
                AVG_count: gene.count_avg,
                Description: gene.description

            })
        )))
    }
    render() {
        const active = this.props.moduleData.activeTissue.id
        return (
            <Grid>
                <Grid.Row centered>
                    <Grid.Column width={8}>
                        <Form>
                            <Form.Field>
                                <label>Select a development stage</label>
                                <Dropdown value={this.state.stageActive} placeholder='Stage' search selection
                                          options={this.state.stageOptions}
                                          onChange={this.setActiveStage}
                                          />
                            </Form.Field>
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
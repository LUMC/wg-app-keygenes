import React, {Component} from 'react'

import {
    Container, Dropdown,
    Grid,
    Menu,
    Transition
} from "semantic-ui-react";
import SplitText from 'react-pose-text';
import {Link, Router} from "react-router-dom";
import history from "../history";
import Particles from "react-particles-js";

const charPoses = {
    exit: {opacity: 0, y: 20},
    enter: {
        opacity: 1,
        y: 0,
        delay: ({charIndex}) => charIndex * 60
    }
};

class App extends Component {
    renderSubMenu(items){
        if(items.length < 1){
            return null
        }
        return (
            <Dropdown text='More' pointing className='link item'>
                <Dropdown.Menu>
                    {
                        items.map(
                            (item, key) => (
                                <Dropdown.Item
                                        name={item.reference}
                                        key={`menuItem-${key}`}
                                        as={Link}
                                        to={'/' + item.reference}>
                                        {item.name}
                                </Dropdown.Item>
                            )
                        )
                    }
                </Dropdown.Menu>
            </Dropdown>
        )
    }
    renderMenu() {
        if (this.props.menu.length < 1) {
            return null
        }
        const subitems = []
        return (
            <Menu inverted widths={6} className={'mainMenu'} pointing secondary>
                <Router history={history}>
                    {
                        this.props.menu.map(
                            (item, key) => {
                                if(item.subitem){
                                    subitems.push(item);
                                    return null
                                }
                                return (
                                    <Menu.Item
                                        name={item.reference}
                                        key={`menuItem-${key}`}
                                        as={Link}
                                        to={'/' + item.reference}>
                                        {item.name}
                                    </Menu.Item>)
                            })
                    }
                    {
                        this.renderSubMenu(subitems)
                    }
                </Router>
            </Menu>
        )
    }

    render() {
        return (
            <>
                <div className='appContent'>
                    <div className={'welcome'}>
                        <Transition
                            visible={this.props.sloganText}
                            animation={"fade up"}
                            duration={{show: 2000}}
                        >
                            <div>
                                <Particles
                                    className={'particles'}
                                    params={{
                                        "particles": {
                                            "number": {
                                                "value": 40
                                            },
                                            "size": {
                                                "value": 3
                                            }
                                        }
                                    }}/>
                            </div>
                        </Transition>
                        <Container>
                            <Grid columns={1}>
                                <Grid.Row verticalAlign='middle' className={'welcome-box'}>
                                    <Grid.Column textAlign={'center'}>
                                        <div className="introName">
                                            <SplitText initialPose="exit" pose="enter" charPoses={charPoses}>
                                                {this.props.applicationDetails.title}
                                            </SplitText>
                                        </div>
                                        <div className="sloganText">
                                            <Transition
                                                unmountOnHide={false}
                                                visible={this.props.sloganText}
                                                animation={"fade up"}
                                                duration={{show: 1000}}
                                            >
                                                <div>
                                                    {this.props.applicationDetails.sub_title}
                                                </div>
                                            </Transition>
                                        </div>
                                    </Grid.Column>
                                </Grid.Row>
                                <Transition
                                    unmountOnHide={false}
                                    visible={this.props.sloganText}
                                    animation={"fade down"}
                                    duration={{show: 800}}
                                >
                                    <Grid.Row>
                                        <Grid.Column>
                                            {this.renderMenu()}
                                        </Grid.Column>
                                    </Grid.Row>
                                </Transition>
                            </Grid>
                        </Container>
                    </div>
                    <Transition
                        unmountOnHide={false}
                        visible={this.props.sloganText}
                        animation={"fade up"}
                        duration={{show: 1000}}
                    >
                        <div className={'page-section'}>
                            <Container>
                                {this.props.activePageContent}
                            </Container>
                        </div>
                    </Transition>
                </div>
            </>
        )
    }
}

export default App
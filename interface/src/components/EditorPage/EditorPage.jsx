import React from 'react';
import Data from '../../data';
import config from './config.js';
import { Link } from 'react-router';
require('./EditorPage.scss');

const data = Data;
let editorActivities = [];

export default class MainApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data};
        this.firstTime = true;
    }

    displayActivityParams(activity) {
        return JSON.stringify(activity.params)
    }

    displayInput(activity) {
        if (!activity.input) activity.input = {};
        return (<table>
            <tbody>
            <tr>
                <td>JSON Path</td>
                <td><input type="text"
                           onChange={this.handleChange.bind(this,activity.id,['input', '_jsonPath'])}
                           value={activity.input._jsonPath}/></td>
            </tr>
            <tr>
                <td>Transformation</td>
                <td><input type="text"
                           onChange={this.handleChange.bind(this,activity.id,['input', '_transformation'])}
                           value={activity.input._transformation}/></td>
            </tr>
            </tbody>
        </table>);
    }

    handleChange(activityId, input, event) {
        if (typeof input === 'string') this.state.data.activities[activityId][input] = event.target.value;
        else {
            let current = this.state.data.activities[activityId];
            let i = 0;
            for (let part of input) {
                if (i++ === input.length - 1) break;
                current = current[part];
            }

            current[input[input.length - 1]] = event.target.value;
        }
        this.forceUpdate(this.state.selected);
    }


    displayProperties() {
        if (!this.state.currentActivity) return;
        let activity = this.state.data.activities[this.state.currentActivity];
        return <div>
            <table>
                <tbody>
                <tr>
                    <td>Type</td>
                    <td>{activity.type} ({activity.id})</td>
                </tr>
                <tr>
                    <td>Name</td>
                    <td><input type="text" value={activity.name}
                               onChange={this.handleChange.bind(this,activity.id,'name')}/></td>
                </tr>
                <tr>
                    <td>Input</td>
                    <td>{this.displayInput(activity)}</td>
                </tr>
                <tr>
                    <td>Parameters</td>
                    <td>{this.displayActivityParams(activity)}</td>
                </tr>
                </tbody>
            </table>
        </div>
    }

    handleClick(id) {
        this.setState({currentActivity: id});
    }

    enableJsPlumb(item) {
        jsPlumb.draggable(item.id, config.activityOpts);
        if (this.state.data.starter === item.id) jsPlumb.addEndpoint(item.id, {anchor: "Left"}, config.startEndpoint);
        else jsPlumb.addEndpoint(item.id, {anchor: "Left"}, config.endpointOpts.left);

        if (this.state.data.finisher === item.id) jsPlumb.addEndpoint(item.id, {anchor: "Right"}, config.endEndpoint);
        else jsPlumb.addEndpoint(item.id, {anchor: "Right"}, config.endpointOpts.right);

        for (let transition of item.transitions) {
            jsPlumb.connect({
                source: item.id, target: transition, anchors: ["Right", "Left"], connector: "Straight"
            });
        }
    }

    generateDiagram(activities) {
        let spacingMultiplier = 0.5;
        let htmlElements = [];
        for (let activityId in activities) {
            if (!activities.hasOwnProperty(activityId)) continue;
            let activity = this.state.data.activities[activityId];
            let style = {left: `${spacingMultiplier++ * config.spacing}px`};

            htmlElements.push(
                <div key={activityId} id={activityId} className="activity" style={style}
                     onDoubleClick={this.handleClick.bind(this, activityId)}>
                    <img className="activity-icon" src={config.activitiesIcons[activity.type]}/>
                    <div className="activity-name">{activity.name}</div>
                </div>);
            editorActivities.push(activity);
        }

        if (this.firstTime) {
            jsPlumb.ready(() => {
                jsPlumb.getInstance().importDefaults(config.jsplumbOpts);
                editorActivities.forEach(this.enableJsPlumb.bind(this));
            });
            this.firstTime = false;
        }

        return htmlElements;
    }

    render() {
        return (
            <div id="editor">
                <div id="diagramContainer">
                    {this.generateDiagram(this.state.data.activities)}
                </div>
                <div id="properties">
                    {this.displayProperties()}
                </div>
            </div>
        );
    }
}
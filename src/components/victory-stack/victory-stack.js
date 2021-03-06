import { assign, defaults } from "lodash";
import PropTypes from "prop-types";
import React from "react";
import { Helpers, VictorySharedEvents, VictoryContainer, VictoryTheme } from "victory-core";
import Wrapper from "../../helpers/wrapper";
import { getChildren, getCalculatedProps } from "./helper-methods";
import { BaseProps } from "../../helpers/common-props";


const fallbackProps = {
  width: 450,
  height: 300,
  padding: 50
};

export default class VictoryStack extends React.Component {
  static displayName = "VictoryStack";

  static role = "stack";

  static propTypes = {
    ...BaseProps,
    categories: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.shape({
        x: PropTypes.arrayOf(PropTypes.string), y: PropTypes.arrayOf(PropTypes.string)
      })
    ]),
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node), PropTypes.node
    ]),
    colorScale: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.oneOf([
        "grayscale", "qualitative", "heatmap", "warm", "cool", "red", "green", "blue"
      ])
    ]),
    fillInMissingData: PropTypes.bool,
    horizontal: PropTypes.bool,
    labelComponent: PropTypes.element,
    labels: PropTypes.oneOfType([ PropTypes.func, PropTypes.array ]),
    style: PropTypes.shape({
      parent: PropTypes.object, data: PropTypes.object, labels: PropTypes.object
    }),
    xOffset: PropTypes.number
  };

  static defaultProps = {
    containerComponent: <VictoryContainer/>,
    groupComponent: <g/>,
    scale: "linear",
    standalone: true,
    theme: VictoryTheme. grayscale,
    fillInMissingData: true
  };

  static expectedComponents = [
    "groupComponent", "containerComponent", "labelComponent"
  ];

  static getChildren = getChildren;

  constructor(props) {
    super(props);
    if (props.animate) {
      this.state = {
        nodesShouldLoad: false,
        nodesDoneLoad: false,
        animating: true
      };
      this.setAnimationState = Wrapper.setAnimationState.bind(this);
      this.events = Wrapper.getAllEvents(props);
    }
  }

  componentWillMount() {
    this.events = Wrapper.getAllEvents(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.animate) {
      this.setAnimationState(this.props, nextProps);
    }
    this.events = Wrapper.getAllEvents(nextProps);
  }

  // the old ones were bad
  getNewChildren(props, childComponents, calculatedProps) {
    const children = getChildren(props, childComponents, calculatedProps);
    const getAnimationProps = Wrapper.getAnimationProps.bind(this);
    return children.map((child, index) => {
      const childProps = assign({ animate: getAnimationProps(props, child, index) }, child.props);
      return React.cloneElement(child, childProps);
    });
  }

  renderContainer(containerComponent, props) {
    const containerProps = defaults({}, containerComponent.props, props);
    return React.cloneElement(containerComponent, containerProps);
  }

  getContainerProps(props, calculatedProps) {
    const { width, height, standalone, theme, polar, horizontal } = props;
    const { domain, scale, style, origin } = calculatedProps;
    return {
      domain, scale, width, height, standalone, theme, style: style.parent, horizontal,
      polar, origin
    };
  }

  render() {
    const { role } = this.constructor;
    const props = this.state && this.state.nodesWillExit ?
      this.state.oldProps || this.props : this.props;
    const modifiedProps = Helpers.modifyProps(props, fallbackProps, role);
    const {
      eventKey, containerComponent, standalone, groupComponent, externalEventMutations
    } = modifiedProps;
    const childComponents = React.Children.toArray(modifiedProps.children);
    const calculatedProps = getCalculatedProps(modifiedProps, childComponents);
    const newChildren = this.getNewChildren(modifiedProps, childComponents, calculatedProps);
    const containerProps = standalone ? this.getContainerProps(modifiedProps, calculatedProps) : {};
    const container = standalone ?
      this.renderContainer(containerComponent, containerProps) : groupComponent;
    if (this.events) {
      return (
        <VictorySharedEvents
          container={container}
          eventKey={eventKey}
          events={this.events}
          externalEventMutations={externalEventMutations}
        >
          {newChildren}
        </VictorySharedEvents>
      );
    }

    return React.cloneElement(container, container.props, newChildren);
  }
}

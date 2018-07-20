import { Selection } from "victory-core";
import { throttle, isFunction } from "lodash";
import BrushHelpers from "./brush-helpers";

const CursorHelpers = {
  onMouseMove(evt, targetProps) {
    const { onCursorChange, cursorDimension, domain } = targetProps;
    const parentSVG = targetProps.parentSVG || Selection.getParentSVG(evt);
    const cursorSVGPosition = Selection.getSVGEventCoordinates(evt, parentSVG);
    let cursorValue = Selection.getDataCoordinates(
      targetProps,
      targetProps.scale,
      cursorSVGPosition.x,
      cursorSVGPosition.y
    );

    const inBounds = BrushHelpers.withinBounds(cursorValue, {
      x1: domain.x[0],
      x2: domain.x[1],
      y1: domain.y[0],
      y2: domain.y[1]
    });

    if (!inBounds) {
      cursorValue = null;
    }

    if (isFunction(onCursorChange)) {
      if (inBounds) {
        const value = cursorDimension ? cursorValue[cursorDimension] : cursorValue;
        onCursorChange(value, targetProps);
      } else if (cursorValue !== targetProps.cursorValue) {
        onCursorChange(targetProps.defaultCursorValue || null, targetProps);
      }
    }

    return [{
      target: "parent",
      eventKey: "parent",
      mutation: () => ({ cursorValue, parentSVG })
    }];
  },

  onTouchStart(evt, targetProps) {
    const { onCursorChangeStart, cursorDimension, domain } = targetProps;
    const parentSVG = targetProps.parentSVG || Selection.getParentSVG(evt);
    const cursorSVGPosition = Selection.getSVGEventCoordinates(evt, parentSVG);
    let cursorValue = Selection.getDataCoordinates(
      targetProps,
      targetProps.scale,
      cursorSVGPosition.x,
      cursorSVGPosition.y
    );

    const inBounds = BrushHelpers.withinBounds(cursorValue, {
      x1: domain.x[0],
      x2: domain.x[1],
      y1: domain.y[0],
      y2: domain.y[1]
    });

    if (!inBounds) {
      cursorValue = null;
    }

    if (isFunction(onCursorChangeStart)) {
      if (inBounds) {
        const value = cursorDimension ? cursorValue[cursorDimension] : cursorValue;
        onCursorChangeStart(value, targetProps);
      } else if (cursorValue !== targetProps.cursorValue) {
        onCursorChangeStart(targetProps.defaultCursorValue || null, targetProps);
      }
    }

    return [{
      target: "parent",
      eventKey: "parent",
      mutation: () => ({ cursorValue, parentSVG })
    }];
  },

  onTouchEnd(evt, targetProps) {
    const { onCursorChangeEnd, cursorDimension, domain } = targetProps;
    const parentSVG = targetProps.parentSVG || Selection.getParentSVG(evt);
    const cursorSVGPosition = Selection.getSVGEventCoordinates(evt, parentSVG);
    let cursorValue = Selection.getDataCoordinates(
      targetProps,
      targetProps.scale,
      cursorSVGPosition.x,
      cursorSVGPosition.y
    );

    const inBounds = BrushHelpers.withinBounds(cursorValue, {
      x1: domain.x[0],
      x2: domain.x[1],
      y1: domain.y[0],
      y2: domain.y[1]
    });

    if (!inBounds) {
      cursorValue = null;
    }

    if (isFunction(onCursorChangeEnd)) {
      if (inBounds) {
        const value = cursorDimension ? cursorValue[cursorDimension] : cursorValue;
        onCursorChangeEnd(value, targetProps);
      } else if (cursorValue !== targetProps.cursorValue) {
        onCursorChangeEnd(targetProps.defaultCursorValue || null, targetProps);
      }
    }

    return [{
      target: "parent",
      eventKey: "parent",
      mutation: () => ({ cursorValue, parentSVG })
    }];
  }
};

export default {
  onMouseMove: throttle(
    CursorHelpers.onMouseMove.bind(CursorHelpers),
    32, // eslint-disable-line no-magic-numbers
    { leading: true, trailing: false }),
  onTouchStart: throttle(
    CursorHelpers.onTouchStart.bind(CursorHelpers),
    32, // eslint-disable-line no-magic-numbers
    { leading: true, trailing: false }),
  onTouchEnd: throttle(
    CursorHelpers.onTouchEnd.bind(CursorHelpers),
    32, // eslint-disable-line no-magic-numbers
    { leading: true, trailing: false })
};

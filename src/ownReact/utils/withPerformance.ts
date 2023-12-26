import { isComponentElement, isTextElement } from "../types/is";
import { Element, Instance } from "../types/types";

type ComponentNameWithId = string;
interface ProfilerEntry {
  name: ComponentNameWithId;
  reconciliation: PerformanceEntry;
  domUpdate: PerformanceEntry;
  checksForUpdate: PerformanceEntry;
}

type NumberOfRedundantUpdates = number;
class Profiler {
  entries: ProfilerEntry[];
  isTracking: boolean;
  isRealTimeInfoEnabled: boolean;
  redundantUpdatesCounters: Map<ComponentNameWithId, NumberOfRedundantUpdates>;
  unnecessaryRendersMap: Map<ComponentNameWithId, { name: string, duration: number }>;

  constructor() {
    this.entries = [];
    this.isTracking = true;
    this.isRealTimeInfoEnabled = true;
    this.redundantUpdatesCounters = new Map();
    this.unnecessaryRendersMap = new Map();
  }

  clear() {
    this.entries = [];
    performance.clearMarks();
    performance.clearMeasures();
  }

  startTracking() {
    this.isTracking = true;
  }

  stopTracking() {
    this.isTracking = false;
  }

  print() {
    console.table(this.entries);
  }

  toggleRealTimeInfo() {
    this.isRealTimeInfoEnabled = !this.isRealTimeInfoEnabled;
  }
}

declare global {
  interface Window {
    performance_profiler: Profiler;
  }
}

if (window && !window.performance_profiler) {
  window.performance_profiler = new Profiler();
}

type GetElementName = (element: Element) => string;
const getElementName: GetElementName = (element) => {
  if (isTextElement(element)) {
    return `TEXT_ELEMENT ${element.props.nodeValue}`;
  }

  if (isComponentElement(element)) {
    return element.type.name;
  }

  return element.type;
};

const isShallowEqual = (obj1, obj2) => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  const hasDifferentValue = keys1.some((key) => obj1[key] !== obj2[key]);
  const hasDifferentKey = keys1.some((key) => !Object.hasOwnProperty.call(obj2, key));

  return !hasDifferentValue && !hasDifferentKey;
}

export function withPerformanceUpdate(fn, name = fn.name) {
  return function (params) {
    if (!window.performance_profiler.isTracking) return fn(params);

    const element = params?.instance?.element ?? params?.element;
    const id = element.__id;
    const elementName = getElementName(element);

    performance.mark(`${elementName} start reconciliation (${id})`);
    const result = fn(params);
    performance.mark(`${elementName} end reconciliation (${id})`);

    const reconciliationPerformanceMeasurement = performance.measure(
      `${elementName} reconciliation`,
      `${elementName} start reconciliation (${id})`,
      `${elementName} end reconciliation (${id})`,
    );
    const domUpdateMeasurement = performance.measure(
      `${elementName} DOM update`,
      `${elementName} start DOM update (${id})`,
      `${elementName} end DOM update (${id})`,
    );

    const checksPerformanceDuration =
      reconciliationPerformanceMeasurement.duration -
      domUpdateMeasurement.duration;

    const profiler = window.performance_profiler;
    let isUnnecessaryRender = false;
    const prevElement = params?.instance?.element;
    const nextElement = params?.element;

    const prevElementProps = prevElement?.props;
    const nextElementProps = nextElement?.props;

    if (prevElementProps && nextElementProps) {
      const arePropsTheSame = isShallowEqual(prevElementProps, nextElementProps);
      const areStateTheSame = isShallowEqual(params.instance.publicInstance.state, params.instance.publicInstance.prevState);

      isUnnecessaryRender = arePropsTheSame && areStateTheSame;

      if (isUnnecessaryRender) {
        profiler.unnecessaryRendersMap.set(
          id,
          {
            name: `${name}/${elementName}`,
            duration: domUpdateMeasurement.duration,
          }
        );
      }
    }

    const profilerEntry = {
      name: `${name}/${elementName}`,
      reconciliation: reconciliationPerformanceMeasurement,
      domUpdate: domUpdateMeasurement,
      isUnnecessaryRender,
      potentialSavingTime: 0,
      checksForUpdate: {
        name: `${name}/${elementName}`,
        duration: checksPerformanceDuration,
        entryType: "measure",
        startTime: reconciliationPerformanceMeasurement.startTime,
        toJSON: () => this.toJSON(),
      },
    };

    profiler.entries.push(profilerEntry);

    if (profiler.isRealTimeInfoEnabled && profiler.isTracking) {
      console.group(name);
      console.log(
        `${elementName} reconciliation: ${reconciliationPerformanceMeasurement.duration}ms`,
      );
      console.log(
        `${elementName} DOM update took: ${domUpdateMeasurement.duration}ms`,
      );
      console.log(
        `${elementName} checks: ${checksPerformanceDuration}ms`,
      );
      console.groupEnd();
    }

    return result;
  };
}

const startDomUpdate = (element: Element) => {
  const name = getElementName(element);
  const id = element.__id;

  if (element.parentElement) {
    startDomUpdate(element.parentElement);
  }

  performance.mark(`${name} start DOM update (${id})`);
}

const endDomUpdate = (element: Element) => {
  const name = getElementName(element);
  const id = element.__id;
  performance.mark(`${name} end DOM update (${id})`);

  if (element.parentElement) {
    endDomUpdate(element.parentElement);
  }
}


interface ParamsInstance {
  instance: Instance;
  element?: Element;
}
interface ParamsElement {
  instance?: Instance;
  element: Element;
}
type Params = ParamsInstance | ParamsElement;
type PerformanceWrapper = (params: Params) => unknown;
type WithPerformanceDomChange = <T extends PerformanceWrapper>(fn: T) => T;
export const withPerformanceDomChange: WithPerformanceDomChange = (fn) => {
  const performanceWrapper: PerformanceWrapper = (params) => {
    if (!window.performance_profiler.isTracking) return fn(params);

    const element = params?.instance?.element ?? params?.element;
    const id = element.__id;

    const elementName = getElementName(element);

    if (element.parentElement) {
      startDomUpdate(element.parentElement);
    }

    performance.mark(`${elementName} start DOM update (${id})`);
    const result = fn(params);
    performance.mark(`${elementName} end DOM update (${id})`);

    if (element.parentElement) {
      endDomUpdate(element.parentElement);
    }

    return result;
  };

  return performanceWrapper;
}

export const withPerformanceCheckUnnecessaryRender = (fn) => {
  const performanceWrapper = (params) => {
    const result = fn(params);
    if (params?.instance?.element?.type?.name === "TestShallowCheck") {
      debugger;
    }

    if (!window.performance_profiler.isTracking) return result;

    const element = params?.instance?.element ?? params?.element;
    const id = element.__id;

    const isUnnecessaryUpdate = window.performance_profiler.unnecessaryRendersMap.has(id)

    if (isUnnecessaryUpdate) {
      const { name, duration } = window.performance_profiler.unnecessaryRendersMap.get(id);

      console.warn(
        `${name} wasted render: ${duration}ms`,
      );

      window.performance_profiler.unnecessaryRendersMap.delete(id);
    }

    return result;
  };

  return performanceWrapper;
}

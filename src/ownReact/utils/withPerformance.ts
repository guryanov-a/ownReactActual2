import { isComponentElement, isTextElement } from "../types/is";
import { Element, Instance } from "../types/types";

type ComponentNameWithId = string;
interface ProfilerEntry {
  name: ComponentNameWithId;
  reconciliation: PerformanceEntry;
  domUpdate: PerformanceEntry;
  checks: PerformanceEntry;
}

class Profiler {
  entries: ProfilerEntry[];
  isTracking: boolean;

  constructor() {
    this.entries = [];
    this.isTracking = true;
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

export function withPerformanceUpdate(fn, name = fn.name) {
  return function (params) {
    if (!window.performance_profiler.isTracking) return fn(params);

    const element = params?.instance?.element ?? params?.element;
    const id = element.__id;
    const elementName = getElementName(element);
    performance.mark(`${name}/${elementName} start reconciliation (${id})`);
    const result = fn(params);
    performance.mark(`${name}/${elementName} end reconciliation (${id})`);

    const reconciliationPerformanceMeasurement = performance.measure(
      `${name}/${elementName} reconciliation (${id})`,
      `${name}/${elementName} start reconciliation (${id})`,
      `${name}/${elementName} end reconciliation (${id})`,
    );
    const domUpdateMeasurement = performance.measure(
      `${elementName} DOM update (${id})`,
      `${elementName} start DOM update (${id})`,
      `${elementName} end DOM update (${id})`,
    );

    const checksPerformanceDuration =
      reconciliationPerformanceMeasurement.duration -
      domUpdateMeasurement.duration;

    window.performance_profiler.entries.push({
      name: `${name}/${elementName} (${id})`,
      reconciliation: reconciliationPerformanceMeasurement,
      domUpdate: domUpdateMeasurement,
      checks: {
        name: `${name}/${elementName} (${id})`,
        duration: checksPerformanceDuration,
        entryType: "measure",
        startTime: reconciliationPerformanceMeasurement.startTime,
        toJSON: () => this.toJSON(),
      },
    });

    console.log(
      `${name}/${elementName} reconciliation: ${reconciliationPerformanceMeasurement.duration}ms`,
    );
    console.log(
      `${name}/${elementName} DOM update took: ${domUpdateMeasurement.duration}ms`,
    );
    console.log(
      `${name}/${elementName} checks: ${checksPerformanceDuration}ms`,
    );

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



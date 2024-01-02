import { isComponentElement as checkIfComponentElement, isDomElement as checkIfDomElement, isTextElement } from "../types/is";
import { Element, Instance } from "../types/types";

type ComponentNameWithId = string;
interface ProfilerEntry {
  name: ComponentNameWithId;
  reconciliation: PerformanceEntry;
  domUpdate: PerformanceEntry;
  checksForUpdate: PerformanceEntry;
}

type UnnecessaryRenderTreeInfo = { count: number, duration: number };
type ElementInTreeName = string;
class Profiler {
  entries: ProfilerEntry[];
  isTracking: boolean;
  isRealTimeInfoEnabled: boolean;
  unnecessaryRendersTreeInfo: Map<ElementInTreeName, UnnecessaryRenderTreeInfo>;
  unnecessaryRendersMap: Map<ComponentNameWithId, { name: string, duration: number }>;

  constructor() {
    this.entries = [];
    this.isTracking = true;
    this.isRealTimeInfoEnabled = true;
    this.unnecessaryRendersTreeInfo = new Map();
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

  if (checkIfComponentElement(element)) {
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

const getComponentParentElement = (element: Element): Element => {
  let parentElement = element.parentElement;

  while(!checkIfComponentElement(parentElement)) {
      parentElement = parentElement.parentElement;
  }

  return parentElement;
}

const getChainName = (element: Element): string => {
  let resultName = getElementName(element);
  let currElement = element;
  let parentElement = element.parentElement;

  while(parentElement) {
    const parentElementName = getElementName(parentElement);
    resultName = parentElementName + " > " + resultName;
    currElement = parentElement;
    parentElement = currElement.parentElement;
  }

  return resultName;
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
      `${elementName} reconciliation (${id})`,
      `${elementName} start reconciliation (${id})`,
      `${elementName} end reconciliation (${id})`,
    );
    const domUpdateMeasurement = performance.measure(
      `${elementName} DOM update (${id})`,
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
      const prevState = params.instance.publicInstance.prevState;
      const nextState = params.instance.publicInstance.state;

      const arePropsTheSame = isShallowEqual(prevElementProps, nextElementProps);
      const areStateTheSame = isShallowEqual(prevState, nextState);
      isUnnecessaryRender = arePropsTheSame && areStateTheSame;

      if (isUnnecessaryRender && name === 'Component instance update') {
        console.warn(
          `${elementName} unnecessary render: ${domUpdateMeasurement.duration}ms`
        );

        const chainName = getChainName(element);

        if (profiler.unnecessaryRendersTreeInfo.has(chainName)) {
          profiler.unnecessaryRendersTreeInfo.set(
            chainName,
            {
              count: profiler.unnecessaryRendersTreeInfo.get(chainName).count + 1,
              duration: profiler.unnecessaryRendersTreeInfo.get(chainName).duration + domUpdateMeasurement.duration,
            }
          );
        } else {
          profiler.unnecessaryRendersTreeInfo.set(chainName, {
            count: 1,
            duration: domUpdateMeasurement.duration,
          });
        }
        
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
      potentialSavingTime: isUnnecessaryRender ? domUpdateMeasurement.duration : 0,
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
  const parentElement = element.parentElement;
  const isParentDomElement = parentElement && checkIfDomElement(parentElement);

  if (parentElement && !isParentDomElement) {
    startDomUpdate(parentElement);
  }

  const elementName = getElementName(element);
  const id = element.__id;
  performance.mark(`${elementName} start DOM update (${id})`);
}

const endDomUpdate = (element: Element) => {
  const name = getElementName(element);
  const id = element.__id;
  performance.mark(`${name} end DOM update (${id})`);
  const parentElement = element.parentElement;
  const isParentDomElement = parentElement && checkIfDomElement(parentElement);

  if (parentElement && !isParentDomElement) {
    endDomUpdate(parentElement);
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

    if (element.parentElement && checkIfComponentElement(element.parentElement)) {
      startDomUpdate(element.parentElement);
    }

    performance.mark(`${elementName} start DOM update (${id})`);
    const result = fn(params);
    performance.mark(`${elementName} end DOM update (${id})`);

    if (element.parentElement && checkIfComponentElement(element.parentElement)) {
      endDomUpdate(element.parentElement);
    }

    return result;
  };

  return performanceWrapper;
}

export const withCountingUnnecessaryRenders = (fn) => {
  const wrapper = (params) => {
    const element = params?.instance?.element ?? params?.element;
    const id = element.__id;
    const totalRendersBeforeUpdate = window.performance_profiler.entries.length;

    performance.mark(`total update time start (${id})`);
    const result = fn(params);
    performance.mark(`total update time end (${id})`);

    const totalUpdateTime = performance.measure(
      `total update time (${id})`,
      `total update time start (${id})`,
      `total update time end (${id})`,
    );

    if (!window.performance_profiler.isTracking) return result;

    if (window.performance_profiler.unnecessaryRendersMap.size > 0) {
      let totalPotentialSavingTime = 0;

      console.group('Unnecessary renders info');
      for (const [key, value] of window.performance_profiler.unnecessaryRendersTreeInfo.entries()) {
        console.warn(`${key}: ${value.count} unnecessary updates, ${value.duration}ms of potential saving`);
        totalPotentialSavingTime += value.duration;
      }
      window.performance_profiler.unnecessaryRendersTreeInfo.clear();
      const totalUnnecessaryRenders = window.performance_profiler.unnecessaryRendersMap.size;
      window.performance_profiler.unnecessaryRendersMap.clear();
      const totalPotentialSavingTimeInMs = totalPotentialSavingTime.toFixed(2);
      const totalRenders = window.performance_profiler.entries.length;
      console.warn(`Unnecessary renders: ${totalUnnecessaryRenders} (total renders: ${totalRenders-totalRendersBeforeUpdate}), Potential saving time: ${totalPotentialSavingTimeInMs}ms (total time: ${totalUpdateTime.duration.toFixed(2)}ms)`);
      console.groupEnd();
    }

    return result;
  };

  return wrapper;
}

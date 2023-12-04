class Profiler {
  entries: Record<string, PerformanceEntry>;
  isTracking: boolean;

  constructor() {
    this.entries = {};
    this.isTracking = false;
  }

  clear() {
    this.entries = {};
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

const getElementName = (element) => {
  if (element.type === "TEXT_ELEMENT") {
    return `TEXT_ELEMENT ${element.props.nodeValue}`;
  }

  if (typeof element.type === "function") {
    return element.type.name;
  }

  return element.type;
};

export function withPerformanceUpdate(fn, name = fn.name) {
  return function (args) {
    const element = args?.instance?.element ?? args?.element;
    const id = element.__id ?? element.__id;
    const elementName = getElementName(element);
    performance.mark(`${name}/${elementName} start reconciliation (${id})`);
    const result = fn(args);

    window.requestAnimationFrame(() => {
      // additional frame so there would not be race condition with the DOM performance check
      // (it's not 100% accurate but the actual DOM update in a browser happens asyncronically after a code run anyway)
      // TODO: check that it works as intended
      window.requestAnimationFrame(() => {
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

        console.log(
          `${name}/${elementName} reconciliation: ${reconciliationPerformanceMeasurement.duration}`,
        );
        console.log(
          `${name}/${elementName} DOM update took: ${domUpdateMeasurement.duration}`,
        );
        console.log(
          `${name}/${elementName} checks: ${checksPerformanceDuration}`,
        );
      });
    });

    return result;
  };
}

export function withPerformanceDomChange(fn) {
  return function (args) {
    const element = args?.instance?.element ?? args?.element;
    const id = element.__id ?? element.__id;

    const elementName = getElementName(element);

    performance.mark(`${elementName} start DOM update (${id})`);
    const result = fn(args);

    // actual DOM update happens asyncronically after the code run at least in the next frame
    window.requestAnimationFrame(() => {
      performance.mark(`${elementName} end DOM update (${id})`);

      const domUpdateMeasurement = performance.measure(
        `${elementName} DOM update (${id})`,
        `${elementName} start DOM update (${id})`,
        `${elementName} end DOM update (${id})`,
      );

      console.log(
        `${elementName} DOM update took: ${domUpdateMeasurement.duration} (${id})`,
      );
    });

    return result;
  };
}

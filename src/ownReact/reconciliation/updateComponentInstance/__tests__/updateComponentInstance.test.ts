import { strictest } from 'esmock'
import { identity } from 'ramda';

describe("updateComponentInstance", () => {
  test("checks that it works correctly", async () => {
    const container = document.createElement("div");
    const currentElement = {
      type: class MockClass {},
      props: {
        className: "componentInstance",
      },
    };
    const currentChildInstance = {
      dom: {},
      element: {
        type: "div",
        props: {
          className: "currentChildInstance",
        },
      },
    };
    const currentInstance = {
      dom: {},
      childInstance: currentChildInstance,
      element: currentElement,
    };
    const nextInstanceElement = {
      type: "div",
      props: {
        className: "nextInstanceElement",
      },
    };
    const expectedNextChildInstance = {
      dom: {},
      element: {
        type: "div",
        props: {
          className: "expectedNextChildInstance",
        },
      },
    };
    const expectedNextInstance = {
      dom: {},
      childInstance: expectedNextChildInstance,
      element: nextInstanceElement,
    };

    const dataPreparedForReconciliation = { instance: currentChildInstance, element: expectedNextChildInstance };

    const { updateComponentInstance } = await strictest('../updateComponentInstance', {
      '../../../utils/withPerformance': { withPerformanceDomChange: identity },
      '../prepareDataForReconciliation': { prepareDataForReconciliation: () => dataPreparedForReconciliation },
      '../../reconcile': { reconcile: () => expectedNextChildInstance },
      '../applyNewComponentInstanceData': { applyNewComponentInstanceData: () => expectedNextInstance },
    });

    const result = updateComponentInstance({ container, instance: currentInstance, element: nextInstanceElement });
    expect(result).toStrictEqual(expectedNextInstance);
  });
})
import { updateComponentInstance } from '../updateComponentInstance';
import { prepareDataForReconciliation } from '../prepareDataForReconciliation';
import { reconcile } from '../../reconcile';
import { applyNewComponentInstanceData } from '../applyNewComponentInstanceData';

vi.mock('../../../utils/withPerformance');
vi.mock('../prepareDataForReconciliation');
vi.mock('../../reconcile');
vi.mock('../applyNewComponentInstanceData');

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

    vi.mocked(prepareDataForReconciliation).mockReturnValue(dataPreparedForReconciliation);
    vi.mocked(reconcile).mockReturnValue(expectedNextChildInstance);
    vi.mocked(applyNewComponentInstanceData).mockReturnValue(expectedNextInstance);

    const result = updateComponentInstance({ container, instance: currentInstance, element: nextInstanceElement });
    expect(result).toStrictEqual(expectedNextInstance);
    expect(prepareDataForReconciliation).toBeCalled();
    expect(reconcile).toBeCalled();
    expect(applyNewComponentInstanceData).toBeCalled();
  });
})
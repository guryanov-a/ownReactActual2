import { renderDom } from "../renderDom";
import { reconcile } from "../reconciliation/reconcile";

vi.mock("../reconciliation/reconcile");

describe("renderDom", () => {
  test("renderDom", () => {
    const Component = mock();

    const container = {
      tagName: "container"
    };
    const expectedElement = {
      type: Component,
      props: {
        children: []
      }
    };
    const expectedInstance = {
      dom: {},
      element: expectedElement,
      childInstances: []
    };

    reconcile.mockReturnValue(expectedInstance);

    const result = renderDom(<Component />, container);
    expect(reconcile).toHaveBeenCalledWith(container, null, expectedElement);
    expect(result).toStrictEqual(expectedInstance);
  });
});

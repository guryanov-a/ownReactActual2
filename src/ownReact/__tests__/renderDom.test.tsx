import { renderDom } from "../renderDom";
import { reconcile } from "../reconciliation/reconcile";
import {DomInstance} from "../types/types.ts";

vi.mock("../reconciliation/reconcile");

describe("renderDom", () => {
  test("renderDom", () => {
    const Component = vi.fn();

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
    } as unknown as DomInstance;

    vi.mocked(reconcile).mockReturnValue(expectedInstance);

    const result = renderDom({ element: <Component />, container });
    expect(reconcile).toHaveBeenCalledWith(container, null, expectedElement);
    expect(result).toStrictEqual(expectedInstance);
  });
});

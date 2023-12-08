import { reconcile } from "../reconciliation/reconcile";
import { renderDom } from "../renderDom";
import { DomInstance } from "../types/types";

vi.mock("../reconciliation/reconcile");
vi.mock("../utils/withPerformance");

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
    expect(result).toStrictEqual(expectedInstance);
  });
});

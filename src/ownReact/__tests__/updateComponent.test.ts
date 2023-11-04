import { updateComponent } from "../updateComponent";
import { reconcile } from "../reconciliation/reconcile";

vi.mock("../reconciliation/reconcile");

describe("updateComponent", () => {
  test("updateComponent", () => {
    expect.hasAssertions();
    const element = {
      type: "div"
    };
    const internalInstance = {
      dom: {
        tagName: "div",
        parentNode: document.createElement("div")
      },
      element,
      childInstances: ["childInstances"]
    };
    const expectedElement = {
      type: "div",
      props: {
        id: "test",
        children: ["expectedChildInstances"]
      }
    };
    const expectedInternalInstance = {
      dom: {
        tagName: "updatedDom",
        parentNode: document.createElement("div")
      },
      element: expectedElement,
      childInstances: ["test"]
    };
    expectedInternalInstance.dom.parentNode.innerHTML =
      '<div id="test">test</div>';
    reconcile.mockImplementation(() => expectedInternalInstance);

    const result = updateComponent(internalInstance);
    expect(result).toStrictEqual(expectedInternalInstance);
  });
});

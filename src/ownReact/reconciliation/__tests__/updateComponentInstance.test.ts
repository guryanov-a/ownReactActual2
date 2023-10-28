import { updateComponentInstance } from "../updateComponentInstance";
import { reconcile } from "../reconcile";

jest.mock("../reconcile");

describe("updateComponentInstance", () => {
  it("updateComponentInstance", () => {
    expect.hasAssertions();
    const expectedChildElement = {
      type: "div",
      props: {
        className: "initialValue"
      }
    };
    class Component {
      constructor(props) {
        this.props = props;
      }
      render() {
        return expectedChildElement;
      }
    }
    const publicInstance = new Component({
      className: "test"
    });
    const currentChildInstance = {
      dom: {},
      element: {
        props: {
          className: "initialValue"
        }
      },
      childInstances: []
    };
    const currentInstance = {
      publicInstance,
      dom: {},
      childInstance: currentChildInstance,
      element: {
        props: {
          componentProp: "componentPropValue"
        },
        type: Component
      }
    };
    currentInstance.publicInstance.__internalInstance = currentInstance;

    const element = {
      props: {
        className: "expectedValue"
      }
    };
    const expectedNextChildInstance = {
      dom: {},
      element: expectedChildElement,
      childInstances: []
    };
    const expectedNextInstance = {
      dom: {},
      element,
      childInstance: expectedNextChildInstance,
      publicInstance: currentInstance.publicInstance
    };
    const container = {};
    jest.spyOn(currentInstance.publicInstance, "render");
    reconcile.mockImplementation(() => expectedNextChildInstance);

    const result = updateComponentInstance(container, currentInstance, element);

    expect(currentInstance.publicInstance.props).toStrictEqual(element.props);
    expect(currentInstance.publicInstance.__internalInstance).toStrictEqual(
      expectedNextInstance
    );
    expect(currentInstance.publicInstance.render).toHaveBeenCalledWith();
    expect(reconcile).toHaveBeenCalledWith(
      container,
      currentChildInstance,
      expectedChildElement
    );
    expect(result).toStrictEqual(expectedNextInstance);
  });
});

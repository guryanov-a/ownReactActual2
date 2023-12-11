import { OwnReactComponent } from "../OwnReactComponent";
import { ComponentElement, ComponentInstance, Instance } from "../types/types";
import { updateComponent } from "../updateComponent";

vi.mock("../updateComponent");

describe("ownReactComponent", () => {
  test("constructor", () => {
    class TestComponent extends OwnReactComponent {
      render() {
        return null;
      }
    }

    const component = new TestComponent();
    expect(component.props).toStrictEqual({});
    expect(component.state).toStrictEqual({});
  });

  describe("setState", () => {
    test("object", () => {
      expect.hasAssertions();
      class TestComponent extends OwnReactComponent {
        render() {
          return null;
        }
      }
      const component = new TestComponent();
      const element = {
        type: "div",
        props: {
          id: "test"
        }
      } as unknown as ComponentElement;
      component.__internalInstance = {
        dom: {
          tagName: "updatedDom"
        } as unknown as HTMLElement,
        element,
        childInstance: {} as unknown as Instance
      } as unknown as ComponentInstance;

      vi.mocked(updateComponent).mockImplementation(({ instance: internalInstance }) => {
        internalInstance.dom = {
          tagName: "updatedDom"
        };
        internalInstance.element = element;
        internalInstance.childInstance = {} as unknown as Instance;
      });

      component.setState({ test: "test" });
      expect(component.state).toStrictEqual({ test: "test" });
      expect(updateComponent).toHaveBeenCalledWith({
        instance: component.__internalInstance
      });
    });

    test("function", () => {
      expect.hasAssertions();
      class TestComponent extends OwnReactComponent {
        render() {
          return null;
        }
      }
      const component = new TestComponent();
      const element = {
        type: "div",
        props: {
          id: "test"
        }
      } as unknown as ComponentElement;
      component.__internalInstance = {
        dom: {
          tagName: "updatedDom"
        } as unknown as HTMLElement,
        element,
        childInstance: {} as unknown as Instance
      } as unknown as ComponentInstance;
      component.state = { test: "" };

      vi.mocked(updateComponent).mockImplementation(({ instance: internalInstance }) => {
        internalInstance.dom = {
          tagName: "updatedDom"
        };
        internalInstance.element = element;
        internalInstance.childInstances = ["updatedChildInstances"];
      });

      component.setState(prevState => ({ test: prevState.test + "test" }));
      expect(component.state).toStrictEqual({ test: "test" });
      expect(updateComponent).toHaveBeenCalledWith({
        instance: component.__internalInstance
      });
    });
  });
});

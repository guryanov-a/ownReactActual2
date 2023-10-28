import { OwnReactComponent, InvalidChildError } from "../OwnReactComponent";
import { updateComponent } from "../updateComponent";

jest.mock("../updateComponent");

describe("ownReactComponent", () => {
  it("constructor", () => {
    expect.hasAssertions();
    const component = new OwnReactComponent();
    expect(component.props).toStrictEqual({});
    expect(component.state).toStrictEqual({});
  });

  describe("setState", () => {
    it("object", () => {
      expect.hasAssertions();
      const component = new OwnReactComponent();
      component.__internalInstance = {
        dom: {
          tagName: "updatedDom"
        },
        element,
        childInstances: ["updatedChildInstances"]
      };
      const element = {
        type: "div",
        props: {
          id: "test"
        }
      };

      updateComponent.mockImplementation(internalInstance => {
        internalInstance.dom = {
          tagName: "updatedDom"
        };
        internalInstance.element = element;
        internalInstance.childInstances = ["updatedChildInstances"];
      });

      component.setState({ test: "test" });
      expect(component.state).toStrictEqual({ test: "test" });
      expect(updateComponent).toHaveBeenCalledWith(
        component.__internalInstance
      );
    });

    it("function", () => {
      expect.hasAssertions();
      const component = new OwnReactComponent();
      component.__internalInstance = {
        dom: {
          tagName: "updatedDom"
        },
        element,
        childInstances: ["updatedChildInstances"]
      };
      component.state = { test: "" };
      const element = {
        type: "div",
        props: {
          id: "test"
        }
      };

      updateComponent.mockImplementation(internalInstance => {
        internalInstance.dom = {
          tagName: "updatedDom"
        };
        internalInstance.element = element;
        internalInstance.childInstances = ["updatedChildInstances"];
      });

      component.setState(prevState => ({ test: prevState.test + "test" }));
      expect(component.state).toStrictEqual({ test: "test" });
      expect(updateComponent).toHaveBeenCalledWith(
        component.__internalInstance
      );
    });
  });

  describe("createElement", () => {
    it("object child", () => {
      expect.hasAssertions();
      const element = OwnReactComponent.createElement(
        "div",
        { id: "test" },
        { type: "div", props: { id: "test" } }
      );
      expect(element).toStrictEqual({
        type: "div",
        props: {
          id: "test",
          children: [
            {
              type: "div",
              props: {
                id: "test"
              }
            }
          ]
        }
      });
    });

    it("string", () => {
      expect.hasAssertions();
      const element = OwnReactComponent.createElement(
        "div",
        { id: "test" },
        "Hello world!"
      );
      expect(element).toStrictEqual({
        type: "div",
        props: {
          id: "test",
          children: [
            {
              type: "TEXT ELEMENT",
              props: {
                nodeValue: "Hello world!"
              }
            }
          ]
        }
      });
    });

    it("invalidChildError", () => {
      expect.hasAssertions();
      jest.spyOn(console, "error").mockImplementation();
      const element = OwnReactComponent.createElement("div", { id: "test" }, 1);

      expect(element).toStrictEqual({
        type: "div",
        props: {
          id: "test",
          children: []
        }
      });
      expect(console.error).toHaveBeenCalledWith(expect.any(InvalidChildError));

      // restore original console.error
      delete console.error;
    });
  });
});

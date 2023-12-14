import {
  reconcile,
  UnexpectedError,
} from "../reconcile";
import { createInstance } from "../createInstance";
import { removeInstance } from "../removeInstance";
import { updateDomInstance } from "../updateDomInstance";
import { updateComponentInstance } from "../updateComponentInstance/updateComponentInstance";
import { replaceInstance } from "../replaceInstance";
import { OwnReactComponent } from "../../OwnReactComponent";
import { ComponentElement, ComponentInstance, Element, Instance, TextElement } from "../../types/types";
import { ReactElement } from "react";

vi.mock("../createInstance");
vi.mock("../removeInstance");
vi.mock("../updateInstance");
vi.mock("../replaceInstance");
vi.mock("../updateComponentInstance/updateComponentInstance");
vi.mock("../../utils/withPerformance");

describe("reconcile", () => {
  test("createInsance", () => {
   vi.mocked(createInstance).mockImplementation(({ element }) => {
      return {
        dom: {},
        element,
        childInstances: []
      };
    });

    const container = document.createElement("div");
    const element = {
      type: null
    } as unknown as Element;
    const result = reconcile({ container, instance: null, element });
    expect(createInstance).toHaveBeenCalledWith({ container, element });
    expect(result).toStrictEqual({
      dom: {},
      element,
      childInstances: []
    });
  });

  test("removeInstance", () => {
    vi.mocked(removeInstance).mockImplementation(() => {
      return null;
    });

    const container = document.createElement("div");
    const element = null;
    const prevInstance = {
      dom: {},
      element,
      childInstances: []
    } as unknown as Instance;
    const result = reconcile({ container, instance: prevInstance, element });
    expect(result).toBeNull();
  });

  test("updateInstance: in case of minor changes", () => {
    const element = {
      type: "div"
    } as unknown as Element;
    const updatedInstance = {
      dom: {
        tagName: "updatedDom"
      },
      element,
      childInstances: ["updatedChildInstances"]
    };
    const container = document.createElement("div");
    const prevInstance = {
      dom: {},
      element: {
        type: "div"
      },
      childInstances: []
    } as unknown as Instance;

    vi.mocked(updateDomInstance).mockReturnValue(updatedInstance);

    const result = reconcile({ container, instance: prevInstance, element });
    expect(result).toStrictEqual(updatedInstance);
  });

  test("updateInstance: in case if the element for the update is simple", () => {
    const updatedInstance = {
      dom: {
        tagName: "updatedDom"
      },
      element: {
        type: "span"
      },
      childInstances: [
        {
          dom: {
            tagName: "updatedChildDom"
          },
          element: {
            type: "span"
          },
          childInstances: []
        }
      ]
    };

   vi.mocked(updateDomInstance).mockReturnValue(updatedInstance);

    const container = document.createElement("div");
    const element = {
      type: "span"
    } as Element;
    const prevInstance = {
      dom: {},
      element: {
        type: "span"
      },
      childInstances: []
    } as unknown as Instance;

    const result = reconcile({ container, instance: prevInstance, element });
    expect(updateDomInstance).toHaveBeenCalledWith({ instance: prevInstance, element });
    expect(result).toStrictEqual(updatedInstance);
  });

  test("replaceInstance", () => {
    class MockComponent1 extends OwnReactComponent {
      render() {
        return {
          type: "TEXT_ELEMENT",
          props: { nodeValue: "foo" }
        };
      }
    }

    class MockComponent2 extends OwnReactComponent {
      render() {
        return {
          type: "TEXT_ELEMENT",
          props: { nodeValue: "bar" }
        };
      }
    }

    const replacedInstance = {
      dom: {
        tagName: "replacedDom"
      },
      element: {
        type: MockComponent2
      },
      childInstances: ["replacedChildInstances"]
    };

    vi.mocked(replaceInstance).mockReturnValue(replacedInstance);

    const container = document.createElement("div");
    const element = {
      type: MockComponent2
    } as unknown as ComponentElement;
    const prevInstance = {
      dom: {},
      element: {
        type: MockComponent1
      },
      childInstances: []
    } as unknown as ComponentInstance;
    const result = reconcile({ container, instance: prevInstance, element });
    expect(result).toStrictEqual(replacedInstance);
  });

  test("updateComponentInstance", () => {
    class MockComponent extends OwnReactComponent {
      render() {
        return {
          type: "TEXT_ELEMENT",
          props: { nodeValue: "foo" }
        } as unknown as ReactElement<TextElement>;
      }
    }

    const updatedInstance = {
      dom: {
        tagName: "updatedDom"
      },
      element: {
        type: MockComponent,
        props: { nodeValue: "bar" }
      },
      childInstances: ["updatedChildInstances"]
    } as unknown as ComponentInstance;

    vi.mocked(updateComponentInstance).mockReturnValue(updatedInstance);

    const container = document.createElement("div");
    const element = {
      type: MockComponent
    } as unknown as ComponentElement;
    const prevInstance = {
      dom: {},
      element: {
        type: MockComponent
      },
      childInstances: [],
      publicInstance: new MockComponent({})
    } as unknown as ComponentInstance;

    const result = reconcile({ container, instance: prevInstance, element });
    expect(result).toStrictEqual(updatedInstance);
  });

  describe("errors", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    test("error: something went wrong", () => {
      expect.hasAssertions();
      vi.spyOn(console, "error").mockImplementation(() => {});
      class MockClassComponent {}
      const container = document.createElement("div");
      const element = {
        type: MockClassComponent
      } as unknown as Element;
      const prevInstance = {
        dom: {},
        element: {
          type: MockClassComponent
        },
        childInstances: []
      } as unknown as Instance;

      reconcile({ container, instance: prevInstance, element });

      expect(console.error).toHaveBeenCalledWith(expect.any(UnexpectedError));
    });
  });
});

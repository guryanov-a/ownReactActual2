import {
  reconcile,
  UnexpectedError,
  WrongDataError,
  WrongInputError
} from "../reconcile";
import { createInstance } from "../createInstance";
import { removeInstance } from "../removeInstance";
import { updateInstance } from "../updateInstance";
import { updateComponentInstance } from "../updateComponentInstance/updateComponentInstance";
import { replaceInstance } from "../replaceInstance";
import { OwnReactComponent } from "../../OwnReactComponent";
import { ComponentElement, ComponentInstance, Element, Instance } from "../../types/types";

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

    vi.mocked(updateInstance).mockReturnValue(updatedInstance);

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

   vi.mocked(updateInstance).mockReturnValue(updatedInstance);

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
    expect(updateInstance).toHaveBeenCalledWith({ instance: prevInstance, element });
    expect(result).toStrictEqual(updatedInstance);
  });

  test("replaceInstance", () => {
    class MockComponent1 extends OwnReactComponent {
      render() {
        return {
          type: "TEXT ELEMENT",
          props: { nodeValue: "foo" }
        };
      }
    }

    class MockComponent2 extends OwnReactComponent {
      render() {
        return {
          type: "TEXT ELEMENT",
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
          type: "TEXT ELEMENT",
          props: { nodeValue: "foo" }
        };
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
    };

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
      childInstances: []
    } as unknown as ComponentInstance;

    const result = reconcile({ container, instance: prevInstance, element });
    expect(result).toStrictEqual(updatedInstance);
  });

  describe("errors", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });
    
    describe("error: wrong input", () => {
      const container = document.createElement("div");
      const element = {
        type: "div"
      } as unknown as Element;
      const prevInstance = {
        dom: {},
        element: {
          type: "div"
        },
        childInstances: []
      } as unknown as Instance;
      const emptyInstance = undefined as unknown as Instance;
      const emptyElement = undefined as unknown as Element;

      const testCasesWrongParameters: [Instance, Element][] = [
        [emptyInstance, element],
        [prevInstance, emptyElement],
        [emptyInstance, emptyElement]
      ];

      it.each(testCasesWrongParameters)(
        "error: wrong parameters = %p",
        (prevInstance, element) => {
          expect.hasAssertions();
          vi.spyOn(console, "error").mockImplementation(() => {});
          reconcile({ container, instance: prevInstance, element });
          expect(console.error).toHaveBeenCalledWith(
            expect.any(WrongInputError)
          );
        }
      );
    });

    describe("error: wrong data", () => {
      const elementTypeUndefined = {
        type: undefined
      };
      const prevInstanceTypeUndefined = {
        dom: {},
        element: {
          type: undefined
        },
        childInstances: []
      };
      const prevInstanceElementUndefined = {
        dom: {},
        element: undefined,
        childInstances: []
      };
      const elementWrongData = {
        type: "div"
      };
      const prevInstance = {
        dom: {},
        element: {
          type: "div"
        },
        childInstances: []
      };
      const parentDomWrongData = {};

      const testCasesWrongData = [
        [prevInstance, elementTypeUndefined],
        [prevInstanceTypeUndefined, elementWrongData],
        [prevInstanceTypeUndefined, elementTypeUndefined],
        [prevInstanceElementUndefined, elementWrongData]
      ];

      it.each(testCasesWrongData)(
        "error: wrong data = %p",
        (prevInstance, element) => {
          expect.hasAssertions();
          vi.spyOn(console, "error").mockImplementation();

          reconcile(parentDomWrongData, prevInstance, element);
          expect(console.error).toHaveBeenCalledWith(
            expect.any(WrongDataError)
          );
          console.error = originalConsoleError;
        }
      );
    });

    test("error: something went wrong", () => {
      expect.hasAssertions();
      vi.spyOn(console, "error").mockImplementation();
      class MockClassComponent {}
      const parentDom = {};
      const element = {
        type: MockClassComponent
      };
      const prevInstance = {
        dom: {},
        element: {
          type: MockClassComponent
        },
        childInstances: []
      };

      reconcile(parentDom, prevInstance, element);

      expect(console.error).toHaveBeenCalledWith(expect.any(UnexpectedError));
      console.error = originalConsoleError;
    });
  });
});

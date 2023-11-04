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

vi.mock("../createInstance");
vi.mock("../removeInstance");
vi.mock("../updateInstance");
vi.mock("../replaceInstance");
vi.mock("../updateComponentInstance");

const originalConsoleError = console.error;

describe("reconcile", () => {
  test("createInsance", () => {
    createInstance.mockImplementation((parentDom, element) => {
      return {
        dom: {},
        element,
        childInstances: []
      };
    });

    const parentDom = {};
    const element = {
      type: null
    };
    const result = reconcile(parentDom, null, element);
    expect(createInstance).toHaveBeenCalledWith(parentDom, element);
    expect(result).toStrictEqual({
      dom: {},
      element,
      childInstances: []
    });
  });

  test("removeInstance", () => {
    removeInstance.mockImplementation(() => {
      return null;
    });

    const parentDom = {};
    const element = null;
    const prevInstance = {
      dom: {},
      element,
      childInstances: []
    };
    const result = reconcile(parentDom, prevInstance, element);
    expect(result).toBeNull();
  });

  test("updateInstance: in case of minor changes", () => {
    const updatedInstance = {
      dom: {
        tagName: "updatedDom"
      },
      element,
      childInstances: ["updatedChildInstances"]
    };
    updateInstance.mockImplementation(() => {
      return updatedInstance;
    });
    const parentDom = {};
    const element = {
      type: "div"
    };
    const prevInstance = {
      dom: {},
      element: {
        type: "div"
      },
      childInstances: []
    };
    const result = reconcile(parentDom, prevInstance, element);
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

    updateInstance.mockImplementation(() => {
      return updatedInstance;
    });

    const parentDom = {};
    const element = {
      type: "span"
    };
    const prevInstance = {
      dom: {},
      element: {
        type: "span"
      },
      childInstances: []
    };

    const result = reconcile(parentDom, prevInstance, element);
    expect(updateInstance).toHaveBeenCalledWith(prevInstance, element);
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

    replaceInstance.mockImplementation(() => {
      return replacedInstance;
    });

    const parentDom = {};
    const element = {
      type: MockComponent2
    };
    const prevInstance = {
      dom: {},
      element: {
        type: MockComponent1
      },
      childInstances: []
    };
    const result = reconcile(parentDom, prevInstance, element);
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

    updateComponentInstance.mockImplementation(() => {
      return updatedInstance;
    });

    const parentDom = {};
    const element = {
      type: MockComponent
    };
    const prevInstance = {
      dom: {},
      element: {
        type: MockComponent
      },
      childInstances: []
    };
    const result = reconcile(parentDom, prevInstance, element);
    expect(result).toStrictEqual(updatedInstance);
  });

  describe("errors", () => {
    describe("error: wrong input", () => {
      const parentDom = {};
      const element = {
        type: "div"
      };
      const prevInstance = {
        dom: {},
        element: {
          type: "div"
        },
        childInstances: []
      };

      const testCasesWrongParameters = [
        [undefined, element],
        [prevInstance, undefined],
        [undefined, undefined]
      ];

      it.each(testCasesWrongParameters)(
        "error: wrong parameters = %p",
        (prevInstance, element) => {
          expect.hasAssertions();
          vi.spyOn(console, "error").mockImplementation();
          reconcile(parentDom, prevInstance, element);
          expect(console.error).toHaveBeenCalledWith(
            expect.any(WrongInputError)
          );
          console.error = originalConsoleError;
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

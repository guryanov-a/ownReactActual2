import esmock from 'esmock';

describe("updateComponentInstance module", () => {
  describe("updateComponentInstance", () => {
    test("checks that it works correctly", async () => {
      const container = document.createElement("div");
      const currentInstance = {
        dom: {},
        childInstance: {},
        element: {
          type: "div",
          props: {
            className: "initialValue",
          },
        },
      };
      const nextInstanceElement = {
        type: "div",
        props: {
          className: "expectedValue",
        },
      };
      const expectedNextChildInstance = {
        dom: {},
        element: {
          type: "div",
          props: {
            className: "expectedValue",
          },
        },
      };
      const expectedNextInstance = {
        dom: {},
        childInstance: expectedNextChildInstance,
        element: nextInstanceElement,
      };

      const { updateComponentInstance } = await esmock('../updateComponentInstance', {
        '../updateComponentInstance': { 
          prepareDataForReconciliation: () => 'hello',
          applyNewComponentInstanceData: () => 'world',
        },
        '../reconcile': { reconcile: () => "oh reconcile" },
      });

      const result = updateComponentInstance({ container, instance: currentInstance, element: nextInstanceElement });
    
      expect(result).toStrictEqual(expectedNextInstance);
    });
  })

  describe("applyNewComponentInstanceData", () => {
    test("updates instance with new child instance data", async () => {
      const instance = {
        dom: {},
        childInstance: {
          dom: {},
          element: {
            type: "div",
            props: {
              className: "initialValue"
            }
          }
        },
        element: {
          type: "div",
          props: {
            className: "initialValue"
          }
        }
      };
      const element = {
        type: "div",
        props: {
          className: "expectedValue"
        }
      };
      const newChildInstance = {
        dom: {},
        element: {
          type: "div",
          props: {
            className: "expectedValue"
          }
        }
      };
      const expectedInstance = {
        dom: {},
        childInstance: newChildInstance,
        element: element
      };
  
      const { applyNewComponentInstanceData } = await import("../updateComponentInstance");
      const result = applyNewComponentInstanceData({ instance, element, newChildInstance });
  
      expect(result).toStrictEqual(expectedInstance);
    });
  });

  describe("prepareDataForReconciliation", () => {
    test("updates instance publicInstance props with element props", async () => {
      const container = document.createElement("div");
      const instance = {
        publicInstance: {
          props: {
            initialProp: "initialValue",
          },
          render: () => {},
        },
        childInstance: {},
      };
      const element = {
        props: {
          updatedProp: "updatedValue",
        },
      };
  
      const { prepareDataForReconciliation } = await import("../updateComponentInstance");
      prepareDataForReconciliation({ container, instance, element });
  
      expect(instance.publicInstance.props).toEqual(element.props);
    });
  
    test("returns an object with updated child element and old child instance", async () => {
      const container = document.createElement("div");
      const instance = {
        publicInstance: {
          props: {},
          render: () => {},
        },
        childInstance: {
          dom: {},
          element: {
            type: "div",
            props: {
              className: "initialValue",
            },
          },
          childInstances: [],
        },
      };
      const element = {
        props: {},
      };
  
      const { prepareDataForReconciliation } = await import("../updateComponentInstance");
      const result = prepareDataForReconciliation({ container, instance, element });
  
      expect(result).toEqual({
        container,
        instance: instance.childInstance,
        element: instance.publicInstance.render(),
      });
    });
  });
});
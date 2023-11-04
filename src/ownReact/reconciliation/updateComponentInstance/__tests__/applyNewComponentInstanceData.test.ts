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
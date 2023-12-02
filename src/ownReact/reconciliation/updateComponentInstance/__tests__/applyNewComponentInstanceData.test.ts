import { ComponentElement, ComponentInstance, DomInstance } from "../../../types";
import { applyNewComponentInstanceData } from "../applyNewComponentInstanceData";

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
      } as unknown as ComponentInstance;

      const element = {
        type: "div",
        props: {
          className: "expectedValue"
        }
      } as unknown as ComponentElement;

      const newChildInstance = {
        dom: {},
        element: {
          type: "div",
          props: {
            className: "expectedValue"
          }
        }
      } as unknown as DomInstance;
      
      const expectedInstance = {
        dom: {},
        childInstance: newChildInstance,
        element: element
      } as unknown as ComponentInstance;
  
      const result = applyNewComponentInstanceData({ instance, element, newChildInstance });
  
      expect(result).toStrictEqual(expectedInstance);
    });
});
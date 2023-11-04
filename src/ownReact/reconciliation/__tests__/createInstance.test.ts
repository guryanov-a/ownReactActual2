import { createInstance } from "../createInstance";
import instantiate from "../instantiate";

vi.mock("../instantiate");

describe("createInstance", () => {
  test("should create instance of a DOM element", () => {
    const container = document.createElement("div");
    const element = {
      type: "div",
      props: {
        children: [
          {
            type: "span"
          },
          {
            type: "i"
          }
        ]
      }
    };

    const expectedInstanceDom = document.createElement("div");
    const expectedInstanceDomChild1 = document.createElement("span");
    const expectedInstanceDomChild2 = document.createElement("i");
    expectedInstanceDom.appendChild(expectedInstanceDomChild1);
    expectedInstanceDom.appendChild(expectedInstanceDomChild2);
    const expectedInstance = {
      dom: expectedInstanceDom,
      element,
      childInstances: [
        {
          dom: expectedInstanceDomChild1,
          element: {
            type: "span"
          }
        },
        {
          dom: expectedInstanceDomChild2,
          element: {
            type: "i"
          }
        }
      ]
    };

    instantiate.mockImplementation(() => {
      return expectedInstance;
    });

    const instance = createInstance(container, element);

    expect(instance).toStrictEqual(expectedInstance);
    expect(container.innerHTML).toStrictEqual(
      "<div><span></span><i></i></div>"
    );
  });
});

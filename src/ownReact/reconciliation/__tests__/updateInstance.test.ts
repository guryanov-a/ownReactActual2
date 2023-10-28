import { updateInstance } from "../updateInstance";
import { updateDomProperties } from "../updateDomProperties";
import { reconcileChildren } from "../reconcileChildren";

jest.mock("../updateDomProperties");
jest.mock("../reconcileChildren");

describe("updateInstance", () => {
  it("should update instance", () => {
    expect.hasAssertions();
    const initialInstanceChildInsances = [
      {
        dom: document.createElement("span"),
        element: {
          type: "span",
          props: {
            children: [
              {
                type: "TEXT ELEMENT",
                props: {
                  nodeValue: "Hello"
                }
              }
            ]
          }
        }
      }
    ];
    const initialInstance = {
      dom: document.createElement("div"),
      element: {
        type: "div",
        props: {
          children: [
            {
              type: "span",
              props: {
                children: [
                  {
                    type: "TEXT ELEMENT",
                    props: {
                      nodeValue: "Hello"
                    }
                  }
                ]
              }
            }
          ]
        }
      },
      childInstances: initialInstanceChildInsances
    };
    const element = {
      type: "div",
      props: {
        className: "foo",
        children: [
          {
            type: "span",
            props: {
              children: [
                {
                  type: "TEXT ELEMENT",
                  props: {
                    nodeValue: "Hello World"
                  }
                }
              ]
            }
          }
        ]
      }
    };

    const expectedInstanceMainInfo = {
      dom: document.createElement("div"),
      element: {
        type: "div",
        props: {
          className: "foo",
          children: [
            {
              type: "span",
              props: {
                children: [
                  {
                    type: "TEXT ELEMENT",
                    props: {
                      nodeValue: "Hello World"
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    };
    const expectedChildInstances = [
      {
        dom: document.createElement("span"),
        element: {
          type: "span",
          props: {
            children: [
              {
                type: "TEXT ELEMENT",
                props: {
                  nodeValue: "Hello World"
                }
              }
            ]
          }
        }
      }
    ];
    const expectedInstance = {
      ...expectedInstanceMainInfo,
      childInstances: expectedChildInstances
    };

    updateDomProperties.mockImplementation(() => ({
      ...expectedInstanceMainInfo,
      childInstances: initialInstanceChildInsances
    }));
    reconcileChildren.mockImplementation(() => expectedChildInstances);

    const nextInstance = updateInstance(initialInstance, element);
    expect(nextInstance).toStrictEqual(expectedInstance);
  });
});

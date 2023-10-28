import { reconcileChildren } from "../reconcileChildren";
import { reconcile } from "../reconcile";

jest.mock("../reconcile");

describe("reconcileChildren", () => {
  it("reconciles children", () => {
    expect.hasAssertions();
    const instance = {
      dom: document.createElement("div"),
      childInstances: []
    };
    const element = {
      type: "div",
      props: {
        children: [
          {
            type: "div",
            props: {
              children: []
            }
          },
          {
            type: "div",
            props: {
              children: []
            }
          }
        ]
      }
    };
    const expectedChildInstances = [
      { dom: document.createElement("div") },
      { dom: document.createElement("div") }
    ];

    reconcile.mockImplementation(() => ({
      dom: document.createElement("div")
    }));

    const newChildInstances = reconcileChildren(instance, element);
    expect(newChildInstances).toStrictEqual(expectedChildInstances);
  });
});

import { reconcileChildren } from "../reconcileChildren";
import { reconcile } from "../reconcile";
import { DomInstance } from "../../types/types";

vi.mock("../reconcile");

describe("reconcileChildren", () => {
  test("reconciles children", () => {
    const instance = {
      dom: document.createElement("div"),
      childInstances: []
    } as unknown as DomInstance;
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

    const domInstance = {
      dom: document.createElement("div")
    } as unknown as DomInstance;

    vi.mocked(reconcile).mockReturnValue(domInstance);

    const newChildInstances = reconcileChildren({ instance, element });
    expect(newChildInstances).toStrictEqual(expectedChildInstances);
  });
});

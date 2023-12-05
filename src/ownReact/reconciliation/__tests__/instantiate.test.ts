import { identity } from "ramda";
import {
  instantiate,
  InvalidTypeError,
  InvalidInputError
} from "../instantiate";
import { updateDomProperties } from "../updateDomProperties";
import { createPublicInstance } from "../createPublicInstance";
import { OwnReactComponent } from "../../OwnReactComponent";

vi.mock("../updateDomProperties");
vi.mock("../createPublicInstance");

describe("instantiate", () => {
  vi.mocked(updateDomProperties).mockImplementation(identity);

  test("instantiate a DOM element: HTML element", () => {
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
          },
          childInstances: []
        },
        {
          dom: expectedInstanceDomChild2,
          element: {
            type: "i"
          },
          childInstances: []
        }
      ]
    };

    const instance = instantiate(element);
    expect(instance).toStrictEqual(expectedInstance);
  });

  test("instantiate a DOM element: text", () => {
    const element = {
      type: "TEXT_ELEMENT",
      props: { nodeValue: "foo" }
    };
    const expectedInstance = {
      dom: document.createTextNode("foo"),
      element,
      childInstances: []
    };

    const instance = instantiate(element);

    expect(instance).toStrictEqual(expectedInstance);
  });

  test("instantiate a class component", () => {
    class MockClassComponent extends OwnReactComponent {
      render() {
        return {
          type: "TEXT_ELEMENT",
          props: { nodeValue: "foo" }
        };
      }
    }
    vi.spyOn(MockClassComponent.prototype, "render");
    const isPrototypeOfSpy = vi
      .spyOn(OwnReactComponent, "isPrototypeOf")
      .mockReturnValue(true);

    createPublicInstance.mockImplementation(() => new MockClassComponent());

    const element = {
      type: MockClassComponent
    };

    const instance = instantiate(element);

    const expectedInstance = {
      dom: document.createTextNode("foo"),
      element,
      publicInstance: new MockClassComponent(),
      childInstance: {
        dom: document.createTextNode("foo"),
        element: {
          type: "TEXT_ELEMENT",
          props: { nodeValue: "foo" }
        },
        childInstances: []
      }
    };
    expect(instance).toStrictEqual(expectedInstance);

    isPrototypeOfSpy.mockRestore();
  });

  test("error: invalid type", () => {
    const element = {
      type: 1
    };

    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementationOnce(() => {});
    const result = instantiate(element);

    expect(console.error).toHaveBeenCalledWith(expect.any(InvalidTypeError));
    expect(result).toBeUndefined();

    consoleErrorSpy.mockRestore();
  });

  const testCases = [
    [null, undefined],
    [undefined, undefined],
    [0, undefined],
    [false, undefined],
    ["", undefined],
    [NaN, undefined],
    [{}, undefined],
    [{ type: null }, undefined],
    [{ type: 0 }, undefined],
    [{ type: false }, undefined],
    [{ type: "" }, undefined],
    [{ type: NaN }, undefined]
  ];

  describe("errors: wrong input", () => {
    // use test.each to iterate over the test cases and run your function with each value of initialElement
    it.each(testCases)(
      "error: wrong input with input = %p",
      (initialElement, expectedType) => {
        const consoleErrorSpy = vi
          .spyOn(console, "error")
          .mockImplementationOnce(() => {});
        const result = instantiate(initialElement);

        expect(result).toBe(expectedType);
        expect(console.error).toHaveBeenCalledWith(
          expect.any(InvalidInputError)
        );

        consoleErrorSpy.mockRestore();
      }
    );
  });
});

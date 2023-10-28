import { identity } from "ramda";
import instantiate, {
  InvalidTypeError,
  InvalidInputError
} from "../instantiate";
import { updateDomProperties } from "../updateDomProperties";
import createPublicInstance from "../createPublicInstance";
import { OwnReactComponent } from "../../OwnReactComponent";

jest.mock("../updateDomProperties");
jest.mock("../createPublicInstance");

describe("instantiate", () => {
  updateDomProperties.mockImplementation(identity);

  it("instantiate a DOM element: HTML element", () => {
    expect.hasAssertions();
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

  it("instantiate a DOM element: text", () => {
    expect.hasAssertions();
    const element = {
      type: "TEXT ELEMENT",
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

  it("instantiate a class component", () => {
    expect.hasAssertions();
    class MockClassComponent extends OwnReactComponent {
      render() {
        return {
          type: "TEXT ELEMENT",
          props: { nodeValue: "foo" }
        };
      }
    }
    jest.spyOn(MockClassComponent.prototype, "render");
    const isPrototypeOfSpy = jest
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
          type: "TEXT ELEMENT",
          props: { nodeValue: "foo" }
        },
        childInstances: []
      }
    };
    expect(instance).toStrictEqual(expectedInstance);

    isPrototypeOfSpy.mockRestore();
  });

  it("error: invalid type", () => {
    expect.hasAssertions();
    const element = {
      type: 1
    };

    const consoleErrorSpy = jest
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
        const consoleErrorSpy = jest
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

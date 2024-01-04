import { identity } from "ramda";
import { OwnReactComponent } from "../../OwnReactComponent";
import { ComponentElement, DomElement, DomInstance, TextElement } from "../../types/types";
import { createPublicInstance } from "../createPublicInstance";
import { instantiateDomElement } from "../instantiate";
import { updateDomProperties } from "../updateDomProperties";

vi.mock("../updateDomProperties");
vi.mock("../createPublicInstance");
vi.mock("../../utils/withPerformance")
vi.mock('../instantiate');

describe("instantiate", () => {
  vi.mocked(updateDomProperties).mockImplementation(identity);

  test("instantiate a DOM element: HTML element", async () => {
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
    } as unknown as DomElement;

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
          childInstances: [],
          parentElement: element,
        },
        {
          dom: expectedInstanceDomChild2,
          element: {
            type: "i"
          },
          childInstances: [],
          parentElement: element,
        }
      ]
    } as unknown as DomInstance;

    vi.mocked(instantiateDomElement).mockReturnValue(expectedInstance);

    const { instantiate } = await vi.importActual('../instantiate');
    const instance = instantiate({ element });
    expect(instance).toStrictEqual(expectedInstance);
  });

  test("instantiate a DOM element: text", () => {
    const element = {
      type: "TEXT_ELEMENT",
      props: { nodeValue: "foo" },
      parentElement: {}
    } as unknown as TextElement;
    const expectedInstance = {
      dom: document.createTextNode("foo"),
      element
    };

    const instance = instantiate({ element });

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
      .spyOn(Object.prototype, "isPrototypeOf")
      .mockReturnValue(true);

    vi.mocked(createPublicInstance).mockImplementation(() => new MockClassComponent());

    const element = {
      type: MockClassComponent
    } as unknown as ComponentElement;

    const instance = instantiate({element});

    const expectedInstance = {
      dom: document.createTextNode("foo"),
      element,
      publicInstance: new MockClassComponent(),
      childInstance: {
        dom: document.createTextNode("foo"),
        element: {
          type: "TEXT_ELEMENT",
          props: { nodeValue: "foo" },
          parentElement: element,
        }
      }
    };
    expect(instance).toStrictEqual(expectedInstance);

    isPrototypeOfSpy.mockRestore();
  });
});

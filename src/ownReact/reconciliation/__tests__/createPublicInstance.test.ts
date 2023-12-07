import { createPublicInstance } from "../createPublicInstance";
import {ArgsProps, ComponentElement, ComponentInstance} from "../../types/types.ts";

describe("createPublicInstance", () => {
  test("create public instance of a component", () => {
    // Arrange
    const element = {
      type: class {
        props: ArgsProps;
        constructor(props: ArgsProps) {
          this.props = props;
        }
      },
      props: {
        name: "John",
        surname: "Doe"
      }
    } as unknown as ComponentElement;

    const internalInstance = {} as ComponentInstance;

    // Act
    const publicInstance = createPublicInstance({ element, instance: internalInstance });

    // Assert
    expect(publicInstance).toBeInstanceOf(element.type);
    expect(publicInstance.props).toStrictEqual(element.props);
    expect(publicInstance.__internalInstance).toBe(internalInstance);
  });
});

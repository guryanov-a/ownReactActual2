import createPublicInstance from "../createPublicInstance";

describe("createPublicInstance", () => {
  test("create public instance of a component", () => {
    // Arrange
    const element = {
      type: class {
        constructor(props) {
          this.props = props;
        }
      },
      props: {
        name: "John",
        surname: "Doe"
      }
    };
    const internalInstance = {};

    // Act
    const publicInstance = createPublicInstance(element, internalInstance);

    // Assert
    expect(publicInstance).toBeInstanceOf(element.type);
    expect(publicInstance.props).toStrictEqual(element.props);
    expect(publicInstance.__internalInstance).toBe(internalInstance);
  });
});

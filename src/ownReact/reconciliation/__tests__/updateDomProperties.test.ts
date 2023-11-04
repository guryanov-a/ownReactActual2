import { updateDomProperties } from "../updateDomProperties";

describe("updateDomProperties", () => {
  test("should update dom properties", () => {
    const onClick = () => {};
    const prevElement = {
      type: "div",
      props: {
        className: "foo",
        style: {
          color: "red"
        },
        onClick
      }
    };

    const dom = document.createElement("div");
    dom.className = "foo";
    dom.style.color = "red";
    dom.onclick = onClick;
    const instance = {
      childInstances: [],
      element: prevElement,
      dom
    };

    const onMouseOver = () => {};
    const nextElement = {
      type: "div",
      props: {
        className: "bar",
        style: {
          color: "blue"
        },
        onMouseOver
      }
    };

    const nextDom = updateDomProperties(
      instance.dom,
      instance.element.props,
      nextElement.props
    );

    expect(nextDom.className).toBe("bar");
    expect(nextDom.style.color).toBe("blue");
  });
});

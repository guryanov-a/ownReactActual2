import { removeInstance } from "../removeInstance";

describe("removeInstance", () => {
  it("should remove instance from parent instance", () => {
    expect.hasAssertions();
    const parentDom = document.createElement("div");
    const instance = {
      dom: document.createElement("div")
    };

    parentDom.appendChild(instance.dom);
    expect(parentDom.childNodes).toHaveLength(1);

    removeInstance(parentDom, instance);
    expect(parentDom.childNodes).toHaveLength(0);
  });
});

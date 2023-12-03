import { removeInstance } from "../removeInstance";
import { isComponentInstance } from "../../types/is";

vi.mock('../../utils/withPerformance');
vi.mock('../../types/is');

describe("removeInstance", () => {
  test("should remove instance from parent instance", () => {
    const parentDom = document.createElement("div");
    const componentWillUnmount = vi.fn();
    const instance = {
      dom: document.createElement("div"),
      publicInstance: {
        componentWillUnmount,
      },
    };
    parentDom.appendChild(instance.dom);

    vi.mocked(isComponentInstance).mockReturnValue(true);

    expect(parentDom.childNodes).toHaveLength(1);
    removeInstance({ container: parentDom, instance });
    expect(parentDom.childNodes).toHaveLength(0);
    expect(componentWillUnmount).toHaveBeenCalledTimes(1);
    expect(isComponentInstance).toHaveBeenCalledTimes(1);
  });
});

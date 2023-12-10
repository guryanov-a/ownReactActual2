import { InvalidChildError, jsxDEV } from "../jsx-dev-runtime/jsx-dev-runtime";

describe("jsxDEV", () => {
    test("object child", () => {
      expect.hasAssertions();
      const element = jsxDEV(
        "div",
        { id: "test" },
        { type: "div", props: { id: "test" } }
      );
      expect(element).toStrictEqual({
        type: "div",
        props: {
          id: "test",
          children: [
            {
              type: "div",
              props: {
                id: "test"
              }
            }
          ]
        }
      });
    });

    test("string", () => {
      expect.hasAssertions();
      const element = jsxDEV(
        "div",
        { id: "test" },
        "Hello world!"
      );
      expect(element).toStrictEqual({
        type: "div",
        props: {
          id: "test",
          children: [
            {
              type: "TEXT_ELEMENT",
              props: {
                nodeValue: "Hello world!"
              }
            }
          ]
        }
      });
    });

    test("invalidChildError", () => {
      expect.hasAssertions();
      vi.spyOn(console, "error").mockImplementation(() => {});
      const element = jsxDEV("div", { id: "test" }, 1);

      expect(element).toStrictEqual({
        type: "div",
        props: {
          id: "test",
          children: []
        }
      });
      expect(console.error).toHaveBeenCalledWith(expect.any(InvalidChildError));

      // restore original console.error
      delete console.error;
    });
  });
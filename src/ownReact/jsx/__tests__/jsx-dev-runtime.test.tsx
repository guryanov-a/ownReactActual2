import { jsxDEV } from "../jsx-dev-runtime";

describe("jsxDEV", () => {
    test("object child", () => {
      expect.hasAssertions();

      const element = jsxDEV(
        "div",
        { id: "test" },
        { type: "div", props: { id: "test" } }
      );

      expect({
        type: element.type,
        key: element.key,
        ref: element.ref,
        props: element.props,
        _owner: element._owner,
        _store: element._store,
      }).toStrictEqual({
        type: 'div',
        key: '[object Object]',
        ref: null,
        props: { id: 'test' },
        _owner: null,
        _store: {},
      });
    });

    test("string", () => {
      expect.hasAssertions();
      const element = jsxDEV(
        "div",
        { id: "test", children: "Hello world!" },
      );

      expect({
        type: element.type,
        key: element.key,
        ref: element.ref,
        props: {
          id: element.props.id,
          children: [
            {
              type: element.props.children[0].type,
              props: element.props.children[0].props,
            }
          ],
        },
        _owner: element._owner,
        _store: element._store,
      }).toStrictEqual({
        type: 'div',
        key: null,
        ref: null,
        props: { 
          id: 'test', 
          children: [{
            type: 'TEXT_ELEMENT',
            props: { nodeValue: 'Hello world!' },
          }] 
        },
        _owner: null,
        _store: {},
      });
    });
  });
import { ArgsProps, ComponentInstance, Element, ParamsProps } from "./types/types";
import { updateComponent } from "./updateComponent";

export type InternalInstance = ComponentInstance | null;
export type ChangeState = (state: ComponentState) => Partial<ComponentState>;
export type ComponentState = Record<string, unknown>;

export type OwnReactExtendedClass = new (props: ArgsProps) => OwnReactComponent;
export abstract class OwnReactComponent {
  props: ParamsProps;
  state: ComponentState;
  componentWillUnmount?: () => void;
  componentDidMount?: () => void;
  __internalInstance: InternalInstance;
  abstract render(): Element | null;

  constructor(props?: ArgsProps) {
    this.props = props || {};
    this.state = {};
    this.__internalInstance = null;
  }

  setState(stateChangeInfo: Partial<ComponentState> | ChangeState) {
    // check what type of stateChangeInfo is
    if (typeof stateChangeInfo === "function") {
      // if it's a function, call it with the current state
      const changeState = stateChangeInfo;
      this.state = {
        ...this.state,
        ...changeState(this.state)
      };
    } else {
      // if it's an object, merge it with the current state
      const newState = stateChangeInfo;
      this.state = {
        ...this.state,
        ...newState
      };
    }

    updateComponent({ instance: this.__internalInstance });
  }

  shouldComponentUpdate() {
    return true;
  }
}

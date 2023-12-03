import { ComponentInputProps, ComponentInstance, ComponentProps } from "./types/types";
import { updateComponent } from "./updateComponent";

export type InternalInstance = ComponentInstance | null;
export type ChangeState = (state: ComponentState) => Partial<ComponentState>;
export type ComponentState = Record<string, unknown>;

export class OwnReactComponent {
  props: ComponentProps;
  state: ComponentState;
  componentWillUnmount?: () => void;
  componentDidMount?: () => void;
  __internalInstance: InternalInstance;

  constructor(props: ComponentInputProps) {
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

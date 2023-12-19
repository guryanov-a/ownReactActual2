import { ReactInstance } from "react";
import { ComponentInstance } from "./types/types";
import { updateComponent } from "./updateComponent";

export type InternalInstance = ComponentInstance | null;
export type ChangeState = (state: ComponentState) => Partial<ComponentState>;
export interface ComponentState {}
export interface ComponentProps {}

export type OwnReactExtendedClass = new (props: Record<string, unknown>) => OwnReactComponent;
export abstract class OwnReactComponent<
    P extends ComponentProps = ComponentProps, 
    S extends ComponentState = ComponentState
  > {
  readonly props: P;
  state: S;
  componentWillUnmount?: () => void;
  componentDidMount?: () => void;
  componentDidUpdate?: () => void;
  forceUpdate: () => void;
  abstract render(): JSX.Element | null;
  __internalInstance: InternalInstance;
  context: unknown;
  refs: Record<string, ReactInstance>;

  constructor(props?: P) {
    this.props = props || ({} as P);
    this.state = {} as S;
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

  shouldComponentUpdate(prevProps: P, prevState: S): boolean {
    return true;
  }
}

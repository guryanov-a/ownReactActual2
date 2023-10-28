import { updateComponent } from "./updateComponent";

export class OwnReactComponent {
  constructor(props) {
    this.props = props || {};
    this.state = {};
  }

  setState(stateChangeInfo) {
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

OwnReactComponent.__internalInstance = null;

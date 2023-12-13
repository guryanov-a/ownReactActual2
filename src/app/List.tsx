import { OwnReactComponent } from "../ownReact/OwnReactComponent";

/**
 * List (which is wrapper for <ul>)
 */
export class List extends OwnReactComponent<{ children: JSX.Element[] }> {
  render() {
    return <ul>{this.props.children}</ul>;
  }
}

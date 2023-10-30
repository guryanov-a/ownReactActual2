import { OwnReactComponent } from "../ownReact/OwnReactComponent";

/**
 * List (which is wrapper for <ul>)
 * @param props.children - list items
 * @returns {JSX.Element}
 */
export class List extends OwnReactComponent {
  render() {
    return <ul>{this.props.children}</ul>;
  }
}

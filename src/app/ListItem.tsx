import { OwnReactComponent } from "../ownReact/OwnReactComponent";

/**
 * List item (which is wrapper for <li>)
 * @param {string} props.children - content of list item
 * @returns {JSX.Element}
 */
export class ListItem extends OwnReactComponent {
  render() {
    return <li key={this.props.key}>{this.props.children}</li>;
  }
}

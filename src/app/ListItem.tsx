import { ReactNode } from "react";
import { OwnReactComponent } from "../ownReact/OwnReactComponent";

interface Props {
  key: string;
  children: ReactNode;
}
/**
 * List item (which is wrapper for <li>)
 */
export class ListItem extends OwnReactComponent<Props> {
  render() {
    return <li key={this.props.key}>{this.props.children}</li>;
  }
}

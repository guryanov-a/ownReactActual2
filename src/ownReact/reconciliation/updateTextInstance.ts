import { TextElement, TextInstance } from "../types/types";
import { withPerformanceDomChange } from "../utils/withPerformance";

type UpdateDomText = (params: Params) => void;
const updateDomText: UpdateDomText = withPerformanceDomChange(({ instance, element }) => {
  instance.dom.nodeValue = element.props.nodeValue;
});

interface Params {
  instance: TextInstance;
  element: TextElement;
}
type UpdateTextInstance = (params: Params) => TextInstance;
export const updateTextInstance: UpdateTextInstance = ({instance, element}) => {
  const isTheSameTextElement = instance.element.props.nodeValue === element.props.nodeValue;

  if (!isTheSameTextElement) {
    updateDomText({ instance, element });
  }

  instance.element = element;
  return instance;
};

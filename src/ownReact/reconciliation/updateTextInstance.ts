import { withPerformanceDomChange } from "../utils/withPerformance";

const updateDomText = withPerformanceDomChange(({ instance, element }) => {
  instance.dom.nodeValue = element.props.nodeValue;
});

export const updateTextInstance = ({instance, element}) => {
  const isTheSameTextElement =
    instance.element.type === "TEXT_ELEMENT" &&
    instance.element.props.nodeValue === element.props.nodeValue;

  if (!isTheSameTextElement) {
    updateDomText({ instance, element });
  }

  instance.element = element;
  return instance;
};

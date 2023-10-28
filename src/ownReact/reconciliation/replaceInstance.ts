import { reconcile } from "./reconcile";
import { withPerformanceDomChange } from "../utils/withPerformance";

const replaceInstance = ({container, element}) => {
  const newInstance = reconcile({container, instance: null, element});
  return newInstance;
};

const replaceInstanceHofed = withPerformanceDomChange(replaceInstance);

export { replaceInstanceHofed as replaceInstance };

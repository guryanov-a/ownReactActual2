export const prepareDataForReconciliation = ({ instance, element }) => {
    instance.publicInstance.props = element.props;
    const childElement = instance.publicInstance.render();
    const oldChildInstance = instance.childInstance;

    return { instance: oldChildInstance, element: childElement };
};
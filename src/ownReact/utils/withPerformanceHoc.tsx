import { OwnReactComponent } from "../OwnReactComponent";

export function withPerformanceHoc(Component, name = Component.name) {
  return class extends OwnReactComponent {
    componentDidMount() {
      // Measure the start time
      this.startTime = performance.now();
    }

    componentDidUpdate() {
      // Measure the end time
      const endTime = performance.now();

      // Calculate the elapsed time
      const elapsedTime = endTime - this.startTime;

      // Log the elapsed time to the console
      console.log(`${name} took ${elapsedTime} milliseconds to render`);
    }

    render() {
      return <Component {...this.props} />;
    }
  };
}

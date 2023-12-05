import { App } from "./app/App.jsx";
import { renderDom } from "./ownReact/renderDom";

const root = document.getElementById("root");

renderDom({ element: <App />, container: root });

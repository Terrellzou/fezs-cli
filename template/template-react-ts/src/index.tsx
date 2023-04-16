import { render } from "react";
import { App } from "./app.tsx";
import "./index.css";

render(<App />, document.getElementById("app") as HTMLElement);

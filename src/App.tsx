import React from "react";
import DemoNormal from "./Form/demo/DemoNormal";
import DemoValidate from "./Form/demo/DemoValide";

import "./App.css";

export default function Demo() {
  return (
    <div className="App">
      <div className="demo-box">
        <DemoNormal />
      </div>
      <div className="demo-box">
        <DemoValidate />
      </div>
    </div>
  );
}

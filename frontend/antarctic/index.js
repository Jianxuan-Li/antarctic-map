
import "@babel/polyfill";
import ReactDOM from "react-dom";
import { Provider } from "mobx-react";
import { AppContainer } from "react-hot-loader";
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("en");

import App from "./app";
import inject from "./inject/index";

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Provider {...inject}>
        <Component />
      </Provider>
    </AppContainer>,
    document.getElementById("antarctic-map")
  );
};

render(App);

/**
 * 热更新配置
 * https://github.com/brickspert/blog/issues/1#hot-module-replacement
 */
if (module.hot) {
  module.hot.accept("./app", () => {
    render(App);
  });
}

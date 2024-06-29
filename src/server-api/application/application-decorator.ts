import { Constructor } from "../../common/component-util";

import applicationContext from "../../context/application-context";
import { ExpressApplication } from "./application";

export function Application(constructor: Constructor<ExpressApplication>) {
  applicationContext.assignExpressServerApplication(constructor);
  const serverApplication = applicationContext.getServerApplication();
  applicationContext.setServerConfig(serverApplication.Config);
  applicationContext.setPreconfigCb((e) => serverApplication.preConfigExpress(e));

  applicationContext.buildContext();
  applicationContext.boot();
}

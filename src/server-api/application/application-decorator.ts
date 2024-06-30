import { Constructor } from "../../common/component-util";

import applicationContext from "../../core/context/application-context";
import { ExpressApplication } from "./application";

export function Application(constructor: Constructor<ExpressApplication>) {
  applicationContext.assignExpressServerApplication(constructor);

  applicationContext.buildContext();
  applicationContext.boot();
}

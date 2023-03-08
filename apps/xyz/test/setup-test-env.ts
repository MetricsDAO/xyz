import { installGlobals } from "@remix-run/node";
import "@testing-library/jest-dom/extend-expect";
require("dotenv").config({ path: ".env.test" });
installGlobals();

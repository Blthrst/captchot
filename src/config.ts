import fs from "fs";
import YAML from "yaml";

import { Config } from "./types";

/**
 * Synchronous reading of the config.yaml 
 */
export const config: Config = YAML.parse(
  fs.readFileSync("./src/config.yaml", "utf-8")
);

import fs from "fs"
import YAML from "yaml"

import { Config } from "./interfaces"

export const config: Config = YAML.parse(fs.readFileSync("./src/config.yaml", "utf-8"))
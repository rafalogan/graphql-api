require('ts-node/register');
require('tsconfig-paths/register');

import { log } from "console";
import type { Knex } from "knex";

import { KnexfileConfig } from "src/config";
import { execDotenv } from "src/utils/utils";

execDotenv();

// Update with your config settings.
const config: Knex.Config = new KnexfileConfig()

log('knex file:', config);

module.exports = config;

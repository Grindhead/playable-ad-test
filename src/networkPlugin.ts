import { AdNetworkFactory } from "./lib/ad-network-plugin.js";
import { config } from "./config.js";

// Do not touch here unless you know what you're doing
export const networkPlugin = AdNetworkFactory.createAdNetwork(config.adNetworkType);
export const mraidAdNetworks = new Set(["unityads", "adcolony", "applovin", "kayzen"]);
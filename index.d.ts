/** Returns true if given parameter is local IP address or resolves into one, false otherwise */
declare async function isLocalhost(
  addrOrHost: string,
  canBind?: boolean,
): Promise<boolean>;

export = isLocalhost;

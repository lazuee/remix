import { createThemeAction } from "remix-themes";

import type { ActionFunctionArgs } from "@remix-run/node";
import { themeSessionResolver } from "~/sessions.server";

export async function action(args: ActionFunctionArgs) {
  const themeAction = createThemeAction(themeSessionResolver);

  return themeAction(args);
}

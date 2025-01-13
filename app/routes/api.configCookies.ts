import {ActionFunction, json} from "@remix-run/node";
import {configCookie} from "~/cookies/configCookie";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const config = Object.fromEntries(formData);

  const parsedConfig = JSON.parse(config.config as string);

  return Response.json(
    { success: true },
    {
      headers: {
        "Set-Cookie": await configCookie.serialize(parsedConfig),
      },
    }
  );
};
import {ActionFunction, data, json, LoaderFunction} from "@remix-run/node";
import {configCookie} from "~/cookies/configCookie";
import {sessionCookie} from "~/cookies/sessionCookie";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const config = Object.fromEntries(formData);

  const parsedConfig = JSON.parse(config.config as string);

  return data(
    { success: true },
    {
      headers: {
        "Set-Cookie": await configCookie.serialize(parsedConfig),
      },
    }
  );
};

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const config = await configCookie.parse(request.headers.get("Cookie"));

    return {config: config || null}
  } catch (error) {
    console.error("Error parsing cookie:", error);
    return data({ error: "Failed to parse cookie" }, { status: 500 });
  }
};

import {ActionFunction, data, LoaderFunction, redirect} from "@remix-run/node";
import {sessionCookie} from "~/cookies/sessionCookie";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const apiKey = formData.get("apiKey");

  if (typeof apiKey !== "string" || !apiKey.startsWith("sk-")) {
    return data({ error: "Invalid API Key format." }, { status: 400 });
  }

  const cookie = await sessionCookie.serialize(apiKey);

  return redirect("/",
    {
      headers: {
        "Set-Cookie": cookie,
      }
    }
  );
};

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const apiKey = await sessionCookie.parse(request.headers.get("Cookie"));

    return {apiKey: apiKey || null}
  } catch (error) {
    console.error("Error parsing cookie:", error);
    return data({ error: "Failed to parse cookie" }, { status: 500 });
  }
};

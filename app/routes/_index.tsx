import {ActionFunction, data, MetaFunction, redirect} from "@remix-run/node";
import Layout from "~/components/Layout/Layout";
import SearchInput from "~/components/SearchInput/SearchInput";
import { useSearchConfigStore } from "~/stores/searchConfigStore";
import {useFetcher, useLoaderData} from "@remix-run/react";
import {findInfluencer} from "~/services/openai.service";
import {sessionCookie} from "~/cookies/sessionCookie";
import {configCookie} from "~/cookies/configCookie";
import GenericError from "~/components/GenericError/GenericError";

export const meta: MetaFunction = () => {
  return [
    { title: "Influencers Search" },
    { name: "description", content: "Influencers Search" },
  ];
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const influencerName = formData.get("influencerName");

  const apiKey = await sessionCookie.parse(request.headers.get("Cookie"));

  if(!apiKey) {
    return data({error: "No API key found."}, {status: 401});
  }

  try {
    const config = await configCookie.parse(request.headers.get("Cookie"));
    const mode = config.mode
    const slug = await findInfluencer(influencerName as string, mode, apiKey);

    if (!slug) {
      return data({error: "Influencer not found.",  success: false }, { status: 404 });
    }

    return redirect(`/i/${slug}`);
  } catch (error) {
    return {error}
  }
};

export default function Index() {
  const fetcher = useFetcher();
  const { mode, timeRange, claimsToAnalyze, productsPerInfluencer } = useSearchConfigStore();

  const timeRangeText = timeRange === "all" ? "all time" : `the last ${timeRange}`;
  const modeText = mode === "specific" ? "a specific influencer" : "new influencers";

  const onSearch = (influencerName: string) => {
    fetcher.submit(
      { influencerName },
      { method: "post" }
    );
  };

  return (
    <Layout>
      {fetcher.data ? (
        <GenericError>
          {fetcher.data?.error.message}
          <div className={"mt-2"}>
            <button onClick={() => location.reload()}>
              Refresh
            </button>
          </div>
        </GenericError>
      ) : (
        <div className="h-full flex-col flex items-center justify-center my-auto">
          <h1 className={"text-gradient text-[54px] font-bold mb-1 text-center"}>
            Search <span className={"text-blue"}>influencer&#39;s</span> claims
          </h1>
          <h2 className={"text-gray text-base text-center"}>
            You are searching for
            <span className="text-white hover:text-blue transition-3 font-semibold"> {modeText} </span>
            in
            <span className="text-white hover:text-blue transition-3 font-semibold"> {timeRangeText} </span>
            period, analyzing
            <span className="text-white hover:text-blue transition-3 font-semibold"> {claimsToAnalyze} claims </span>
            {mode === "discover" && (
              <>
                and
                <span className="text-white hover:text-blue transition-3 font-semibold"> {productsPerInfluencer} products</span>
              </>
            )}
          </h2>
          <div className={"mt-6 w-full"}>
            <SearchInput onSearch={onSearch} isLoading={fetcher.state === "submitting"} />
          </div>
        </div>
      )}

    </Layout>
  );
}

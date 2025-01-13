import {LoaderFunction, redirect} from "@remix-run/node";
import {useLoaderData, useNavigate} from "@remix-run/react";
import Layout from "~/components/Layout/Layout";
import {Money} from "../../public/icons/Money";
import {UserGroup} from "../../public/icons/UserGroup";
import {Tag} from "../../public/icons/Tag";
import {Calendar} from "../../public/icons/Calendar";
import {Sparkles} from "../../public/icons/Sparkles";
import {ArrowUpRight} from "../../public/icons/ArrowUpRight";
import {TrendUp} from "../../public/icons/TrendUp";
import Card from "~/components/Card/Card";
import {Journal} from "~/stores/searchConfigStore";
import {analyzeInfluencer} from "~/services/openai.service";
import {unslugify} from "~/lib/utils";
import {sessionCookie} from "~/cookies/sessionCookie";
import {configCookie} from "~/cookies/configCookie";
import {Claim} from "~/types/Influencer";

import { redirect } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request, params }) => {
  const {influencer} = params;

  if (!influencer) {
    throw new Response("Influencer ID is required", {status: 400});
  }

  const apiKey = await sessionCookie.parse(request.headers.get("Cookie"));

  if (!apiKey) {
    return redirect("/", {status: 302});
  }

  try {
    const config = await configCookie.parse(request.headers.get("Cookie"));

    const influencerData = await analyzeInfluencer(
      {
        ...config,
        influencerName: unslugify(influencer),
        selectedJournals: config.selectedJournals
          .filter((journal: Journal) => journal.isActive)
          .map((journal: Journal) => journal.name),
      },
      apiKey
    );

    if (!influencerData) {
      throw new Response("Influencer not found", {status: 404});
    }

    return new Response(
      JSON.stringify({
        influencer: influencerData,
      }),
      {status: 200, headers: {"Content-Type": "application/json"}}
    );
  } catch (error) {
    console.error("Error analyzing influencer:", error);
    throw new Response
  }
}

function InfluencerPage() {
  const { influencer } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <Layout>
      {influencer?.error ? (
        <div className={"flex w-full h-full flex-col gap-2 items-center justify-center"}>
          {influencer?.error}
          <div className={"flex flex-row gap-2 mt-2"}>
            <button
              onClick={() => navigate("/")}
              className="border border-solid border-gray text-white flex items-center px-4 py-2 rounded-full ml-auto hover:bg-gray transition-3 mt-6"
            >
              Home
            </button>
            <button
              onClick={() => location.reload()}
              className="bg-white flex items-center text-contrast px-4 py-2 rounded-full ml-auto hover:bg-gray transition-3 mt-6"
            >
              Refresh
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className={"flex flex-col gap-4"}>
            <h1 className={"font-bold text-2xl my-0"}>{influencer.name}</h1>
            <div className={"flex flex-row flex-wrap gap-2"}>
              {influencer.categories?.map((c: string, idx: number) => (
                <div className={"px-4 py-2 text-sm rounded-full border border-solid border-gray"} key={idx}>{c}</div>
              ))}
            </div>
            <h2 className={"text-base text-gray"}>{influencer.description}</h2>
          </div>
          <div className={"mt-6 grid sm:grid-cols-4 grid-cols-2 gap-4"}>
            <Card>
              <div className={"flex flex-row justify-between items-center"}>
                <h4 className={"text-lg font-semibold"}>Trust Score</h4>
                <TrendUp className={"text-blue"}/>
              </div>
              <h3 className={"text-3xl text-bold text-blue mt-2"}>{influencer.trust}</h3>
              <h4 className={"mt-2 text-gray text-sm"}>Based in {influencer.verified_claims} verified claims</h4>
            </Card>
            <Card>
              <div className={"flex flex-row justify-between items-center"}>
                <h4 className={"text-lg font-semibold"}>Yearly Revenue</h4>
                <Money className={"text-blue"}/>
              </div>
              <h3 className={"text-3xl text-bold text-blue mt-2"}>{influencer.revenue}</h3>
              <h4 className={"mt-2 text-gray text-sm"}>Estimated earnings</h4>
            </Card>
            <Card>
              <div className={"flex flex-row justify-between items-center"}>
                <h4 className={"text-lg font-semibold"}>Products</h4>
                <Tag className={"text-blue"}/>
              </div>
              <h3 className={"text-3xl text-bold text-blue mt-2"}>{influencer.products}</h3>
              <h4 className={"mt-2 text-gray text-sm"}>Recommended products</h4>
            </Card>
            <Card>
              <div className={"flex flex-row justify-between items-center"}>
                <h4 className={"text-lg font-semibold"}>Followers</h4>
                <UserGroup className={"text-blue"}/>
              </div>
              <h3 className={"text-3xl text-bold text-blue mt-2"}>{influencer.followers}</h3>
              <h4 className={"mt-2 text-gray text-sm"}>Total following</h4>
            </Card>
          </div>
          <div className={"mt-6"}>
            <p className={"text-gray"}>Showing {influencer.claims?.length} claims</p>
            <div className={"mt-6 flex flex-col gap-4"}>
              {influencer.claims?.map((c: Claim, idx: number) => (
                <div key={idx} className={"border-b border-solid border-gray py-4"}>
                  <div className={"flex flex-row justify-between items-start"}>
                    <div>
                      <div className={"flex flex-row items-center gap-2 flex-grow"}>
                        <div className={"bg-blue-light text-blue text-sm rounded-full py-2 px-4"}>
                          {c.status}
                        </div>
                        <div className={"flex flex-row gap-1 items-center"}>
                          <Calendar className={"text-gray"}/>
                          <p className={"text-gray text-sm"}>{c.created_at}</p>
                        </div>
                      </div>
                      <p className={"my-3"}>{c.claim}</p>
                      <a href={c.originalSource.link} target={"_blank"} rel={"noreferrer"}
                         className={"flex items-center gap-1 text-blue hover:underline decoration-blue"}>
                        Visit source
                        <ArrowUpRight width={16} height={16}/>
                      </a>
                      <div className={"flex flex-col ml-6 mt-8"}>
                        <div className={"flex flex-row gap-1 items-center"}>
                          <Sparkles className={"text-blue"}/>
                          <p>AI Analysis</p>
                        </div>
                        {c.verificationSources.length === 0 ? (<p className={"mt-2 text-gray text-sm"}>No AI analysis
                          found</p>) : c.verificationSources?.map((vs, index) => (
                          <div key={index} className={"mt-2"}>
                            <p className={"mt-2 text-gray mb-2"}>{vs.description}</p>
                            <a href={vs.link} target={"_blank"} rel={"noreferrer"}
                               className={"flex gap-1 items-center text-blue hover:underline decoration-blue"}>
                              Visit research
                              <ArrowUpRight width={16} height={16}/>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className={"flex-shrink text-center"}>
                      <h3 className={"text-2xl text-blue text-bold"}>
                        {c.trust}
                      </h3>
                      <p className={"text-gray text-sm"}>Trust score</p>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default InfluencerPage
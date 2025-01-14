import Layout from "~/components/Layout/Layout";
import { UserGroup } from "../../public/icons/UserGroup";
import {LoaderFunction, redirect} from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { TrendUp } from "../../public/icons/TrendUp";
import { TrendDown } from "../../public/icons/TrendDown";
import Card from "~/components/Card/Card";
import { Check } from "../../public/icons/Check";
import { Chart } from "../../public/icons/Chart";
import { getLeaderboard } from "~/services/openai.service";
import { sessionCookie } from "~/cookies/sessionCookie";
import GenericError from "~/components/GenericError/GenericError";

export const loader: LoaderFunction = async ({ request }) => {
  const apiKey = await sessionCookie.parse(request.headers.get("Cookie"));

  if (!apiKey) {
    return redirect("/", {status: 302});
  }

  try {
    const { leaderboard, totalVerifiedClaims, averageTrustScore } =
      await getLeaderboard(apiKey);

    return new Response(
      JSON.stringify({
        leaderboard,
        totalVerifiedClaims,
        averageTrustScore,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return {error}
  }
};

function Leaderboard() {
  const { leaderboard, totalVerifiedClaims, averageTrustScore, error } =
    useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto px-4">
        {error ? (
          <GenericError>
            {error.message}
          </GenericError>
        ) : (
          <>
            <h1 className="text-3xl">Influencer Trust Leaderboard</h1>
            <p className="mt-2 text-gray">
              Real-time ranking of health influencers based on scientific accuracy,
              credibility, and transparency. Updated daily using AI-powered
              analysis.
            </p>
            <div className="mt-6 grid sm:grid-cols-3 grid-cols-1 gap-4">
              <Card>
                <div className="flex flex-row gap-2">
                  <UserGroup className="text-blue" height={32} width={32}/>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-2xl">{leaderboard?.length}</h2>
                    <h3 className="text-gray">Active influencers</h3>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="flex flex-row gap-2">
                  <Check className="text-blue" height={32} width={32}/>
                  <div className="flex flex-col">
                    <h2 className="text-2xl">{totalVerifiedClaims}</h2>
                    <h3 className="text-gray">Claims verified</h3>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="flex flex-row gap-2">
                  <Chart className="text-blue" height={32} width={32}/>
                  <div className="flex flex-col">
                    <h2 className="text-2xl">{averageTrustScore}</h2>
                    <h3 className="text-gray">Average Trust Score</h3>
                  </div>
                </div>
              </Card>
            </div>

            <div className="mt-6 bg-gray-900 text-white w-full overflow-hidden">
              <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
              <div className="max-w-[100vw] overflow-x-auto">
                <table className="table-fixed min-w-[600px]">
                  <thead>
                  <tr className="text-left text-sm uppercase bg-gray-800">
                    <th className="px-4 py-2">Rank</th>
                    <th className="px-4 py-2">Influencer</th>
                    <th className="px-4 py-2">Category</th>
                    <th className="px-4 py-2">Trust Score</th>
                    <th className="px-4 py-2">Trend</th>
                    <th className="px-4 py-2">Followers</th>
                    <th className="px-4 py-2">Verified Claims</th>
                  </tr>
                  </thead>
                  <tbody>
                  {leaderboard?.map((influencer: any) => (
                    <tr
                      key={influencer.rank}
                      className="border-t border-gray-700 cursor-pointer hover:bg-gray-800 text-gray py-2"
                      onClick={() => navigate(`/i/${influencer.slug}`)}
                    >
                      <td className="px-4 py-2">{`#${influencer.rank}`}</td>
                      <td className="px-4 py-2">{influencer.name}</td>
                      <td className="px-4 py-2">{influencer.category}</td>
                      <td className="px-4 py-2 text-blue">
                        {influencer.trustScore}
                      </td>
                      <td className="px-4 py-2">
                        {influencer.trend === "up" ? (
                          <TrendUp className="text-blue"/>
                        ) : (
                          <TrendDown className="text-red-700"/>
                        )}
                      </td>
                      <td className="px-4 py-2">{influencer.followers}</td>
                      <td className="px-4 py-2">{influencer.verifiedClaims}</td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default Leaderboard;

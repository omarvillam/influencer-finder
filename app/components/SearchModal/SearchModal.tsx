import {useEffect, useRef, useState} from "react";
import { useSearchConfigStore } from "~/stores/searchConfigStore";
import { Cog } from "../../../public/icons/Cog";
import Modal from "~/components/Modal/Modal";
import { User } from "../../../public/icons/User";
import { UserGroup } from "../../../public/icons/UserGroup";
import { Input } from "~/components/Input/Input";
import { Switch } from "~/components/Switch/Switch";
import { Bookmark } from "../../../public/icons/Bookmark";
import { Plus } from "../../../public/icons/Plus";
import {useFetcher} from "@remix-run/react";

interface ModalSearchProps {
  open: boolean;
  closeModal: () => void;
}

type TimeRange = "week" | "month" | "year" | "all";

function SearchModal({ open, closeModal }: ModalSearchProps) {
  const fetcher = useFetcher();
  const fetcherRef = useRef(fetcher)

  const { setConfig, ...globalConfig } = useSearchConfigStore();

  useEffect(() => {
    fetcherRef.current.load("/api/configCookies");
    setFormState(fetcher.data && fetcher.data?.config || globalConfig);
  }, []);

  useEffect(() => {
    if (fetcher.data?.config) {
      setFormState(fetcher.data.config);
      setConfig(fetcher.data.config);
    }
  }, [fetcher.data, setConfig]);


  const [formState, setFormState] = useState(fetcher.data?.config || globalConfig);

  const [addJournalist, setAddJournalist] = useState(false);
  const [journalName, setJournalName] = useState("");

  const handleChange = <K extends keyof typeof formState>(
    field: K,
    value: typeof formState[K]
  ) => {
    setFormState((prev: typeof formState) => ({
      ...prev,
      [field]: value,
    }));
  };

  const timeRanges: { value: TimeRange; label: string }[] = [
    { value: "week", label: "Last Week" },
    { value: "month", label: "Last Month" },
    { value: "year", label: "Last Year" },
    { value: "all", label: "All Time" },
  ];

  const saveConfig = () => {
    setConfig(formState);

    fetcher.submit(
      { config: JSON.stringify(formState) },
      { method: "post", action: "/api/configCookies" }
    );

    closeModal();
  };

  return (
    <Modal open={open} onClose={closeModal}>
      <div className="flex flex-row gap-3 items-center mb-3 max-h-[80vh]">
        <Cog />
        <h2 className="text-xl font-bold">Search configuration</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Specific Influencer */}
        <div
          onClick={() => handleChange("mode", "specific")}
          role="presentation"
          className={`cursor-pointer p-4 border rounded-md ${
            formState.mode === "specific"
              ? "bg-blue-light text-blue border-blue"
              : "bg-black text-gray border border-solid border-gray"
          }`}
        >
          <div className="flex flex-row gap-2">
            <User />
            <h3 className="text-lg font-semibold mb-2">Specific Influencer</h3>
          </div>
          <p className="text-sm">Research a known health influencer by name.</p>
        </div>

        {/* Discover Influencers */}
        <div
          onClick={() => handleChange("mode", "discover")}
          role="presentation"
          className={`cursor-pointer p-4 border rounded-md ${
            formState.mode === "discover"
              ? "bg-blue-light text-blue border-blue"
              : "bg-black text-gray border border-solid border-gray"
          }`}
        >
          <div className="flex flex-row gap-2">
            <UserGroup />
            <h3 className="text-lg font-semibold mb-2">Discover Influencers</h3>
          </div>
          <p className="text-sm">Find, discover and analyze new health influencers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          {/* Time Range */}
          <div>
            <h3 className="text-base">Time Range</h3>
            <div className="grid grid-cols-2 gap-2 items-center mt-2">
              {timeRanges.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => handleChange("timeRange", value)}
                  className={`px-4 py-2 rounded-lg border ${
                    formState.timeRange === value
                      ? "bg-blue-light text-blue border-blue"
                      : "bg-black text-gray border-gray"
                  }`}
                >
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Claims */}
          <div className="mt-6">
            <Input
              label="Claims to analyze"
              value={formState.claimsToAnalyze}
              onChange={(value) => handleChange("claimsToAnalyze", value as number)}
              type="number"
              placeholder="Enter number of claims"
              helper="Recommended: 50-100 claims for comprehensive analysis"
            />
          </div>
        </div>

        {/* Column 2 */}
        <div>
          {/* Products per influencer */}
          <div className="mt-5">
            <Input
              label="Product to analyze"
              value={formState.productsPerInfluencer}
              onChange={(value) => handleChange("productsPerInfluencer", value as number)}
              type="number"
              placeholder="Enter number of products"
              helper="Set 0 to skip product analysis"
            />
          </div>

          {/* Include Revenue Analysis */}
          <div className="mt-6">
            <Switch
              label="Include Revenue Analysis"
              description="Analyze monetization methods and estimate earnings"
              checked={formState.includeRevenueAnalysis}
              onChange={(value) => handleChange("includeRevenueAnalysis", value)}
            />
          </div>

          {/* Verify with Scientific Journalist */}
          <div className="mt-6">
            <Switch
              label="Verify with Scientific Journalist"
              description="Cross-reference claims with scientific journals"
              checked={formState.verifyWithJournals}
              onChange={(value) => handleChange("verifyWithJournals", value)}
            />
          </div>
        </div>
      </div>

      {/* Select Journals */}
      <div className="mt-6">
        <h3 className="text-base font-semibold mb-3">Select Journals</h3>
        <div className="flex flex-row flex-wrap items-center gap-4">
          {formState.selectedJournals.map((journal, index) => (
            <button
              key={journal.name}
              onClick={() => {
                const updatedJournals = [...formState.selectedJournals];
                updatedJournals[index].isActive = !journal.isActive;
                handleChange("selectedJournals", updatedJournals);
              }}
              className={`p-3 border rounded-lg ${
                journal.isActive
                  ? "bg-blue-light text-blue border-blue"
                  : "bg-black text-gray border-gray"
              }`}
            >
              {journal.name}
            </button>
          ))}
          {addJournalist && (
            <div className="flex items-center gap-2">
              <Input
                value={journalName}
                onChange={(value) => setJournalName(value as string)}
                type="text"
                placeholder="Enter journal name"
              />
              <button
                onClick={() => {
                  if (journalName.trim() !== "") {
                    handleChange("selectedJournals", [
                      ...formState.selectedJournals,
                      { name: journalName.trim(), isActive: true },
                    ]);
                    setJournalName("");
                    setAddJournalist(false);
                  }
                }}
              >
                <Plus className="text-blue" />
              </button>
            </div>
          )}
        </div>
        <div
          role="presentation"
          className="mt-6 flex items-center gap-2 cursor-pointer hover:underline decoration-gray"
          onClick={() => setAddJournalist(true)}
        >
          <Plus />
          Add a journalist
        </div>
      </div>

      {/* Notes */}
      <div className="mt-6">
        <h3 className="text-base font-semibold mb-3">Notes for Research Assistant</h3>
        <textarea
          className="bg-black border border-solid border-gray rounded-lg px-4 py-2 w-full"
          rows={4}
          onChange={(e) => handleChange("notes", e.target.value)}
        />
      </div>

      {/* Save Button */}
      <button
        onClick={saveConfig}
        className="bg-white flex items-center text-contrast px-4 py-2 rounded-full ml-auto hover:bg-gray transition-3 mt-6"
      >
        <Bookmark className="mr-2" />
        Save configuration
      </button>
    </Modal>
  );
}

export default SearchModal;

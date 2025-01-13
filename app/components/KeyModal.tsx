import Modal from "~/components/Modal/Modal";
import {useRef} from "react";
import { Bookmark } from "../../public/icons/Bookmark";
import {useFetcher} from "@remix-run/react";

interface ModalSearchProps {
  open: boolean;
  closeModal: () => void;
  apiKey?: string;
}

function KeyModal({ open, closeModal, apiKey }: ModalSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const fetcher = useFetcher();

  const saveConfig = () => {
    const key = inputRef.current?.value;

    if (!key || !key.startsWith("sk-")) {
      alert("Please enter a valid API Key.");
      return;
    }

    fetcher.submit(
      { apiKey: key },
      { method: "post", action: "/api/sessionCookies" }
    );

    closeModal();
    alert("API Key saved!");
  };

  return (
    <Modal open={open} onClose={closeModal}>
      <h1 className={"mb-2"}>Introduce your <a className={"underline"} href={"https://platform.openai.com/settings/organization/api-keys"}>OpenAI&#39;s key</a></h1>
      <input
        ref={inputRef}
        className="rounded-full border border-solid border-gray px-4 py-4 text-2xl w-full"
        placeholder="sk-xxxx-xxxx-xxxx-xxxx"
        defaultValue={apiKey}
      />
      <h2 className={"text-sm text-gray mt-2"}>This will allow us to connect with OpenAI and generate responses</h2>
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

export default KeyModal;

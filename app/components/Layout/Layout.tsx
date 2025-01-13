import {PropsWithChildren, useEffect, useRef, useState} from "react";
import Navigation from "~/components/Navigation/Navigation";
import KeyModal from "~/components/KeyModal";
import { useFetcher } from "@remix-run/react";

function Layout({ children }: PropsWithChildren) {
  const fetcher = useFetcher();
  const fetcherRef = useRef(fetcher)
  const [open, setOpen] = useState<boolean>(false);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  useEffect(() => {
    fetcherRef.current.load("/api/sessionCookies");
  }, []);

  useEffect(() => {
    if (fetcher.data && !fetcher.data.apiKey && !open) {
      openModal();
    }
  }, [fetcher.data, open]);

  return (
    <div className={"text-white"}>
      <KeyModal open={open} closeModal={closeModal} apiKey={fetcher.data?.apiKey}/>

      <Navigation openModal={openModal} />

      <div className={"px-4 min-h-[calc(100vh-80px)] flex mx-auto justify-center max-w-[1216px]"}>
        <div className={"mt-20"}>{children}</div>
      </div>
    </div>
  );
}

export default Layout;

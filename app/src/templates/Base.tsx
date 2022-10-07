import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import Menubar from "../components/Menubar";
import Sidebar from "../components/Sidebar";
import { toCapitalize } from "../utils";

interface Props {
  children?: ReactNode;
}

export default function Base({ children }: Props) {
  const router = useRouter();
  const [routeName, setRouteName] = useState<string>();

  useEffect(() => {
    if (router.pathname === "/") setRouteName("Home");
    else if (router.pathname === "/404") setRouteName("NotFound");
    else setRouteName(toCapitalize(router.pathname.split("/")[1]));
  }, [router.pathname]);

  return (
    <div>
      <Menubar />
      <div className="relative flex overflow-x-hidden">
        <Sidebar />
        <main className="relative ml-72 flex min-h-screen grow flex-col">
          <div className="mt-16 mb-12 flex flex-grow">
            <div className="mx-auto mt-14 flex max-w-screen-xl flex-grow justify-center px-8 2xl:px-16">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

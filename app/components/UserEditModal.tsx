import { PublicKey } from "@solana/web3.js";
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { createUserAlias, updateUserAlias } from "../pages/api/alias";
import { toCollapse } from "../utils";

type FormValues = {
  name: string;
};

export default function UserEditModal({
  visible,
  setVisible,
  publicKey,
  alias,
}: {
  visible: boolean;
  setVisible: (a: boolean) => void;
  publicKey: PublicKey;
  alias: string;
}) {
  const LIMIT = 50;
  const { register, handleSubmit, watch, resetField } = useForm<FormValues>();

  const canSend = watch("name") && watch("name") !== alias;

  const onSubmit: SubmitHandler<FormValues> = (data) => send(data);

  const send = async (data: FormValues) => {
    if (alias === toCollapse(publicKey)) {
      await createUserAlias(data.name);
    } else {
      await updateUserAlias(data.name);
    }
    onClose();
  };

  const onClose = () => {
    resetField("name");
    setVisible(false);
  }

  return (
    <>
      {visible && (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="fixed top-0 my-[10vh] ">
              <div className="max-w-[21.5rem] transform overflow-hidden rounded-2xl border border-sky-50/5 bg-white py-6 px-8 text-center align-middle shadow-xl transition-all">
                <button
                  className="btn btn-circle btn-sm absolute right-2 top-2 p-2 rounded-full border-transparent bg-transparent text-gray-500 hover:border-gray-200 hover:bg-gray-200 hover:text-gray-700"
                  onClick={onClose}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 iconify iconify--heroicons-outline"
                    width="1em"
                    height="1em"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
                <div className="flex items-center justify-center">
                  <Image
                    src={`https://avatars.dicebear.com/api/jdenticon/${publicKey.toBase58()}.svg`}
                    width={40}
                    height={40}
                    alt="profile"
                  />
                </div>
                <h2 className="mt-4 text-lg font-medium leading-6 text-gray-700">
                  Edit Your Alias
                </h2>
                <div className="mt-2 text-gray-500">
                  <p className="text-sm">
                    Change the alias that is displayed for your connected
                    wallets publickey.
                  </p>
                </div>
                <div className="mt-6 flex justify-center">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col">
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-500/80 iconify iconify--heroicons-outline"
                            width="1em"
                            height="1em"
                            preserveAspectRatio="xMidYMid meet"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5.121 17.804A13.937 13.937 0 0 1 12 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 1 1-6 0a3 3 0 0 1 6 0Zm6 2a9 9 0 1 1-18 0a9 9 0 0 1 18 0Z"
                            ></path>
                          </svg>
                        </span>
                        <input
                          {...register("name", {
                            required: true,
                            maxLength: LIMIT,
                          })}
                          id="name"
                          type="text"
                          className="block w-full h-12 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder={alias}
                          autoComplete="off"
                          maxLength={LIMIT}
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className={
                        (canSend
                          ? "bg-primary-500 "
                          : "bg-primary-300 cursor-not-allowed ") +
                        "px-4 py-2 font-semibold text-white rounded-md mt-6 inline-flex w-full justify-center"
                      }
                      disabled={!canSend}
                    >
                      Update Alias!
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      )}
    </>
  );
}

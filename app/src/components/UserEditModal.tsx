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
  };

  return (
    <>
      {visible && (
        <div>
          <div className="fixed flex justify-center items-center overflow-x-hidden overflow-y-auto inset-0 z-50 outline-none focus:outline-none">
            <div className="fixed top-0 my-[10vh] ">
              <div className="max-w-[21.5rem] transform overflow-hidden rounded-2xl border border-skin-primary bg-fill-primary py-6 px-8 text-center align-middle shadow-xl transition-all">
                <button
                  className="btn btn-circle btn-sm absolute right-2 top-2 p-2 rounded-full border-transparent bg-transparent text-color-secondary hover:border-skin-primary hover:bg-fill-third hover:text-color-primary"
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
                    />
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
                <h2 className="mt-4 text-lg font-medium leading-6 text-color-primary">
                  Edit Your Alias
                </h2>
                <div className="mt-2 text-color-secondary">
                  <p className="text-sm">
                    Change the alias that is displayed for your connected
                    wallets publickey.
                  </p>
                </div>
                <div className="mt-6 flex justify-center">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col">
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center rounded-l-md border border-r-0 border-skin-primary bg-fill-secondary px-3 text-color-secondary">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 iconify iconify--heroicons-outline"
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
                          className="form-input block w-full h-12 flex-1 text-color-secondary bg-transparent rounded-none rounded-r-md border-skin-primary focus:border-focus focus:ring-focus"
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
                          : "bg-primary-300/80 cursor-not-allowed ") +
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
          <div className="fixed inset-0 z-40 bg-fill-opacity"></div>
        </div>
      )}
    </>
  );
}

import { PublicKey } from "@solana/web3.js";
import TextareaAutosize from "react-autosize-textarea/lib";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTheme } from "../contexts/themeProvider";
import { Comment } from "../models/Comment";
import { sendComment } from "../pages/api/comments";
import {
  getWorkspace,
  notifyLoading,
  notifyUpdate,
  useCountCharacterLimit,
} from "../utils";

type FormValues = {
  content: string;
};
const LIMIT = 280;

export default function CommentForm({
  tweet,
  added,
  onClose,
}: {
  tweet: PublicKey;
  added: (a: Comment) => void;
  onClose: () => void;
}) {
  const { theme } = useTheme();
  const { register, resetField, handleSubmit, watch } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data) => send(data);
  const workspace = getWorkspace();

  // Character limit / count-down
  const characterLimit = useCountCharacterLimit(watch("content"));
  let characterLimitColor = "text-color-third";
  if (LIMIT - characterLimit <= 10) characterLimitColor = "text-yellow-500";
  if (LIMIT - characterLimit < 0) characterLimitColor = "text-red-500";

  const canComment = watch("content") && LIMIT - characterLimit > 0;

  const send = async (data: FormValues) => {
    if (!workspace) return;
    const toastId = notifyLoading(
      "Transaction in progress. Please wait...",
      theme
    );
    const result = await sendComment(
      workspace.program,
      workspace.wallet,
      tweet,
      data.content
    );
    notifyUpdate(toastId, result.message, result.comment ? "success" : "error");
    if (result.comment) {
      added(result.comment);
      resetField("content");
      onClose();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border-t border-skin-primary mt-4 mx-4 px-4 pt-4"
    >
      <TextareaAutosize
        {...register("content", {
          required: true,
          maxLength: LIMIT,
        })}
        id="content"
        rows={1}
        className="mb-3 w-full resize-none text-lg text-color-secondary focus:outline-none bg-transparent"
        placeholder="Add Comment..."
      />
      <div className="-m-2 flex flex-wrap items-center justify-between">
        <div className="m-1 ml-auto flex items-center space-x-4">
          {/* <!-- Character limit. --> */}
          <div className="text-sm">
            <span className={characterLimitColor}>{characterLimit}</span>
            <span className="text-color-secondary">{` / ${LIMIT}`}</span>
          </div>
          {/* <!-- Cancel button. --> */}
          <button
            className="rounded-full px-4 py-2 font-semibold bg-fill-third text-color-primary"
            onClick={onClose}
          >
            Cancel
          </button>
          {/* <!-- Send button. --> */}
          <button
            disabled={!canComment}
            className={
              (canComment
                ? "bg-primary-500 "
                : "bg-primary-300/80 cursor-not-allowed ") +
              "rounded-full px-4 py-2 font-semibold text-white"
            }
            type="submit"
          >
            Send
          </button>
        </div>
      </div>
    </form>
  );
}

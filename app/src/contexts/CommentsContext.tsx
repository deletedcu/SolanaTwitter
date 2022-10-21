import { PublicKey } from "@solana/web3.js";
import { createContext, ReactNode, useCallback, useMemo } from "react";
import useTheme from "../hooks/useTheme";
import useWorkspace from "../hooks/useWorkspace";
import { Comment } from "../models/Comment";
import {
  deleteComment,
  sendComment,
  updateComment,
} from "../pages/api/comments";
import { notifyLoading, notifyUpdate } from "../utils";

interface CommentsContextState {
  sendComment(tweetKey: PublicKey, content: string): Promise<Comment | null>;
  updateComment(commentKey: PublicKey, content: string): Promise<boolean>;
  deleteComment(commentKey: PublicKey): Promise<boolean>;
}

const CommentsContext = createContext<CommentsContextState>(null!);

export function CommentsProvider({ children }: { children: ReactNode }) {
  const workspace = useWorkspace();
  const { theme } = useTheme();

  const _sendComment = useCallback(
    async (tweetKey: PublicKey, content: string) => {
      if (workspace) {
        const toastId = notifyLoading(
          "Transaction in progress. Please wait...",
          theme
        );
        const result = await sendComment(workspace, tweetKey, content);
        notifyUpdate(
          toastId,
          result.message,
          result.comment ? "success" : "error"
        );

        if (result.comment) {
          return result.comment;
        }
      }

      return null;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [workspace]
  );

  const _updateComment = useCallback(
    async (commentKey: PublicKey, content: string) => {
      if (workspace) {
        const toastId = notifyLoading(
          "Transaction in progress. Please wait...",
          theme
        );
        const result = await updateComment(workspace, commentKey, content);
        notifyUpdate(
          toastId,
          result.message,
          result.success ? "success" : "error"
        );

        return result.success;
      }
      return false;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [workspace]
  );

  const _deleteComment = useCallback(
    async (commentKey: PublicKey) => {
      if (workspace) {
        const toastId = notifyLoading(
          "Transaction in progress. Please wait...",
          theme
        );
        const result = await deleteComment(workspace, commentKey);
        notifyUpdate(
          toastId,
          result.message,
          result.success ? "success" : "error"
        );

        return result.success;
      }
      return false;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [workspace]
  );

  const value = useMemo(
    () => ({
      sendComment: _sendComment,
      updateComment: _updateComment,
      deleteComment: _deleteComment,
    }),
    [_deleteComment, _sendComment, _updateComment]
  );

  return (
    <CommentsContext.Provider value={value}>
      {children}
    </CommentsContext.Provider>
  );
}

export default CommentsContext;

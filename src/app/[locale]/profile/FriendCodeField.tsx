"use client";

import axios from "../../../axios";
import TokenField from "../../../components/TokenField";
import { getErrorMessage } from "../../../lib/errorHandling/errorHandler";

interface ApiFriendsRegenerateResponse {
  friend_code: string;
}

export const FriendCodeField = ({ friendCode }: { friendCode: string }) => {
  const regenerateFriendCode = async () => {
    try {
      const { data } = await axios.post<ApiFriendsRegenerateResponse>(
        "/friends/regenerate",
        null,
      );
      const newFriendCode = data.friend_code;
      return newFriendCode;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw getErrorMessage(error);
    }
  };

  return (
    <TokenField
      value={friendCode}
      censorable
      revealLength={4}
      regenerate={regenerateFriendCode}
      copyFormatter={(value) => `ttfc_${value}`}
      textFormatter={(value) => `ttfc_${value}`}
    />
  );
};

"use client";

import axios from "../../../axios";
import TokenField from "../../../components/TokenField";
import { getErrorMessage } from "../../../lib/errorHandling/errorHandler";

export interface ApiAuthRegenerateResponse {
  token: string;
}

export const AuthTokenField = ({
  token,
  texts,
}: {
  token: string;
  texts: {
    copy: string;
    copied: string;
    hide: string;
    reveal: string;
    regenerate: string;
    error: string;
    unknownErrorOccurred: string;
  };
}) => {
  const regenerateToken = async () => {
    try {
      const { data } = await axios.post<ApiAuthRegenerateResponse>(
        "/auth/regenerate",
        null,
      );
      const newToken = data.token;
      return newToken;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw getErrorMessage(error);
    }
  };

  return (
    <TokenField
      value={token}
      regenerate={regenerateToken}
      censorable
      revealLength={4}
      texts={texts}
    />
  );
};

"use client";

import axios from "../../../axios";
import TokenField from "../../../components/TokenField";
import { getErrorMessage } from "../../../lib/errorHandling/errorHandler";

export interface ApiAuthRegenerateResponse {
  token: string;
}

export const AuthTokenField = ({ token }: { token: string }) => {
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
    />
  );
};

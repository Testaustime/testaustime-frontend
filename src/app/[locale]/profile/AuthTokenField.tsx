"use client";

import TokenField from "../../../components/TokenField";
import { regenerateToken } from "./actions";

export const AuthTokenField = ({ token }: { token: string }) => {
  return (
    <TokenField
      value={token}
      regenerate={async () => {
        const result = await regenerateToken();
        if (typeof result === "object") {
          // TODO: Show error
          throw new Error(result.error);
        }

        return result;
      }}
      censorable
      revealLength={4}
    />
  );
};

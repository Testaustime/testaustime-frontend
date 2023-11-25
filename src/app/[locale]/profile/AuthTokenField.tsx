"use client";

import TokenField from "../../../components/TokenField";
import { regenerateToken } from "./actions";

export const AuthTokenField = ({ token }: { token: string }) => {
  return (
    <TokenField
      value={token}
      regenerate={async () => {
        await regenerateToken();
      }}
      censorable
      revealLength={4}
    />
  );
};

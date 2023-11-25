"use client";

import TokenField from "../../../components/TokenField";
import { regenerateFriendCode } from "./actions";

export const FriendCodeField = ({ friendCode }: { friendCode: string }) => {
  return (
    <TokenField
      value={friendCode}
      censorable
      revealLength={4}
      regenerate={async () => {
        await regenerateFriendCode();
      }}
      copyFormatter={(value) => `ttfc_${value}`}
      textFormatter={(value) => `ttfc_${value}`}
    />
  );
};

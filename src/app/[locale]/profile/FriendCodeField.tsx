"use client";

import { useRouter } from "next/navigation";
import TokenField from "../../../components/TokenField";
import { regenerateFriendCode } from "./actions";

export const FriendCodeField = ({ friendCode }: { friendCode: string }) => {
  const router = useRouter();

  return (
    <TokenField
      value={friendCode}
      censorable
      revealLength={4}
      regenerate={async () => {
        await regenerateFriendCode();
        router.refresh();
      }}
      copyFormatter={(value) => `ttfc_${value}`}
      textFormatter={(value) => `ttfc_${value}`}
    />
  );
};

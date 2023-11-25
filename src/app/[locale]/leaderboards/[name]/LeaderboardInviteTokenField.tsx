"use client";

import TokenField from "../../../../components/TokenField";
import { regenerateInviteCode } from "./actions";

type LeaderboardInviteTokenFieldProps = {
  leaderboardName: string;
  inviteCode: string;
  isAdmin: boolean;
};

export const LeaderboardInviteTokenField = ({
  leaderboardName,
  inviteCode,
  isAdmin,
}: LeaderboardInviteTokenFieldProps) => {
  return (
    <TokenField
      value={inviteCode}
      regenerate={
        isAdmin
          ? async () => {
              await regenerateInviteCode(leaderboardName);
            }
          : undefined
      }
      censorable
      revealLength={4}
      textFormatter={(currentValue: string) => `ttlic_${currentValue}`}
      copyFormatter={(currentValue: string) => `ttlic_${currentValue}`}
    />
  );
};

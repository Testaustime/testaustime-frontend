"use client";

import axios from "../../../../axios";
import TokenField from "../../../../components/TokenField";

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
              await axios.post<{ invite_code: string }>(
                `/leaderboards/${leaderboardName}/regenerate`,
                {},
              );
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

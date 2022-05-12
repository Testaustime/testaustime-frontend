const alphanumerics = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export const generateFriendCode = () => {
  const code = Array.from({ length: 24 }, () =>
    alphanumerics[Math.floor(Math.random() * alphanumerics.length)]).join("");
  return `ttfc_${code}`;
};

export const generateLeaderboardInviteCode = () => {
  const code = Array.from({ length: 32 }, () =>
    alphanumerics[Math.floor(Math.random() * alphanumerics.length)]).join("");
  return `ttlic_${code}`;
};
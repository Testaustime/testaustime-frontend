export const POST = () => {
  return new Response(null, {
    status: 200,
    headers: {
      "Set-Cookie":
        "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;",
    },
  });
};

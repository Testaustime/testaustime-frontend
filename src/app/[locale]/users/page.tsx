import { redirect } from "next/navigation";
import { searchUsers } from "../../../api/usersApi";
import initTranslations from "../../i18n";
import {
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
} from "@mantine/core";
import Link from "next/link";
import { showNotification } from "@mantine/notifications";
import { logOutAndRedirect } from "../../../utils/authUtils";
import { GetRequestError } from "../../../types";

export default async function UsersPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams?: { q?: string };
}) {
  const keyword = searchParams?.q ?? "";
  const users = await searchUsers(keyword);
  const { t } = await initTranslations(params.locale, ["common"]);

  if ("error" in users) {
    switch (users.error) {
      case GetRequestError.RateLimited:
        return redirect("/rate-limited");
      case GetRequestError.UnknownError:
        return <div>{t("users.search.unknownError")}</div>;
      case GetRequestError.Unauthorized:
        showNotification({
          title: t("error"),
          color: "red",
          message: t("errors.unauthorized"),
        });
        await logOutAndRedirect();
        break;
    }
    return;
  }

  return (
    <div>
      <h1>{t("users.search.title")}</h1>
      <p>
        {t("users.search.resultCount", { count: users.length, query: keyword })}
      </p>
      {users.length > 0 && (
        <Table>
          <TableThead>
            <TableTr>
              <TableTh>{t("users.search.table.username")}</TableTh>
            </TableTr>
          </TableThead>
          <TableTbody>
            {users.map((user) => (
              <TableTr key={user.id}>
                <TableTd>
                  <Link href={`/${params.locale}/users/${user.username}`}>
                    {user.username}
                  </Link>
                </TableTd>
              </TableTr>
            ))}
          </TableTbody>
        </Table>
      )}
    </div>
  );
}

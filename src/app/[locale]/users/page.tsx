import { redirect } from "next/navigation";
import { searchUsers } from "../../../api/usersApi";
import { SearchUsersApiResponse, SearchUsersError } from "../../../types";
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

  let data: SearchUsersApiResponse = [];
  if ("error" in users) {
    switch (users.error) {
      case SearchUsersError.RateLimited:
        return redirect("/rate-limited");
      case SearchUsersError.UnknownError:
        return <div>{t("users.search.unknownError")}</div>;
    }
  } else {
    data = users;
  }

  return (
    <div>
      <h1>{t("users.search.title")}</h1>
      <p>
        {t("users.search.resultCount", { count: data.length, query: keyword })}
      </p>
      {data.length > 0 && (
        <Table>
          <TableThead>
            <TableTr>
              <TableTh>{t("users.search.table.username")}</TableTh>
            </TableTr>
          </TableThead>
          <TableTbody>
            {data.map((user) => (
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

"use client";

import { ActionIcon, Button, Popover, Stack, Text } from "@mantine/core";
import { Form, Formik } from "formik";
import { FormikTextInput } from "../forms/FormikTextInput";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useTranslation } from "react-i18next";

export const UserSearch = () => {
  const [isOpen, setOpen] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Popover opened={isOpen} onChange={setOpen} withinPortal={false}>
      <Popover.Target>
        <ActionIcon
          variant="outline"
          onClick={() => {
            setOpen((o) => !o);
          }}
        >
          <MagnifyingGlassIcon />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack gap="xs">
          <Text>{t("users.search.popover.title")}</Text>
          <Formik
            initialValues={{ keyword: "" }}
            onSubmit={(value) => {
              setOpen(false);
              router.push(`/users?q=${value.keyword}`);
            }}
          >
            {() => (
              <Stack component={Form} gap="xs">
                <FormikTextInput
                  name="keyword"
                  label={t("users.search.popover.label")}
                  placeholder={t("users.search.popover.placeholder")}
                  data-autofocus
                />
                <Button type="submit">
                  {t("users.search.popover.button")}
                </Button>
              </Stack>
            )}
          </Formik>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
};

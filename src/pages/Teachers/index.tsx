import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";

const columns = (t: TFunction) => [
  { name: t("NAME"), uid: "name" },
  { name: t("EMAIL"), uid: "email" },
  { name: t("PHONE"), uid: "phone" },
  { name: t("REGION"), uid: "region" },
  { name: t("VILLAGE"), uid: "village" },
  { name: t("SCHOOL"), uid: "school" },
  { name: t("GRADE"), uid: "grade" },
];

const getTeachersFromLocalStorage = (): any[] => {
  const teachers = localStorage.getItem('teachers');
  return teachers ? JSON.parse(teachers) : [];
};

export default function Teachers() {
  const { t } = useTranslation();
  const [teachers, setTeachers] = React.useState<any[]>([]);

  React.useEffect(() => {
    setTeachers(getTeachersFromLocalStorage());
  }, []);

  const renderCell = React.useCallback((teacher: any, columnKey: React.Key) => {
    const cellValue = teacher[columnKey as keyof typeof teacher];

    switch (columnKey) {
      case "name":
        return `${teacher.firstName} ${teacher.lastName}`;
      default:
        return cellValue;
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{t("TEACHERS_LIST")}</h1>
      <Table aria-label="Teachers table">
        <TableHeader columns={columns(t)}>
          {(column) => (
            <TableColumn key={column.uid} align="start">
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={teachers}>
          {(item) => (
            <TableRow key={item.email}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

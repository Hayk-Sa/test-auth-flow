import React from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";
const columns = (t: TFunction) => [
  { name: t("NAME"), uid: "name" },
  { name: t("EMAIL"), uid: "email" },
  { name: t("PHONE"), uid: "phone" },
  { name: t("COUNTRY"), uid: "country" },
  { name: t("REGION_STATE"), uid: "region" },
  { name: t("CITY"), uid: "city" },
];

const getDonorsFromLocalStorage = (): any[] => {
  const donors = localStorage.getItem('donors');
  return donors ? JSON.parse(donors) : [];
};

export default function Donors() {
  const { t } = useTranslation();
  const [donors, setDonors] = React.useState<any[]>([]);

  React.useEffect(() => {
    setDonors(getDonorsFromLocalStorage());
  }, []);
  
  const renderCell = React.useCallback((donor: any, columnKey: React.Key) => {
    const cellValue = donor[columnKey as keyof typeof donor];

    switch (columnKey) {
      case "name":
        return `${donor.firstName} ${donor.lastName}`;
      default:
        return cellValue;
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{t("DONORS_LIST")}</h1>
      <Table aria-label="Donors table">
        <TableHeader columns={columns(t)}>
          {(column) => (
            <TableColumn key={column.uid} align="start">
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={donors}>
          {(item) => (
            <TableRow key={item.email}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
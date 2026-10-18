
import ExcelJS from "exceljs";
import type { StudentAccount } from "../types/student";

export async function exportAccountsExcel(
  accounts: StudentAccount[],
): Promise<void> {
  if (accounts.length === 0) {
    throw new Error("Không có tài khoản để xuất.");
  }

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Student Account Generator";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet("Student Accounts");

  worksheet.columns = [
    { header: "STT", key: "stt", width: 10 },
    { header: "Họ tên", key: "fullName", width: 28 },
    { header: "Lớp", key: "className", width: 14 },
    { header: "Username", key: "username", width: 24 },
    { header: "Password", key: "password", width: 24 },
  ];

  worksheet.addRows(
    accounts.map((account) => ({
      stt: account.stt,
      fullName: account.fullName,
      className: account.className,
      username: account.username,
      password: account.password,
    })),
  );

  worksheet.getRow(1).font = { bold: true };
  worksheet.views = [{ state: "frozen", ySplit: 1 }];
  worksheet.autoFilter = {
    from: "A1",
    to: "E1",
  };

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `student-accounts-${new Date()
    .toISOString()
    .slice(0, 10)}.xlsx`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

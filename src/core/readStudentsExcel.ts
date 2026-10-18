
import ExcelJS from "exceljs";
import type { Student } from "../types/student";

export interface ExcelImportResult {
  students: Student[];
  errors: string[];
}

function normalizeHeader(value: unknown): string {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "");
}

function getCellText(value: ExcelJS.CellValue): string {
  if (value === null || value === undefined) return "";

  if (typeof value === "object") {
    if ("text" in value && typeof value.text === "string") {
      return value.text.trim();
    }

    if ("richText" in value && Array.isArray(value.richText)) {
      return value.richText.map((part) => part.text).join("").trim();
    }

    if ("result" in value) {
      return String(value.result ?? "").trim();
    }

    return "";
  }

  return String(value).trim();
}

export async function readStudentsExcel(
  file: File,
): Promise<ExcelImportResult> {
  const workbook = new ExcelJS.Workbook();

  try {
    await workbook.xlsx.load(await file.arrayBuffer());
  } catch {
    return {
      students: [],
      errors: ["Không thể đọc file Excel. Hãy kiểm tra file .xlsx."],
    };
  }

  const worksheet = workbook.worksheets[0];

  if (!worksheet) {
    return {
      students: [],
      errors: ["File Excel không có worksheet nào."],
    };
  }

  const headers = new Map<string, number>();

  worksheet.getRow(1).eachCell((cell, column) => {
    const header = normalizeHeader(getCellText(cell.value));

    if (header && !headers.has(header)) {
      headers.set(header, column);
    }
  });

  const sttColumn = headers.get("stt");
  const nameColumn = headers.get("hoten");
  const classColumn = headers.get("lop");

  if (!sttColumn || !nameColumn || !classColumn) {
    return {
      students: [],
      errors: [
        "Hàng đầu tiên phải có đủ các cột: STT, Họ tên, Lớp.",
      ],
    };
  }

  const students: Student[] = [];
  const errors: string[] = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    const sttText = getCellText(row.getCell(sttColumn).value);
    const fullName = getCellText(row.getCell(nameColumn).value);
    const className = getCellText(row.getCell(classColumn).value);

    if (!sttText && !fullName && !className) return;

    const stt = Number(sttText);

    if (!Number.isInteger(stt) || stt < 1) {
      errors.push(`Dòng ${rowNumber}: STT phải là số nguyên dương.`);
      return;
    }

    if (!fullName) {
      errors.push(`Dòng ${rowNumber}: Thiếu họ tên.`);
      return;
    }

    if (!className) {
      errors.push(`Dòng ${rowNumber}: Thiếu lớp.`);
      return;
    }

    students.push({ stt, fullName, className });
  });

  return { students, errors };
}

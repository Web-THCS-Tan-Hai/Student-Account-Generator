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
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
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
  const buffer = await file.arrayBuffer();

  await workbook.xlsx.load(buffer);

  const worksheet = workbook.worksheets[0];

  if (!worksheet) {
    return {
      students: [],
      errors: ["File Excel không có worksheet nào."],
    };
  }

  const headerRow = worksheet.getRow(1);
  const headers = new Map<string, number>();

  headerRow.eachCell((cell, column) => {
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
        "Không tìm thấy đủ cột STT, Họ tên và Lớp ở hàng đầu tiên.",
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
      errors.push(`Dòng ${rowNumber}: STT không hợp lệ.`);
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

import { normalizeClass, normalizeName } from "./normalizeName";
import type {
  GenerationResult,
  Student,
  StudentAccount,
} from "../types/student";

function getNameParts(fullName: string): string[] {
  return normalizeName(fullName).split(" ").filter(Boolean);
}

export function generateAccounts(students: Student[]): GenerationResult {
  const accounts: StudentAccount[] = [];
  const errors: string[] = [];
  const usedUsernames = new Set<string>();

  for (const student of students) {
    const fullName = student.fullName.trim();
    const className = normalizeClass(student.className);
    const nameParts = getNameParts(fullName);

    if (!fullName || nameParts.length === 0) {
      errors.push(`STT ${student.stt}: Họ tên không hợp lệ.`);
      continue;
    }

    if (!className) {
      errors.push(`STT ${student.stt}: Lớp không hợp lệ.`);
      continue;
    }

    if (!Number.isInteger(student.stt) || student.stt < 1) {
      errors.push(`STT ${student.stt}: STT phải là số nguyên dương.`);
      continue;
    }

    const givenName = nameParts[nameParts.length - 1];
    const fullNameSlug = nameParts.join("");
    const candidates = [
      `${givenName}${className}`,
      `${fullNameSlug}${className}`,
      `${fullNameSlug}${student.stt}${className}`,
    ];

    let username = candidates.find(
      (candidate) => !usedUsernames.has(candidate),
    );

    if (!username) {
      let suffix = 2;

      while (usedUsernames.has(`${fullNameSlug}${student.stt}${suffix}${className}`)) {
        suffix++;
      }

      username = `${fullNameSlug}${student.stt}${suffix}${className}`;
    }

    usedUsernames.add(username);

    accounts.push({
      ...student,
      username,
      password: `${givenName}${student.stt}_${className}`,
    });
  }

  return { accounts, errors };
}

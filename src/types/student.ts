export interface Student {
  stt: number;
  fullName: string;
  className: string;
}

export interface StudentAccount extends Student {
  username: string;
  password: string;
}

export interface GenerationResult {
  accounts: StudentAccount[];
  errors: string[];
}

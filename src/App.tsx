import { useRef, useState } from "react";
import { generateAccounts } from "./core/generateAccounts";
import { readStudentsExcel } from "./core/readStudentsExcel";
import type { StudentAccount } from "./types/student";

export default function App() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [accounts, setAccounts] = useState<StudentAccount[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setAccounts([]);
    setErrors([]);
    setFileName(file.name);

    try {
      if (!file.name.toLowerCase().endsWith(".xlsx")) {
        setErrors(["Vui lòng chọn file Excel có định dạng .xlsx."]);
        return;
      }

      const result = await readStudentsExcel(file);
      const generated = generateAccounts(result.students);

      setAccounts(generated.accounts);
      setErrors([...result.errors, ...generated.errors]);
    } catch (error) {
      console.error("Excel import failed:", error);
      setErrors([
        "Không thể đọc file Excel. Hãy kiểm tra file và thử lại.",
      ]);
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  }

  function resetData() {
    setAccounts([]);
    setErrors([]);
    setFileName("");
    setShowPasswords(false);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <main className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">SA</div>
          <div>
            <h1>Student Accounts</h1>
            <p>Account Generator</p>
          </div>
        </div>

        <span className="status">LOCAL MODE</span>
      </header>

      <section className="hero">
        <span className="eyebrow">STUDENT MANAGEMENT TOOL</span>
        <h2>Generate student accounts.</h2>
        <p>
          Import a student spreadsheet to generate usernames and initial
          passwords. Review the results before exporting.
        </p>
      </section>

      <section className="workspace">
        <div className="section-heading">
          <div>
            <h3>Import students</h3>
            <p>Choose an Excel spreadsheet (.xlsx).</p>
          </div>
          <span className="step">STEP 01</span>
        </div>

        <div className="upload-area">
          <div className="upload-icon">↑</div>

          <h3>
            {loading
              ? "Reading spreadsheet..."
              : fileName || "Select a spreadsheet"}
          </h3>

          <p>
            Required columns: STT, Họ tên, Lớp.
          </p>

          <input
            ref={inputRef}
            type="file"
            accept=".xlsx"
            hidden
            onChange={handleFileChange}
          />

          <button
            type="button"
            disabled={loading}
            onClick={() => inputRef.current?.click()}
          >
            {loading ? "Please wait..." : "Import Excel"}
          </button>

          {fileName && !loading && (
            <button type="button" onClick={resetData}>
              Clear data
            </button>
          )}
        </div>

        {errors.length > 0 && (
          <section className="error-panel" aria-live="polite">
            <h3>Import warnings ({errors.length})</h3>
            <ul>
              {errors.map((error, index) => (
                <li key={`${index}-${error}`}>{error}</li>
              ))}
            </ul>
          </section>
        )}

        <div className="table-placeholder">
          <div>
            <h3>Student preview</h3>
            <p>Review generated accounts below.</p>
          </div>
          <span>{accounts.length} students</span>
        </div>

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>HỌ VÀ TÊN</th>
                <th>LỚP</th>
                <th>USERNAME</th>
                <th>PASSWORD</th>
              </tr>
            </thead>

            <tbody>
              {accounts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="empty">
                    {loading
                      ? "Reading your spreadsheet..."
                      : "Import an Excel file to see student accounts."}
                  </td>
                </tr>
              ) : (
                accounts.map((account) => (
                  <tr key={`${account.stt}-${account.username}`}>
                    <td>{account.stt}</td>
                    <td>{account.fullName}</td>
                    <td>{account.className}</td>
                    <td>{account.username}</td>
                    <td>
                      {showPasswords
                        ? account.password
                        : "••••••••"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <footer className="workspace-footer">
          <span>
            {accounts.length > 0
              ? `${accounts.length} accounts generated`
              : "Data is processed in this browser."}
          </span>

          <button
            type="button"
            disabled={accounts.length === 0}
            onClick={() => setShowPasswords((current) => !current)}
          >
            {showPasswords ? "Hide passwords" : "Show passwords"}
          </button>
        </footer>
      </section>

      <p className="disclaimer">
        Initial passwords are sensitive. Store exported files securely.
      </p>
    </main>
  );
}

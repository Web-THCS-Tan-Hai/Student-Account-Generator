export default function App() {
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
          Import a student spreadsheet, generate usernames and initial
          passwords, then export the results to Excel.
        </p>
      </section>

      <section className="workspace">
        <div className="section-heading">
          <div>
            <h3>Import students</h3>
            <p>Start with an Excel spreadsheet (.xlsx).</p>
          </div>
          <span className="step">STEP 01</span>
        </div>

        <div className="upload-area">
          <div className="upload-icon">↑</div>
          <h3>No spreadsheet selected</h3>
          <p>Excel import will be available in the next step.</p>
          <button type="button" disabled>
            Import Excel
          </button>
        </div>

        <div className="table-placeholder">
          <div>
            <h3>Student preview</h3>
            <p>Generated accounts will appear here.</p>
          </div>
          <span>0 students</span>
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
              <tr>
                <td colSpan={5} className="empty">
                  Your student data will appear here.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <footer className="workspace-footer">
          <span>Data stays in your browser.</span>
          <button type="button" disabled>
            Export Excel
          </button>
        </footer>
      </section>

      <p className="disclaimer">
        Initial passwords are sensitive. Store exported files securely.
      </p>
    </main>
  );
}

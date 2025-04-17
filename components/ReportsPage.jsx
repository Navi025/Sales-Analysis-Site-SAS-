import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch saved reports from the backend
    const fetchReports = async () => {
      const response = await fetch('http://localhost:5000/api/reports');
      const data = await response.json();
      setReports(data);
    };

    fetchReports();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 font-poppins text-gray-100">
      <nav className="flex items-center justify-between px-8 h-14 bg-black text-white shadow-md">
        <div className="flex items-center space-x-4 h-full">
          <span className="text-2xl font-bold">Reports</span>
        </div>
        <div className="space-x-6 hidden md:flex">
          <button className="hover:underline" onClick={() => router.push('/')}>Home</button>
          <button className="hover:underline" onClick={() => router.push('/StartAnalysis')}>Start Analysis</button>
          <button className="hover:underline" onClick={() => router.push('/Reports')}>Reports</button>
          <button className="hover:underline" onClick={() => router.push('/Settings')}>Settings</button>
        </div>
      </nav>

      <main className="flex-grow flex flex-col items-center justify-center px-6 py-12">
        <h1 className="text-6xl font-extrabold text-center text-gradient">Saved Reports</h1>
        <div className="max-w-4xl w-full flex flex-col items-center gap-10">
          {reports.length > 0 ? (
            reports.map((report, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6 w-full">
                <h2 className="text-xl font-semibold">{report.title}</h2>
                <p>{report.description}</p>
                <button className="bg-blue-600 text-white py-2 px-4 rounded mt-2">View Report</button>
              </div>
            ))
          ) : (
            <p className="text-gray-300">No reports available.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default ReportsPage;

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from "chart.js";
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  
import { Bar } from "react-chartjs-2";

const data = {
  labels: ["พร้อมใช้งาน", "กำลังใช้งาน", "ชำรุด"],
  datasets: [
    {
      label: "จำนวนอุปกรณ์",
      data: [10, 5, 2],
      backgroundColor: ["#28a745", "#ffc107", "#dc3545"],
    },
  ],
};

<Bar data={data} options={{ maintainAspectRatio: false }} />;

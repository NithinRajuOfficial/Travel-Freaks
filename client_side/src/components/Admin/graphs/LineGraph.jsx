import { useEffect, useState } from "react";
import { Bar,Line } from "@reactchartjs/react-chart.js";
import { Typography } from "@material-tailwind/react";
import { api } from "../../../api/api";

const LineGraph = () => {
  const [dailyGraphData, setDailyGraphData] = useState({});
  const [dailyUserAndPostData, setDailyUserAndPostData] = useState({});
  const [totalGraphData, setTotalGraphData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalyticsData() {
      try {
        const response = await api.get("admin/analyticsData");
        console.log(response, "ress");

        if (response.data && response.data.analyticsData) {
          const analyticsData = response.data.analyticsData;
          console.log(analyticsData.totalLikesReceived,"]][[[");
          const options = { year: "numeric", month: "numeric", day: "numeric" };
          const formattedDate = new Date(analyticsData.date).toLocaleDateString(
            undefined,
            options
          );

          const DailyUserAndPostData = {
            labels: [formattedDate],
            datasets: [
          
              {
                label: "Posts Created",
                data: [analyticsData.postsCreated], // Wrap the value in an array
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 2,
                fill: true,
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                pointRadius: 5,
                pointBackgroundColor: "rgba(255, 99, 132, 1)",
              },
              {
                label: "Daily Likes Count for todays posts",
                data: [analyticsData.likesReceivedForPostCreatedToday],
                borderColor: "rgba(148, 0, 211, 1)",
                borderWidth: 2,
                fill: true,
                backgroundColor: "rgba(148, 0, 211, 0.2)",
                pointRadius: 5,
                pointBackgroundColor: "rgba(148, 0, 211, 1)",
              },
              {
                label: "Daily Comment Count for todays posts",
                data: [analyticsData.commentsReceivedForPostCreatedToday],
                borderColor: "rgba(0, 128, 0, 1)",
                borderWidth: 2,
                fill: true,
                backgroundColor: "rgba(0, 128, 0, 0.2)",
                pointRadius: 5,
                pointBackgroundColor: "rgba(0, 128, 0, 1)",
              },
            ],
          };

          const DailyTotalLikesAndcommentsCountData = {
            labels: [formattedDate], // Use the date as a label
            datasets: [
              {
                label: "Daily Active Users",
                data: [analyticsData.dailyActiveUsers], // Wrap the value in an array
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 2,
                fill: true,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                pointRadius: 5,
                pointBackgroundColor: "rgba(75, 192, 192, 1)",
              },
              {
                label: "Daily Likes Count",
                data: [analyticsData.totalLikesReceivedToday],
                borderColor: "rgba(148, 0, 211, 1)",
                borderWidth: 2,
                fill: true,
                backgroundColor: "rgba(148, 0, 211, 0.2)",
                pointRadius: 5,
                pointBackgroundColor: "rgba(148, 0, 211, 1)",
              },
              {
                label: "Daily Comment Count",
                data: [analyticsData.totalCommentsReceivedToday],
                borderColor: "rgba(0, 128, 0, 1)",
                borderWidth: 2,
                fill: true,
                backgroundColor: "rgba(0, 128, 0, 0.2)",
                pointRadius: 5,
                pointBackgroundColor: "rgba(0, 128, 0, 1)",
              },
            ],
          };

          const TotalDataCount = {
            labels: [formattedDate],
            datasets: [
              {
                label: "Total Like Count",
                data: [analyticsData.totalLikesReceived],
                borderColor: "rgba(148, 0, 211, 1)",
                borderWidth: 2,
                fill: true,
                backgroundColor: "rgba(148, 0, 211, 0.2)",
                pointRadius: 5,
                pointBackgroundColor: "rgba(148, 0, 211, 1)",
              },
              {
                label: "Total Comment Count",
                data: [analyticsData.totalCommentsReceived],
                borderColor: "rgba(0, 128, 0, 1)",
                borderWidth: 2,
                fill: true,
                backgroundColor: "rgba(0, 128, 0, 0.2)",
                pointRadius: 5,
                pointBackgroundColor: "rgba(0, 128, 0, 1)",
              },
            ],
          };

          setDailyGraphData(DailyTotalLikesAndcommentsCountData);
          setDailyUserAndPostData(DailyUserAndPostData);
          setTotalGraphData(TotalDataCount);
        } else {
          console.error("Invalid or empty response data.");
        }

        setLoading(false);
      } catch (error) {
        console.error("Unable to get the analytics data:", error);
        setLoading(false);
      }
    }
    fetchAnalyticsData();
  }, []);

  const chartOptions = {
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
        beginAtZero: true,
        grid: {
          display: true,
        },
      },
      y: {
        title: {
          display: true,
          text: "Data Values",
        },
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div>
    <div className="flex justify-center mb-20 mt-10">
        <Typography variant="h4">Analytics Data Chart</Typography>
    </div>
    {loading ? (
      <p>Loading...</p>
    ) : (
      <div className="flex flex-wrap">
        {/* Upper two charts - displayed inline */}
        <div className="w-2/4 h-1/2 pr-2 mb-16">
          <Line data={dailyGraphData} options={chartOptions} />
        </div>
        <div className="w-2/4  h-1/2 pl-2 mb-16">
        <Bar data={dailyUserAndPostData} options={chartOptions} />
        </div>
        {/* New chart displayed under the upper two charts */}
        <div className="w-2/4 mt-4 ml-40">
        <Line data={totalGraphData} options={chartOptions} />
        </div>
      </div>
    )}
  </div>
  
  );
};

export default LineGraph;

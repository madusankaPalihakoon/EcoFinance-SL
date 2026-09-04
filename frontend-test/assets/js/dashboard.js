import api from "./api.js";
import auth from "./auth.js";
import { initLayout } from "./layout.js";


let carbonChart = null;
let esgChart = null;


// INITIALIZE LAYOUT

initLayout({
    title: "Dashboard"
});


// GET CURRENT USER

const user = auth.getUser() || {};


// Display username

const userName =
    document.getElementById("userName");

if (userName) {

    userName.textContent =
        user.full_name || "User";

}


// LOAD DASHBOARD

loadDashboard();


async function loadDashboard() {

    try {

        console.log("Loading dashboard...");


        const response =
            await api.get("/dashboard/");


        console.log(
            "Dashboard API response:",
            response
        );


        if (!response || !response.success) {

            throw new Error(
                response?.message ||
                "Unable to load dashboard data."
            );

        }


        const data =
            response.data || {};


        console.log(
            "Dashboard data:",
            data
        );

        // COMPANY

        const companyName =
            document.getElementById(
                "companyName"
            );


        if (companyName) {

            companyName.textContent =
                data.company_name || "-";

        }


        // ESG SCORE

        const esgScoreElement =
            document.getElementById(
                "esgScore"
            );


        let esgScore =
            Number(
                data.average_esg_score
            );


        if (
            !Number.isFinite(esgScore)
        ) {

            esgScore = 0;

        }


        if (esgScoreElement) {

            esgScoreElement.textContent =
                esgScore.toFixed(1);

        }


        // CARBON EMISSION

        const carbonElement =
            document.getElementById(
                "carbonEmission"
            );


        let totalEmission =
            Number(
                data.total_emission
            );


        if (
            !Number.isFinite(totalEmission)
        ) {

            totalEmission = 0;

        }


        if (carbonElement) {

            carbonElement.textContent =
                totalEmission.toFixed(2)
                + " tCO₂e";

        }


        // REPORT COUNT

        const reportElement =
            document.getElementById(
                "reportCount"
            );


        let totalReports =
            Number(
                data.total_reports
            );


        if (
            !Number.isFinite(totalReports)
        ) {

            totalReports = 0;

        }


        if (reportElement) {

            reportElement.textContent =
                totalReports;

        }


        // LOAD CHARTS

        loadCharts(data);

    }

    catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );

    }

}


// LOAD CHARTS

function loadCharts(data) {


    const carbonCanvas =
        document.getElementById(
            "carbonChart"
        );


    const esgCanvas =
        document.getElementById(
            "esgChart"
        );


    if (
        !carbonCanvas ||
        !esgCanvas
    ) {

        console.error(
            "Chart canvas not found."
        );

        return;

    }


    // DESTROY OLD CHARTS

    if (carbonChart) {

        carbonChart.destroy();

        carbonChart = null;

    }


    if (esgChart) {

        esgChart.destroy();

        esgChart = null;

    }


    // CARBON DATA

    let carbonLabels = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun"
    ];


    let carbonValues = [
        0,
        0,
        0,
        0,
        0,
        0
    ];



    if (
        Array.isArray(
            data.carbon_trend
        )
    ) {

        carbonLabels =
            data.carbon_trend.map(
                item =>
                    item.month
            );


        carbonValues =
            data.carbon_trend.map(
                item =>
                    Number(
                        item.emission
                    ) || 0
            );

    }


    

    else {

        const total =
            Number(
                data.total_emission
            ) || 0;


        carbonValues = [
            0,
            0,
            0,
            0,
            0,
            total
        ];

    }


    // CARBON CHART

    carbonChart =
        new Chart(
            carbonCanvas,
            {

                type: "line",


                data: {

                    labels:
                        carbonLabels,


                    datasets: [

                        {

                            label:
                                "Carbon Emission (tCO₂e)",


                            data:
                                carbonValues,


                            borderColor:
                                "#ef4444",


                            backgroundColor:
                                "rgba(239, 68, 68, 0.12)",


                            fill: true,


                            tension: 0.4,


                            borderWidth: 3,


                            pointRadius: 4,


                            pointHoverRadius: 6

                        }

                    ]

                },


                options: {

                    responsive: true,


                    maintainAspectRatio:
                        false,


                    interaction: {

                        intersect: false,

                        mode: "index"

                    },


                    plugins: {

                        legend: {

                            display: true,

                            position: "top"

                        }

                    },


                    scales: {

                        y: {

                            beginAtZero: true,


                            title: {

                                display: true,

                                text:
                                    "Carbon Emission (tCO₂e)"

                            }

                        },


                        x: {

                            title: {

                                display: true,

                                text:
                                    "Month"

                            }

                        }

                    }

                }

            }
        );

    // ESG SCORE

    let esg =
        Number(
            data.average_esg_score
        );


    if (
        !Number.isFinite(esg)
    ) {

        esg = 0;

    }


    /*
     * Make sure score is between 0 and 100.
     */

    esg =
        Math.max(
            0,
            Math.min(
                100,
                esg
            )
        );


    const remaining =
        100 - esg;


    // ESG CHART

    esgChart =
        new Chart(
            esgCanvas,
            {

                type: "doughnut",


                data: {

                    labels: [
                        "ESG Score",
                        "Remaining"
                    ],


                    datasets: [

                        {

                            data: [
                                esg,
                                remaining
                            ],


                            backgroundColor: [
                                "#10b981",
                                "#e5e7eb"
                            ],


                            borderWidth: 0

                        }

                    ]

                },


                options: {

                    responsive: true,


                    maintainAspectRatio:
                        false,


                    cutout: "72%",


                    plugins: {

                        legend: {

                            position:
                                "bottom"

                        }

                    }

                }

            }
        );

}
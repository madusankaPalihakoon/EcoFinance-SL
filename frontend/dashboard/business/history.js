import api from "../../assets/js/api.js";
import { initLayout } from "../../assets/js/layout.js";

/* =========================================
   INITIALIZE LAYOUT
========================================= */

initLayout({
    title: "Business History"
});

/* =========================================
   LOAD HISTORY
========================================= */

loadHistory();

/* =========================================
   LOAD RECORDS
========================================= */

async function loadHistory() {

    try {

        const response = await api.get("/business/");

        if (!response.success) {
            throw new Error(
                response.message || "Unable to load records."
            );
        }

        renderTable(response.data || []);

    } catch (error) {

        console.error(
            "History loading error:",
            error
        );

        alert(
            error.message ||
            "Unable to load records."
        );
    }
}

/* =========================================
   RENDER TABLE
========================================= */

function renderTable(records) {

    const table =
        document.getElementById("historyTable");

    const emptyHistory =
        document.getElementById("emptyHistory");

    if (!table || !emptyHistory) {
        console.error(
            "History table elements not found."
        );
        return;
    }

    table.innerHTML = "";

    if (!records.length) {

        emptyHistory.classList.remove("hidden");

        return;
    }

    emptyHistory.classList.add("hidden");

    records.forEach((record) => {

        const totalCarbon =
            Number(record.total_carbon || 0);

        table.innerHTML += `

            <tr class="
                border-b
                border-slate-100
                hover:bg-slate-50
                transition
            ">

                <td class="history-td">

                    <div class="flex items-center gap-2">

                        <i class="
                            fa-solid
                            fa-calendar
                            text-slate-400
                        "></i>

                        ${record.reporting_year ?? "-"}

                    </div>

                </td>

                <td class="history-td">
                    ${monthName(record.reporting_month)}
                </td>

                <td class="
                    history-td
                    text-right
                ">
                    ${Number(
                        record.grid_electricity_kwh || 0
                    ).toFixed(2)}
                </td>

                <td class="
                    history-td
                    text-right
                ">
                    ${Number(
                        record.diesel_liters || 0
                    ).toFixed(2)}
                </td>

                <td class="
                    history-td
                    text-right
                    font-semibold
                    text-emerald-600
                ">

                    ${totalCarbon.toFixed(2)}

                    <span class="
                        text-xs
                        text-slate-400
                        font-normal
                    ">
                        tCO₂e
                    </span>

                </td>

                <td class="
                    history-td
                    text-center
                ">

                    <button
                        type="button"
                        class="view-button"
                        onclick="viewRecord(${record.id})"
                    >

                        <i class="
                            fa-solid
                            fa-eye
                            mr-1
                        "></i>

                        View

                    </button>

                </td>

            </tr>

        `;
    });
}

/* =========================================
   MONTH NAME
========================================= */

function monthName(month) {

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    return months[
        Number(month) - 1
    ] || "-";
}

/* =========================================
   VIEW RECORD
========================================= */

window.viewRecord = function (id) {

    alert(
        "Business record details will be displayed here."
    );

};
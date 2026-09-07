import api from "../../assets/js/api.js";
import { initLayout } from "../../assets/js/layout.js";
import { CONFIG } from "../../assets/js/config.js";

initLayout({
  title: "Report History"
});


const table =
  document.getElementById("reportTable");

const modal =
  document.getElementById("reportModal");

const reportContent =
  document.getElementById("reportContent");

const closeModalButton =
  document.getElementById("closeModal");


if (closeModalButton) {
  closeModalButton.addEventListener(
    "click",
    closeModal
  );
}


loadReports();


async function loadReports() {

  try {

    const response =
      await api.get("/reports/");


    if (!response.success) {

      throw new Error(
        response.message ||
        "Unable to load reports."
      );

    }


    renderTable(
      response.data || []
    );


  } catch (error) {

    console.error(
      "Report history error:",
      error
    );


    table.innerHTML = `

      <tr>

        <td
          colspan="5"
          class="text-center py-10 text-slate-500"
        >

          <i
            class="fa-solid fa-circle-exclamation text-3xl mb-3"
          ></i>

          <p>
            Unable to load reports.
          </p>

        </td>

      </tr>

    `;

  }

}


function renderTable(reports) {

  table.innerHTML = "";


  if (!reports.length) {

    table.innerHTML = `

      <tr>

        <td
          colspan="5"
          class="text-center py-12"
        >

          <div class="empty-state">

            <i class="fa-solid fa-file-circle-xmark"></i>

            <p>
              No reports generated yet.
            </p>

            <a
              href="generate.html"
              class="text-emerald-600 font-semibold hover:underline"
            >
              Generate your first report
            </a>

          </div>

        </td>

      </tr>

    `;

    return;
  }


  reports.forEach((report) => {

    const status =
      report.status || "Generated";


    table.innerHTML += `

      <tr>

        <td>
          ${formatDate(report.generated_at)}
        </td>


        <td>

          <div class="flex items-center gap-3">

            <div class="table-icon">
              <i class="fa-solid fa-file-lines"></i>
            </div>

            <span class="font-medium text-slate-700">
              ${report.title || "Sustainability Report"}
            </span>

          </div>

        </td>


        <td>
          ${report.type || "Sustainability"}
        </td>


        <td>

          <span class="status status-generated">

            <i class="fa-solid fa-circle-check"></i>

            ${status}

          </span>

        </td>


        <td class="text-center">

          <button
            class="action-btn view-btn"
            onclick="viewReport(${report.id})"
          >

            <i class="fa-solid fa-eye"></i>
            View

          </button>


          <button
            class="action-btn download-btn"
            onclick="downloadReport(${report.id})"
          >

            <i class="fa-solid fa-download"></i>
            Download

          </button>

        </td>

      </tr>

    `;

  });

}


function formatDate(date) {

  if (!date) {
    return "-";
  }

  const parsedDate =
    new Date(date);


  if (isNaN(parsedDate.getTime())) {
    return "-";
  }


  return parsedDate.toLocaleString();

}


window.viewReport = async function (id) {

  try {

    const response =
      await api.get(`/reports/${id}`);


    if (!response.success) {

      throw new Error(
        response.message ||
        "Unable to load report."
      );

    }


    reportContent.textContent =
      response.data.content || "";


    modal.classList.remove("hidden");

    modal.classList.add("flex");


  } catch (error) {

    console.error(
      "View report error:",
      error
    );

    alert(
      error.message ||
      "Unable to load report."
    );

  }

};


window.downloadReport = async function (id) {

  try {

    const response = await fetch(
      `${CONFIG.API_URL}/reports/download/${id}`,
      {
        headers: {
          Authorization:
            `Bearer ${localStorage.getItem(CONFIG.TOKEN_KEY)}`
        }
      }
    );


    if (!response.ok) {

      throw new Error(
        "Download failed."
      );

    }


    const blob =
      await response.blob();


    const url =
      URL.createObjectURL(blob);


    const a =
      document.createElement("a");


    a.href = url;

    a.download =
      `report-${id}.pdf`;


    document.body.appendChild(a);

    a.click();

    a.remove();


    URL.revokeObjectURL(url);


  } catch (error) {

    console.error(
      "Download report error:",
      error
    );

    alert(
      error.message ||
      "Download failed."
    );

  }

};


function closeModal() {

  modal.classList.remove("flex");

  modal.classList.add("hidden");

}
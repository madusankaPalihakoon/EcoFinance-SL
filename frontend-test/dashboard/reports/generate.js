import api from "../../assets/js/api.js";
import { initLayout } from "../../assets/js/layout.js";

initLayout({
  title: "Generate Report"
});

const generateBtn = document.getElementById("generateBtn");

if (generateBtn) {
  generateBtn.addEventListener("click", generateReport);
}

loadSummary();


async function loadSummary() {

  try {

    const [company, business, esg] = await Promise.all([
      api.get("/company/"),
      api.get("/business/"),
      api.get("/esg/latest")
    ]);


    const summary = document.getElementById("summary");

    if (!summary) return;


    const latestBusiness =
      business.data && business.data.length > 0
        ? business.data[0]
        : null;


    const score = esg.data || {};


    const companyData =
      company.company || {};


    summary.innerHTML = `

      <!-- Company Card -->
      <div class="summary-card">

        <div class="summary-icon company-icon">
          <i class="fa-solid fa-building"></i>
        </div>

        <div class="summary-content">

          <p class="summary-label">
            Company
          </p>

          <h3 class="summary-title">
            ${companyData.company_name || "-"}
          </h3>

          <p class="summary-subtitle">
            ${companyData.business_sector || "-"}
          </p>

        </div>

      </div>


      <!-- Reporting Period Card -->
      <div class="summary-card">

        <div class="summary-icon business-icon">
          <i class="fa-solid fa-calendar-days"></i>
        </div>

        <div class="summary-content">

          <p class="summary-label">
            Reporting Period
          </p>

          <h3 class="summary-title">
            ${
              latestBusiness
                ? `${latestBusiness.reporting_month}/${latestBusiness.reporting_year}`
                : "-"
            }
          </h3>

          <p class="summary-subtitle">
            ${
              latestBusiness
                ? `Carbon: ${latestBusiness.total_carbon ?? 0}`
                : "No business data"
            }
          </p>

        </div>

      </div>


      <!-- ESG Score Card -->
      <div class="summary-card">

        <div class="summary-icon esg-icon">
          <i class="fa-solid fa-seedling"></i>
        </div>

        <div class="summary-content">

          <p class="summary-label">
            ESG Score
          </p>

          <h3 class="summary-score">
            ${score.overall_score ?? 0}
          </h3>

          <p class="summary-subtitle">
            ${score.overall_status || "-"}
          </p>

        </div>

      </div>

    `;

  } catch (error) {

    console.error("Summary loading error:", error);

    const summary = document.getElementById("summary");

    if (summary) {

      summary.innerHTML = `
        <div class="card md:col-span-2 lg:col-span-3">
          <div class="text-center py-8 text-slate-500">
            <i class="fa-solid fa-circle-exclamation text-3xl mb-3"></i>
            <p>Unable to load report summary.</p>
          </div>
        </div>
      `;

    }

  }

}


async function generateReport() {

  try {

    generateBtn.disabled = true;

    generateBtn.innerHTML = `
      <i class="fa-solid fa-spinner fa-spin"></i>
      Generating...
    `;


    const response =
      await api.post("/reports/", {});


    if (!response.success) {

      throw new Error(
        response.message || "Unable to generate report."
      );

    }


    alert("Report Generated Successfully");


    window.location.href = "history.html";


  } catch (error) {

    console.error("Report generation error:", error);

    alert(
      error.message || "Unable to generate report."
    );


  } finally {

    generateBtn.disabled = false;

    generateBtn.innerHTML = `
      <i class="fa-solid fa-file-export"></i>
      Generate Report
    `;

  }

}
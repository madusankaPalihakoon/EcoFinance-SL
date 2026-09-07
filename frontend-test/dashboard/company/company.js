import api from "../../assets/js/api.js";
import { initLayout } from "../../assets/js/layout.js";


/* =========================================
   INITIALIZE LAYOUT
========================================= */

initLayout({
    title: "Company"
});


/* =========================================
   LOAD COMPANY
========================================= */

loadCompany();


/* =========================================
   FORM SUBMIT
========================================= */

document
    .getElementById("companyForm")
    .addEventListener("submit", saveCompany);


/* =========================================
   LOAD COMPANY DATA
========================================= */

async function loadCompany() {

    try {

        const response = await api.get("/company/");

        if (!response.success) {
            throw new Error("Unable to load company.");
        }

        const company = response.company;

        if (!company) {
            console.warn("No company data found.");
            return;
        }


        // =========================================
        // COMPANY FORM
        // =========================================

        document.getElementById("company_name").value =
            company.company_name || "";

        document.getElementById("registration_no").value =
            company.registration_no || "";

        document.getElementById("business_sector").value =
            company.business_sector || "";

        document.getElementById("website").value =
            company.website || "";

        document.getElementById("contact_no").value =
            company.contact_no || "";

        document.getElementById("province").value =
            company.province || "";

        document.getElementById("district").value =
            company.district || "";

        document.getElementById("address").value =
            company.address || "";


        // =========================================
        // HEADER COMPANY NAME
        // =========================================

        const headerCompanyName =
            document.getElementById("headerCompanyName");

        if (headerCompanyName) {

            headerCompanyName.textContent =
                company.company_name || "Company Name";

        }


    } catch (error) {

        console.error(
            "Company loading error:",
            error
        );

    }

}


/* =========================================
   SAVE COMPANY
========================================= */

async function saveCompany(e) {

    e.preventDefault();


    try {

        const body = {

            company_name:
                document.getElementById("company_name").value.trim(),

            registration_no:
                document.getElementById("registration_no").value.trim(),

            business_sector:
                document.getElementById("business_sector").value.trim(),

            website:
                document.getElementById("website").value.trim(),

            contact_no:
                document.getElementById("contact_no").value.trim(),

            province:
                document.getElementById("province").value,

            district:
                document.getElementById("district").value,

            address:
                document.getElementById("address").value.trim()

        };


        const response =
            await api.put(
                "/company/",
                body
            );


        if (!response.success) {

            throw new Error(
                response.message ||
                "Unable to save company."
            );

        }


        alert(
            response.message ||
            "Company information saved successfully."
        );


    } catch (error) {

        console.error(
            "Save company error:",
            error
        );


        alert(
            error.message ||
            "Unable to save company."
        );

    }

}


/* =========================================
   CANCEL
========================================= */

document
    .getElementById("cancelBtn")
    .addEventListener("click", () => {

        loadCompany();

    });
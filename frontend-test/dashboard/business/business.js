import api from "../../assets/js/api.js";
import { initLayout } from "../../assets/js/layout.js";

initLayout({
    title: "Business Data"
});


/* =========================================
   SAVE BUTTON
========================================= */

const saveBtn =
    document.getElementById("saveBtn");


saveBtn.addEventListener(
    "click",
    saveBusinessData
);


/* =========================================
   DEFAULT VALUES
========================================= */

setDefaultValues();


function setDefaultValues() {

    const today = new Date();


    document.getElementById(
        "reporting_year"
    ).value = today.getFullYear();


    document.getElementById(
        "reporting_month"
    ).value = today.getMonth() + 1;

}


/* =========================================
   GET FORM DATA
========================================= */

function getFormData() {

    return {

        reporting_year:
            Number(
                document.getElementById(
                    "reporting_year"
                ).value
            ),


        reporting_month:
            Number(
                document.getElementById(
                    "reporting_month"
                ).value
            ),


        grid_electricity_kwh:
            Number(
                document.getElementById(
                    "grid_electricity_kwh"
                ).value || 0
            ),


        renewable_electricity_kwh:
            Number(
                document.getElementById(
                    "renewable_electricity_kwh"
                ).value || 0
            ),


        diesel_liters:
            Number(
                document.getElementById(
                    "diesel_liters"
                ).value || 0
            ),


        petrol_liters:
            Number(
                document.getElementById(
                    "petrol_liters"
                ).value || 0
            ),


        lpg_kg:
            Number(
                document.getElementById(
                    "lpg_kg"
                ).value || 0
            ),


        natural_gas_m3:
            Number(
                document.getElementById(
                    "natural_gas_m3"
                ).value || 0
            ),


        business_travel_km:
            Number(
                document.getElementById(
                    "business_travel_km"
                ).value || 0
            ),


        employee_travel_km:
            Number(
                document.getElementById(
                    "employee_travel_km"
                ).value || 0
            ),


        freight_transport_km:
            Number(
                document.getElementById(
                    "freight_transport_km"
                ).value || 0
            ),


        general_waste_kg:
            Number(
                document.getElementById(
                    "general_waste_kg"
                ).value || 0
            ),


        recycled_waste_kg:
            Number(
                document.getElementById(
                    "recycled_waste_kg"
                ).value || 0
            ),


        hazardous_waste_kg:
            Number(
                document.getElementById(
                    "hazardous_waste_kg"
                ).value || 0
            )

    };

}


/* =========================================
   VALIDATION
========================================= */

function validate(data) {

    if (!data.reporting_year) {

        alert(
            "Reporting year is required."
        );

        return false;

    }


    if (!data.reporting_month) {

        alert(
            "Reporting month is required."
        );

        return false;

    }


    return true;

}


/* =========================================
   SAVE BUSINESS DATA
========================================= */

async function saveBusinessData() {

    const data =
        getFormData();


    if (!validate(data)) {
        return;
    }


    try {

        saveBtn.disabled = true;


        saveBtn.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin mr-2"></i>
            Saving...
        `;


        const response =
            await api.post(
                "/business/",
                data
            );


        if (!response.success) {

            throw new Error(
                response.message ||
                "Unable to save business data."
            );

        }


        alert(
            "Business data saved successfully."
        );


        updateSummary(
            response.data
        );


    } catch (error) {

        console.error(
            "Business data error:",
            error
        );


        alert(
            error.message ||
            "Unable to save business data."
        );


    } finally {

        saveBtn.disabled = false;


        saveBtn.innerHTML = `
            <i class="fa-solid fa-floppy-disk mr-2"></i>
            Save Business Data
        `;

    }

}


/* =========================================
   UPDATE CARBON SUMMARY
========================================= */

function updateSummary(data) {

    const totalCarbon =
        Number(
            data?.total_carbon || 0
        );


    document.getElementById(
        "totalCarbon"
    ).textContent =
        totalCarbon.toFixed(2);

}
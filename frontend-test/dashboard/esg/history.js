import api from "../../assets/js/api.js";
import { initLayout } from "../../assets/js/layout.js";


// =========================================
// INITIALIZE LAYOUT
// =========================================

initLayout({
    title: "ESG History"
});


// =========================================
// STORE LOADED RECORDS
// =========================================

let historyRecords = [];


// =========================================
// LOAD HISTORY
// =========================================

loadHistory();


async function loadHistory() {

    const table = document.getElementById("historyTable");

    if (!table) {
        console.error("historyTable element not found.");
        return;
    }

    try {

        console.log("Loading ESG history...");

        /*
         * Backend route:
         *
         * GET /api/esg/
         *
         * NOT /api/esg/history
         */

        const response = await api.get("/esg/");

        console.log("ESG history response:", response);


        if (!response || !response.success) {

            throw new Error(
                response?.message ||
                "Unable to load ESG history."
            );

        }


        // Save records for the View button
        historyRecords = Array.isArray(response.data)
            ? response.data
            : [];


        renderTable(historyRecords);

    }
    catch (error) {

        console.error(
            "ESG history error:",
            error
        );


        table.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    class="text-center p-8 text-red-500"
                >
                    <i
                        class="fa-solid fa-circle-exclamation mr-2"
                    ></i>

                    ${escapeHtml(
                        error.message ||
                        "Unable to load ESG history."
                    )}
                </td>
            </tr>
        `;

    }

}


// =========================================
// RENDER HISTORY TABLE
// =========================================

function renderTable(records) {

    const table =
        document.getElementById("historyTable");


    if (!table) {
        return;
    }


    table.innerHTML = "";


    // No records
    if (!records.length) {

        table.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    class="text-center p-10 text-gray-500"
                >

                    <i
                        class="
                            fa-solid
                            fa-folder-open
                            text-3xl
                            mb-3
                            block
                        "
                    ></i>

                    No ESG assessments found.

                </td>
            </tr>
        `;

        return;

    }


    records.forEach((record, index) => {

        const environmentalScore =
            Number(record.environmental_score || 0)
                .toFixed(1);

        const socialScore =
            Number(record.social_score || 0)
                .toFixed(1);

        const governanceScore =
            Number(record.governance_score || 0)
                .toFixed(1);

        const overallScore =
            Number(record.overall_score || 0)
                .toFixed(2);


        table.innerHTML += `
            <tr
                class="
                    border-b
                    hover:bg-gray-50
                    transition
                "
            >

                <!-- DATE -->

                <td class="p-4">

                    ${formatDate(
                        record.created_at
                    )}

                </td>


                <!-- ENVIRONMENTAL -->

                <td
                    class="
                        text-center
                        p-4
                    "
                >

                    ${environmentalScore}

                </td>


                <!-- SOCIAL -->

                <td
                    class="
                        text-center
                        p-4
                    "
                >

                    ${socialScore}

                </td>


                <!-- GOVERNANCE -->

                <td
                    class="
                        text-center
                        p-4
                    "
                >

                    ${governanceScore}

                </td>


                <!-- OVERALL -->

                <td
                    class="
                        text-center
                        p-4
                        font-bold
                    "
                >

                    ${overallScore}

                </td>


                <!-- STATUS -->

                <td
                    class="
                        text-center
                        p-4
                    "
                >

                    ${badge(
                        record.overall_status
                    )}

                </td>


                <!-- ACTION -->

                <td
                    class="
                        text-center
                        p-4
                    "
                >

                    <button
                        type="button"
                        class="
                            text-blue-600
                            hover:text-blue-800
                            font-medium
                            flex
                            items-center
                            gap-1
                            mx-auto
                        "
                        onclick="viewAssessment(${index})"
                    >

                        <i
                            class="
                                fa-solid
                                fa-eye
                            "
                        ></i>

                        View

                    </button>

                </td>

            </tr>
        `;

    });

}


// =========================================
// FORMAT DATE
// =========================================

function formatDate(date) {

    if (!date) {
        return "-";
    }


    const parsedDate = new Date(date);


    if (Number.isNaN(parsedDate.getTime())) {
        return "-";
    }


    return parsedDate.toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// =========================================
// STATUS BADGE
// =========================================

function badge(status) {

    const safeStatus =
        status || "Needs Improvement";


    if (safeStatus === "Excellent") {

        return `
            <span
                class="
                    inline-flex
                    items-center
                    gap-1
                    bg-green-100
                    text-green-700
                    px-3
                    py-1
                    rounded-full
                    text-sm
                    font-medium
                "
            >

                <i
                    class="
                        fa-solid
                        fa-circle-check
                    "
                ></i>

                ${escapeHtml(safeStatus)}

            </span>
        `;

    }


    if (safeStatus === "Good") {

        return `
            <span
                class="
                    inline-flex
                    items-center
                    gap-1
                    bg-blue-100
                    text-blue-700
                    px-3
                    py-1
                    rounded-full
                    text-sm
                    font-medium
                "
            >

                <i
                    class="
                        fa-solid
                        fa-thumbs-up
                    "
                ></i>

                ${escapeHtml(safeStatus)}

            </span>
        `;

    }


    return `
        <span
            class="
                inline-flex
                items-center
                gap-1
                bg-yellow-100
                text-yellow-700
                px-3
                py-1
                rounded-full
                text-sm
                font-medium
            "
        >

            <i
                class="
                    fa-solid
                    fa-triangle-exclamation
                "
            ></i>

            ${escapeHtml(safeStatus)}

        </span>
    `;

}


// =========================================
// VIEW ASSESSMENT
// =========================================

/*
 * IMPORTANT:
 *
 * We DO NOT call:
 *
 * /esg/${id}
 *
 * because your current Flask backend does not
 * have that GET route.
 *
 * Instead, we find the record from the history
 * that has already been loaded.
 */

window.viewAssessment = function(index) {

    const record =
        historyRecords[index];


    if (!record) {

        alert(
            "Unable to find this ESG assessment."
        );

        return;

    }


    console.log(
        "Viewing ESG assessment:",
        record
    );


    showModal(record);

};


// =========================================
// SHOW MODAL
// =========================================

function showModal(data) {

    const modalBody =
        document.getElementById("modalBody");


    if (!modalBody) {
        return;
    }


    modalBody.innerHTML = `

        <!-- SCORE CARDS -->

        <div
            class="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-5
            "
        >

            <!-- ENVIRONMENTAL -->

            <div
                class="
                    bg-green-50
                    rounded-xl
                    p-5
                "
            >

                <div
                    class="
                        flex
                        items-center
                        gap-2
                        mb-3
                    "
                >

                    <i
                        class="
                            fa-solid
                            fa-leaf
                            text-green-600
                        "
                    ></i>

                    <h3
                        class="font-semibold"
                    >
                        Environmental
                    </h3>

                </div>


                <p>

                    Score:

                    <strong>
                        ${formatScore(
                            data.environmental_score,
                            1
                        )}
                    </strong>

                </p>


                <p class="mt-1">

                    Status:

                    ${escapeHtml(
                        data.environmental_status ||
                        "-"
                    )}

                </p>

            </div>


            <!-- SOCIAL -->

            <div
                class="
                    bg-blue-50
                    rounded-xl
                    p-5
                "
            >

                <div
                    class="
                        flex
                        items-center
                        gap-2
                        mb-3
                    "
                >

                    <i
                        class="
                            fa-solid
                            fa-people-group
                            text-blue-600
                        "
                    ></i>

                    <h3
                        class="font-semibold"
                    >
                        Social
                    </h3>

                </div>


                <p>

                    Score:

                    <strong>
                        ${formatScore(
                            data.social_score,
                            1
                        )}
                    </strong>

                </p>


                <p class="mt-1">

                    Status:

                    ${escapeHtml(
                        data.social_status ||
                        "-"
                    )}

                </p>

            </div>


            <!-- GOVERNANCE -->

            <div
                class="
                    bg-purple-50
                    rounded-xl
                    p-5
                "
            >

                <div
                    class="
                        flex
                        items-center
                        gap-2
                        mb-3
                    "
                >

                    <i
                        class="
                            fa-solid
                            fa-scale-balanced
                            text-purple-600
                        "
                    ></i>

                    <h3
                        class="font-semibold"
                    >
                        Governance
                    </h3>

                </div>


                <p>

                    Score:

                    <strong>
                        ${formatScore(
                            data.governance_score,
                            1
                        )}
                    </strong>

                </p>


                <p class="mt-1">

                    Status:

                    ${escapeHtml(
                        data.governance_status ||
                        "-"
                    )}

                </p>

            </div>


            <!-- OVERALL -->

            <div
                class="
                    bg-emerald-50
                    rounded-xl
                    p-5
                "
            >

                <div
                    class="
                        flex
                        items-center
                        gap-2
                        mb-3
                    "
                >

                    <i
                        class="
                            fa-solid
                            fa-chart-pie
                            text-emerald-600
                        "
                    ></i>

                    <h3
                        class="font-semibold"
                    >
                        Overall
                    </h3>

                </div>


                <p>

                    Score:

                    <strong>
                        ${formatScore(
                            data.overall_score,
                            2
                        )}
                    </strong>

                </p>


                <p class="mt-1">

                    Status:

                    ${escapeHtml(
                        data.overall_status ||
                        "-"
                    )}

                </p>

            </div>

        </div>


        <!-- DATE -->

        <div
            class="
                mt-6
                bg-slate-50
                rounded-xl
                p-4
            "
        >

            <div
                class="
                    flex
                    items-center
                    gap-2
                    text-gray-600
                "
            >

                <i
                    class="
                        fa-solid
                        fa-calendar
                    "
                ></i>

                <span>
                    Assessment Date:
                </span>

                <strong class="text-gray-900">

                    ${formatDate(
                        data.created_at
                    )}

                </strong>

            </div>

        </div>


        <!-- REMARKS -->

        <div
            class="
                mt-6
                pt-5
                border-t
            "
        >

            <h3
                class="
                    font-semibold
                    mb-4
                "
            >

                <i
                    class="
                        fa-solid
                        fa-comment
                        text-blue-500
                        mr-2
                    "
                ></i>

                Assessment Remarks

            </h3>


            <div class="space-y-3">

                <!-- ENVIRONMENTAL REMARK -->

                <div
                    class="
                        bg-green-50
                        rounded-lg
                        p-4
                    "
                >

                    <p
                        class="
                            font-medium
                            text-green-700
                            mb-1
                        "
                    >
                        Environmental
                    </p>

                    <p
                        class="
                            text-gray-600
                            text-sm
                            leading-6
                        "
                    >
                        ${escapeHtml(
                            data.environmental_remark ||
                            "No remark available."
                        )}
                    </p>

                </div>


                <!-- SOCIAL REMARK -->

                <div
                    class="
                        bg-blue-50
                        rounded-lg
                        p-4
                    "
                >

                    <p
                        class="
                            font-medium
                            text-blue-700
                            mb-1
                        "
                    >
                        Social
                    </p>

                    <p
                        class="
                            text-gray-600
                            text-sm
                            leading-6
                        "
                    >
                        ${escapeHtml(
                            data.social_remark ||
                            "No remark available."
                        )}
                    </p>

                </div>


                <!-- GOVERNANCE REMARK -->

                <div
                    class="
                        bg-purple-50
                        rounded-lg
                        p-4
                    "
                >

                    <p
                        class="
                            font-medium
                            text-purple-700
                            mb-1
                        "
                    >
                        Governance
                    </p>

                    <p
                        class="
                            text-gray-600
                            text-sm
                            leading-6
                        "
                    >
                        ${escapeHtml(
                            data.governance_remark ||
                            "No remark available."
                        )}
                    </p>

                </div>


                <!-- OVERALL REMARK -->

                <div
                    class="
                        bg-emerald-50
                        rounded-lg
                        p-4
                    "
                >

                    <p
                        class="
                            font-medium
                            text-emerald-700
                            mb-1
                        "
                    >
                        Overall
                    </p>

                    <p
                        class="
                            text-gray-600
                            text-sm
                            leading-6
                        "
                    >
                        ${escapeHtml(
                            data.overall_remark ||
                            "No remark available."
                        )}
                    </p>

                </div>

            </div>

        </div>


        <!-- RECOMMENDATION -->

        <div
            class="
                mt-6
                pt-5
                border-t
            "
        >

            <h3
                class="
                    font-semibold
                    mb-2
                "
            >

                <i
                    class="
                        fa-solid
                        fa-lightbulb
                        text-yellow-500
                        mr-2
                    "
                ></i>

                Recommendation

            </h3>


            <p
                class="
                    text-gray-600
                    leading-6
                "
            >

                ${escapeHtml(
                    data.recommendations ||
                    "No recommendations available."
                )}

            </p>

        </div>

    `;


    const modal =
        document.getElementById(
            "detailModal"
        );


    if (!modal) {
        return;
    }


    modal.classList.remove("hidden");

    modal.classList.add("flex");

}


// =========================================
// CLOSE MODAL
// =========================================

window.closeModal = function() {

    const modal =
        document.getElementById(
            "detailModal"
        );


    if (!modal) {
        return;
    }


    modal.classList.remove("flex");

    modal.classList.add("hidden");

};


// =========================================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// =========================================

document.addEventListener(
    "click",
    function(event) {

        const modal =
            document.getElementById(
                "detailModal"
            );


        if (!modal) {
            return;
        }


        if (
            event.target === modal
        ) {

            window.closeModal();

        }

    }
);


// =========================================
// ESC KEY CLOSE MODAL
// =========================================

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            window.closeModal();

        }

    }
);


// =========================================
// FORMAT SCORE
// =========================================

function formatScore(value, decimals = 1) {

    const number =
        Number(value);


    if (Number.isNaN(number)) {
        return "0.0";
    }


    return number.toFixed(decimals);

}


// =========================================
// ESCAPE HTML
// =========================================

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}
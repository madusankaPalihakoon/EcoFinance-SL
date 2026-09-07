import api from "../../assets/js/api.js";
import { initLayout } from "../../assets/js/layout.js";


// =========================================
// INITIALIZE LAYOUT
// =========================================

initLayout({
    title: "AI Reports"
});


// =========================================
// ELEMENTS
// =========================================

const table =
    document.getElementById("historyTable");

const btn =
    document.getElementById("generateBtn");

const totalReports =
    document.getElementById("totalReports");

const totalTokens =
    document.getElementById("totalTokens");

const totalCost =
    document.getElementById("totalCost");

const lastModel =
    document.getElementById("lastModel");

const emptyState =
    document.getElementById("emptyState");

const modal =
    document.getElementById("reportModal");

const reportContent =
    document.getElementById("reportContent");

const closeModal =
    document.getElementById("closeModal");


// =========================================
// REPORT CACHE
// =========================================

let reportsCache = [];


// =========================================
// LOAD AI HISTORY
// =========================================

async function loadHistory() {

    if (!table) {
        console.error(
            "historyTable element was not found."
        );

        return;
    }

    try {

        console.log(
            "Loading AI history..."
        );


        const response =
            await api.get("/ai/history");


        console.log(
            "AI History Response:",
            response
        );


        if (
            !response ||
            response.success === false
        ) {

            throw new Error(
                response?.message ||
                "Failed to load AI history."
            );

        }


        const reports =
            Array.isArray(response.data)
                ? response.data
                : [];


        reportsCache =
            reports;


        table.innerHTML = "";


        // =====================================
        // NO REPORTS
        // =====================================

        if (!reports.length) {

            if (emptyState) {

                emptyState.classList.remove(
                    "hidden"
                );

            }


            if (totalReports) {

                totalReports.textContent =
                    "0";

            }


            if (totalTokens) {

                totalTokens.textContent =
                    "0";

            }


            if (totalCost) {

                totalCost.textContent =
                    "$0.0000";

            }


            if (lastModel) {

                lastModel.textContent =
                    "-";

            }


            table.innerHTML = `

                <tr>

                    <td
                        colspan="7"
                        class="text-center py-10"
                    >

                        <div class="text-slate-500">

                            <i
                                class="
                                    fa-solid
                                    fa-folder-open
                                    text-3xl
                                    mb-3
                                "
                            ></i>

                            <p>
                                No AI reports found.
                            </p>

                        </div>

                    </td>

                </tr>

            `;

            return;

        }


        if (emptyState) {

            emptyState.classList.add(
                "hidden"
            );

        }


        // =====================================
        // SUMMARY VARIABLES
        // =====================================

        let tokenCount = 0;

        let cost = 0;


        // =====================================
        // RENDER TABLE
        // =====================================

        reports.forEach(
            (report, index) => {

                tokenCount +=
                    Number(
                        report.total_tokens || 0
                    );


                cost +=
                    Number(
                        report.cost || 0
                    );


                const id =
                    escapeHtml(
                        report.id
                    );


                const model =
                    escapeHtml(
                        report.model || "-"
                    );


                const status =
                    escapeHtml(
                        report.status ||
                        "Generated"
                    );


                const tokens =
                    Number(
                        report.total_tokens || 0
                    ).toLocaleString();


                const reportCost =
                    Number(
                        report.cost || 0
                    ).toFixed(4);


                const date =
                    formatDate(
                        report.created_at
                    );


                table.innerHTML += `

                    <tr>

                        <!-- ID -->

                        <td>

                            <span class="report-id">

                                #${id}

                            </span>

                        </td>


                        <!-- MODEL -->

                        <td>

                            <div class="model-cell">

                                <div class="model-icon">

                                    <i
                                        class="
                                            fa-solid
                                            fa-microchip
                                        "
                                    ></i>

                                </div>


                                <span>

                                    ${model}

                                </span>

                            </div>

                        </td>


                        <!-- STATUS -->

                        <td>

                            <span
                                class="
                                    status
                                    status-generated
                                "
                            >

                                <i
                                    class="
                                        fa-solid
                                        fa-circle-check
                                    "
                                ></i>

                                ${status}

                            </span>

                        </td>


                        <!-- TOKENS -->

                        <td>

                            ${tokens}

                        </td>


                        <!-- COST -->

                        <td>

                            $${reportCost}

                        </td>


                        <!-- DATE -->

                        <td>

                            ${date}

                        </td>


                        <!-- ACTION -->

                        <td class="text-center">

                            <button
                                type="button"
                                class="
                                    action-btn
                                    view-btn
                                "
                                data-index="${index}"
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

            }
        );


        // =====================================
        // UPDATE SUMMARY
        // =====================================

        if (totalReports) {

            totalReports.textContent =
                reports.length.toLocaleString();

        }


        if (totalTokens) {

            totalTokens.textContent =
                tokenCount.toLocaleString();

        }


        if (totalCost) {

            totalCost.textContent =
                `$${cost.toFixed(4)}`;

        }


        if (lastModel) {

            /*
             * Use the latest report.
             *
             * Backend history is normally ordered
             * newest first. If your backend returns
             * oldest first, the last item is used.
             */

            lastModel.textContent =
                reports[0]?.model || "-";

        }

    }
    catch (error) {

        console.error(
            "AI history error:",
            error
        );


        table.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="text-center py-10"
                >

                    <div class="text-red-500">

                        <i
                            class="
                                fa-solid
                                fa-circle-exclamation
                                text-3xl
                                mb-3
                            "
                        ></i>


                        <p class="font-medium">

                            ${escapeHtml(
            error?.message ||
            "Failed to load AI history."
        )}

                        </p>

                    </div>

                </td>

            </tr>

        `;

    }

}


// =========================================
// GENERATE AI REPORT
// =========================================

if (btn) {

    btn.addEventListener(
        "click",
        async () => {

            if (btn.disabled) {
                return;
            }


            btn.disabled = true;


            const originalButton =
                btn.innerHTML;


            btn.innerHTML = `

                <i
                    class="
                        fa-solid
                        fa-spinner
                        fa-spin
                    "
                ></i>

                Generating...

            `;


            try {

                console.log(
                    "Generating AI report..."
                );


                /*
                 * Your backend does not require
                 * any JSON data for /ai/generate.
                 */

                const response =
                    await api.post(
                        "/ai/generate",
                        {}
                    );


                console.log(
                    "AI Generate Response:",
                    response
                );


                if (!response) {

                    throw new Error(
                        "No response received from server."
                    );

                }


                if (
                    response.success === false
                ) {

                    throw new Error(
                        response.message ||
                        "Failed to generate AI report."
                    );

                }


                /*
                 * Reload history after successful
                 * generation.
                 */

                await loadHistory();


                alert(
                    "AI report generated successfully."
                );

            }
            catch (error) {

                console.error(
                    "AI generation error:",
                    error
                );


                alert(
                    "AI Report Generation Failed:\n\n" +
                    (
                        error?.message ||
                        "Failed to generate AI report."
                    )
                );

            }
            finally {

                btn.disabled = false;


                btn.innerHTML =
                    originalButton || `

                        <i
                            class="
                                fa-solid
                                fa-wand-magic-sparkles
                            "
                        ></i>

                        Generate AI Report

                    `;

            }

        }
    );

}


// =========================================
// VIEW REPORT
// =========================================

document.addEventListener(
    "click",
    async (event) => {

        const button =
            event.target.closest(
                ".view-btn"
            );


        if (!button) {
            return;
        }


        const index =
            Number(
                button.dataset.index
            );


        if (
            Number.isNaN(index) ||
            !reportsCache[index]
        ) {

            alert(
                "Unable to find this AI report."
            );

            return;

        }


        const report =
            reportsCache[index];


        const reportId =
            report.id;


        if (!reportId) {

            alert(
                "This report does not have a valid ID."
            );

            return;

        }


        try {

            /*
             * Show modal immediately with loading state.
             */

            if (modal) {

                modal.classList.remove(
                    "hidden"
                );

                modal.classList.add(
                    "flex"
                );

            }


            if (reportContent) {

                reportContent.innerHTML = `

                    <div
                        class="
                            text-center
                            py-10
                            text-slate-500
                        "
                    >

                        <i
                            class="
                                fa-solid
                                fa-spinner
                                fa-spin
                                text-3xl
                                mb-3
                            "
                        ></i>

                        <p>
                            Loading report...
                        </p>

                    </div>

                `;

            }


            console.log(
                "Loading AI report:",
                reportId
            );


            /*
             * IMPORTANT:
             *
             * /ai/history only returns report
             * metadata.
             *
             * The actual report content is returned
             * by:
             *
             * GET /ai/<id>
             */

            const response =
                await api.get(
                    `/ai/${reportId}`
                );


            console.log(
                "AI Report Response:",
                response
            );


            if (
                !response ||
                response.success === false
            ) {

                throw new Error(
                    response?.message ||
                    "Unable to load AI report."
                );

            }


            const data =
                response.data || {};


            const content =
                data.report ||
                data.content ||
                data.generated_report ||
                "";

            console.log("REPORT CONTENT:", content);
            console.log("REPORT LENGTH:", String(content).length);


            // =====================================
            // NO CONTENT
            // =====================================

            if (!content) {

                if (reportContent) {

                    reportContent.innerHTML = `

                        <div
                            class="
                                text-center
                                py-10
                                text-slate-500
                            "
                        >

                            <i
                                class="
                                    fa-solid
                                    fa-file-circle-exclamation
                                    text-3xl
                                    mb-3
                                "
                            ></i>

                            <p>
                                No report content is available.
                            </p>

                        </div>

                    `;

                }

                return;

            }


            // =====================================
            // DISPLAY REPORT
            // =====================================

            if (
                typeof marked !== "undefined"
            ) {

                reportContent.innerHTML =
                    marked.parse(
                        String(content)
                    );

            }
            else {

                reportContent.textContent =
                    String(content);

            }

        }
        catch (error) {

            console.error(
                "View AI report error:",
                error
            );


            if (reportContent) {

                reportContent.innerHTML = `

                    <div
                        class="
                            text-center
                            py-10
                            text-red-500
                        "
                    >

                        <i
                            class="
                                fa-solid
                                fa-circle-exclamation
                                text-3xl
                                mb-3
                            "
                        ></i>


                        <p class="font-medium">

                            ${escapeHtml(
                    error?.message ||
                    "Unable to load AI report."
                )}

                        </p>

                    </div>

                `;

            }

        }

    }
);


// =========================================
// CLOSE MODAL BUTTON
// =========================================

if (closeModal) {

    closeModal.addEventListener(
        "click",
        () => {

            closeReportModal();

        }
    );

}


// =========================================
// CLOSE MODAL OUTSIDE
// =========================================

if (modal) {

    modal.addEventListener(
        "click",
        (event) => {

            if (
                event.target === modal
            ) {

                closeReportModal();

            }

        }
    );

}


// =========================================
// ESC KEY
// =========================================

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape"
        ) {

            closeReportModal();

        }

    }
);


// =========================================
// CLOSE REPORT MODAL
// =========================================

function closeReportModal() {

    if (!modal) {
        return;
    }


    modal.classList.remove(
        "flex"
    );


    modal.classList.add(
        "hidden"
    );

}


// =========================================
// DATE FORMAT
// =========================================

function formatDate(date) {

    if (!date) {
        return "-";
    }


    const parsedDate =
        new Date(date);


    if (
        Number.isNaN(
            parsedDate.getTime()
        )
    ) {

        return "-";

    }


    return parsedDate.toLocaleString(
        "en-GB",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

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
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


// =========================================
// INITIAL LOAD
// =========================================

loadHistory();
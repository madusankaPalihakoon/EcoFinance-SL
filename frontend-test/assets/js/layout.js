import auth from "./auth.js";


const MENU = [
    {
        title: "Dashboard",
        icon: "fa-solid fa-chart-column",
        page: "dashboard",
        url: "/dashboard/dashboard.html",
    },

    {
        title: "Company",
        icon: "fa-solid fa-building",
        page: "company",
        url: "/dashboard/company/company.html",
    },

    {
        title: "Business Data",
        icon: "fa-solid fa-industry",
        page: "business",
        url: "/dashboard/business/new.html",
    },

    {
        title: "ESG Data",
        icon: "fa-solid fa-seedling",
        page: "esg",
        url: "/dashboard/esg/new.html",
    },

    {
        title: "Reports",
        icon: "fa-solid fa-file-lines",
        page: "reports",
        url: "/dashboard/reports/history.html",
    },

    {
        title: "AI Reports",
        icon: "fa-solid fa-robot",
        page: "ai",
        url: "/dashboard/ai/history.html",
    },

    {
        title: "Profile",
        icon: "fa-solid fa-user",
        page: "profile",
        url: "/dashboard/profile/profile.html",
    },
];


export function initLayout({ title = "Dashboard" } = {}) {

    renderSidebar();

    renderHeader(title);

    renderFooter();

}


function renderSidebar() {

    const sidebar =
        document.getElementById("sidebar");

    if (!sidebar) {
        return;
    }


    const currentPath =
        window.location.pathname;


    let html = `

        <aside
            class="
                w-64
                min-h-screen
                bg-slate-900
                text-white
                flex-shrink-0
            "
        >

            <!-- Logo -->

            <div
                class="
                    h-28
                    flex
                    flex-col
                    justify-center
                    px-6
                    border-b
                    border-slate-700
                "
            >

                <h1 class="text-2xl font-bold">
                    EcoFinance SL
                </h1>

                <p class="text-slate-400 text-sm mt-1">
                    Sustainability Platform
                </p>

            </div>


            <!-- Navigation -->

            <nav class="mt-6 px-3 space-y-2">
    `;


    MENU.forEach((item) => {

        const isActive =
            isCurrentPage(item.page, currentPath);


        html += `

            <a
                href="${item.url}"
                data-page="${item.page}"

                class="
                    menu-item
                    ${isActive ? "active" : ""}
                "
            >

                <i class="${item.icon} w-5"></i>

                <span>
                    ${item.title}
                </span>

            </a>

        `;

    });


    html += `

            </nav>

        </aside>

    `;


    sidebar.innerHTML = html;

}


function isCurrentPage(page, pathname) {

    /*
     * Match the actual dashboard section.
     *
     * /dashboard/dashboard.html
     *              ^
     *
     * /dashboard/company/company.html
     *              ^ company
     */


    const parts =
        pathname
            .split("/")
            .filter(Boolean);


    const dashboardIndex =
        parts.indexOf("dashboard");


    if (dashboardIndex === -1) {

        return false;

    }


    const section =
        parts[dashboardIndex + 1];


    switch (page) {

        case "dashboard":

            return section === "dashboard";


        case "company":

            return section === "company";


        case "business":

            return section === "business";


        case "esg":

            return section === "esg";


        case "reports":

            return section === "reports";


        case "ai":

            return section === "ai";


        case "profile":

            return section === "profile";


        default:

            return false;

    }

}


function renderHeader(title) {

    const header =
        document.getElementById("header");

    if (!header) {
        return;
    }


    const user =
        auth.getUser() || {};


    const fullName =
        user.full_name || "User";


    const email =
        user.email || "";


    header.innerHTML = `

        <header
            class="
                h-20
                bg-white
                border-b
                border-slate-200
                shadow-sm
                flex
                items-center
                justify-between
                px-8
                flex-shrink-0
            "
        >

            <!-- Page Information -->

            <div>

                <h2
                    id="pageTitle"
                    class="
                        text-2xl
                        font-bold
                        text-slate-900
                    "
                >
                    ${title}
                </h2>

                <p class="text-slate-500 text-sm mt-1">
                    Sustainability Reporting
                </p>

            </div>


            <!-- User -->

            <div class="flex items-center gap-5">

                <div class="text-right">

                    <h4
                        class="
                            font-semibold
                            text-slate-900
                        "
                    >
                        ${fullName}
                    </h4>

                    <p
                        class="
                            text-sm
                            text-slate-500
                        "
                    >
                        ${email}
                    </p>

                </div>


                <div
                    class="
                        w-10
                        h-10
                        rounded-full
                        bg-emerald-600
                        text-white
                        flex
                        items-center
                        justify-center
                        font-semibold
                    "
                >
                    ${getInitial(fullName)}
                </div>


                <button
                    id="logoutBtn"

                    class="
                        bg-red-500
                        hover:bg-red-600
                        text-white
                        px-5
                        py-2
                        rounded-lg
                        font-medium
                        transition
                    "
                >
                    Logout
                </button>

            </div>

        </header>

    `;


    const logoutBtn =
        document.getElementById("logoutBtn");


    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            () => auth.logout()
        );

    }

}


function getInitial(name) {

    if (!name) {
        return "U";
    }

    return name
        .trim()
        .charAt(0)
        .toUpperCase();

}


function renderFooter() {

    const footer =
        document.getElementById("footer");

    if (!footer) {
        return;
    }


    footer.innerHTML = `

        <footer
            class="
                text-center
                py-5
                text-sm
                text-slate-500
            "
        >

            © 2026 EcoFinance SL

        </footer>

    `;

}
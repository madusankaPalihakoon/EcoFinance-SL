import auth from "./auth.js";


const MENU = [

    {
        title: "Dashboard",

        icon: "fa-solid fa-chart-column",

        page: "dashboard",

        url: "/dashboard/dashboard.html"
    },


    {
        title: "Company",

        icon: "fa-solid fa-building",

        page: "company",

        url: "/dashboard/company/company.html"
    },


    {
        title: "Business Data",

        icon: "fa-solid fa-industry",

        page: "business",

        url: "/dashboard/business/new.html"
    },


    {
        title: "ESG Data",

        icon: "fa-solid fa-seedling",

        page: "esg",

        url: "/dashboard/esg/new.html"
    },


    {
        title: "Reports",

        icon: "fa-solid fa-file-lines",

        page: "reports",

        url: "/dashboard/reports/history.html"
    },


    {
        title: "AI Reports",

        icon: "fa-solid fa-robot",

        page: "ai",

        url: "/dashboard/ai/history.html"
    },


    {
        title: "Profile",

        icon: "fa-solid fa-user",

        page: "profile",

        url: "/dashboard/profile/profile.html"
    }

];


// INITIALIZE LAYOUT

export function initLayout(
    {
        title = "Dashboard"
    } = {}
) {

    renderSidebar();

    renderHeader(title);

    renderFooter();

}


// SIDEBAR

function renderSidebar() {

    const sidebar =
        document.getElementById(
            "sidebar"
        );


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

                <div class="flex items-center gap-3">

                    <div
                        class="
                            w-10
                            h-10
                            rounded-lg
                            bg-emerald-600
                            flex
                            items-center
                            justify-center
                        "
                    >

                        <i
                            class="
                                fa-solid
                                fa-leaf
                            "
                        ></i>

                    </div>


                    <div>

                        <h1 class="text-xl font-bold">
                            EcoFinance SL
                        </h1>

                        <p class="text-slate-400 text-xs">
                            Sustainability Platform
                        </p>

                    </div>

                </div>

            </div>



            <!-- Navigation -->

            <nav
                class="
                    mt-6
                    px-3
                    space-y-2
                "
            >
    `;


    MENU.forEach(
        item => {

            const active =
                isCurrentPage(
                    item.page,
                    currentPath
                );


            html += `

                <a
                    href="${item.url}"
                    data-page="${item.page}"
                    class="
                        menu-item
                        ${active ? "active" : ""}
                    "
                >

                    <i
                        class="
                            ${item.icon}
                            w-5
                        "
                    ></i>


                    <span>
                        ${item.title}
                    </span>

                </a>

            `;

        }
    );


    html += `

            </nav>


            <!-- Sidebar Footer -->

            <div
                class="
                    absolute
                    bottom-5
                    left-0
                    w-64
                    text-center
                    text-xs
                    text-slate-500
                "
            >

                EcoFinance SL © 2026

            </div>


        </aside>

    `;


    sidebar.innerHTML =
        html;

}


// CURRENT PAGE

function isCurrentPage(
    page,
    pathname
) {

    const parts =
        pathname
            .split("/")
            .filter(Boolean);


    const dashboardIndex =
        parts.indexOf(
            "dashboard"
        );


    if (
        dashboardIndex === -1
    ) {

        return false;

    }


    const section =
        parts[
            dashboardIndex + 1
        ];


    return section === page;

}


// HEADER

function renderHeader(title) {

    const header =
        document.getElementById(
            "header"
        );


    if (!header) {

        return;

    }


    const user =
        auth.getUser() || {};


    const fullName =
        user.full_name ||
        "User";


    const email =
        user.email ||
        "";



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


            <!-- Page Title -->

            <div>

                <div class="flex items-center gap-2">

                    <i
                        class="
                            fa-solid
                            fa-chart-line
                            text-emerald-600
                        "
                    ></i>


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

                </div>


                <p
                    class="
                        text-slate-500
                        text-sm
                        mt-1
                    "
                >
                    Sustainability Reporting
                </p>

            </div>



            <!-- User -->

            <div
                class="
                    flex
                    items-center
                    gap-5
                "
            >


                <!-- User Information -->

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



                <!-- User Avatar -->

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



                <!-- Logout -->

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
                        flex
                        items-center
                        gap-2
                    "
                >

                    <i
                        class="
                            fa-solid
                            fa-right-from-bracket
                        "
                    ></i>

                    Logout

                </button>


            </div>

        </header>

    `;


    // LOGOUT EVENT

    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );


    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            () => auth.logout()
        );

    }

}

// USER INITIAL

function getInitial(name) {

    if (!name) {

        return "U";

    }


    return name
        .trim()
        .charAt(0)
        .toUpperCase();

}

// FOOTER


function renderFooter() {

    const footer =
        document.getElementById(
            "footer"
        );


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
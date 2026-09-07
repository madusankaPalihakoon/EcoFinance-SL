import auth from "./auth.js";
import api from "./api.js";


/* =========================================
   MENU
========================================= */

const MENU = [
    {
        title: "Dashboard",
        icon: "fa-solid fa-chart-column",
        url: "/dashboard/dashboard.html"
    },
    {
        title: "Company",
        icon: "fa-solid fa-building",
        url: "/dashboard/company/company.html"
    },
    {
        title: "Business Data",
        icon: "fa-solid fa-industry",
        url: "/dashboard/business/new.html"
    },
    {
        title: "ESG Data",
        icon: "fa-solid fa-seedling",
        url: "/dashboard/esg/new.html"
    },
    {
        title: "Reports",
        icon: "fa-solid fa-file-lines",
        url: "/dashboard/reports/history.html"
    },
    {
        title: "AI Reports",
        icon: "fa-solid fa-robot",
        url: "/dashboard/ai/history.html"
    },
    {
        title: "Profile",
        icon: "fa-solid fa-user",
        url: "/dashboard/profile/profile.html"
    }
];


/* =========================================
   INITIALIZE
========================================= */

export async function initLayout({ title = "Dashboard" } = {}) {

    renderSidebar();

    renderHeader(title);

    renderFooter();

    // Load latest user + company
    await loadHeaderData();
}


/* =========================================
   SIDEBAR
========================================= */

function renderSidebar() {

    const sidebar =
        document.getElementById("sidebar");

    if (!sidebar) {
        console.error("Sidebar element not found");
        return;
    }


    const currentPath =
        window.location.pathname;


    sidebar.innerHTML = `

        <aside
            class="
                w-64
                bg-slate-900
                text-white
                h-screen
                fixed
                left-0
                top-0
                flex
                flex-col
                overflow-hidden
            "
        >

            <!-- LOGO -->

            <div
                class="
                    p-6
                    border-b
                    border-slate-700
                    flex-shrink-0
                "
            >

                <div
                    class="
                        flex
                        items-center
                        gap-3
                    "
                >

                    <div
                        class="
                            w-11
                            h-11
                            rounded-xl
                            bg-green-600
                            flex
                            items-center
                            justify-center
                        "
                    >

                        <i
                            class="
                                fa-solid
                                fa-leaf
                                text-xl
                            "
                        ></i>

                    </div>


                    <div>

                        <h1
                            class="
                                text-lg
                                font-bold
                            "
                        >
                            EcoFinance SL
                        </h1>

                        <p
                            class="
                                text-xs
                                text-slate-400
                            "
                        >
                            Sustainability
                        </p>

                    </div>

                </div>

            </div>


            <!-- NAVIGATION -->

            <nav
                class="
                    flex-1
                    p-4
                    space-y-2
                    overflow-y-auto
                "
            >

                ${MENU.map(item => {

                    const active =
                        currentPath.includes(item.url)
                            ? "active"
                            : "";

                    return `

                        <a
                            href="${item.url}"
                            class="
                                menu-item
                                ${active}
                            "
                        >

                            <i
                                class="
                                    ${item.icon}
                                    w-5
                                    text-center
                                "
                            ></i>

                            <span>
                                ${item.title}
                            </span>

                        </a>

                    `;

                }).join("")}

            </nav>


            <!-- SIDEBAR BOTTOM -->

            <div
                class="
                    p-4
                    border-t
                    border-slate-700
                    flex-shrink-0
                "
            >

                <div
                    class="
                        bg-slate-800
                        rounded-xl
                        p-4
                    "
                >

                    <div
                        class="
                            flex
                            items-center
                            gap-2
                            mb-2
                        "
                    >

                        <i
                            class="
                                fa-solid
                                fa-leaf
                                text-green-400
                            "
                        ></i>

                        <span
                            class="
                                text-sm
                                font-semibold
                            "
                        >
                            Sustainability
                        </span>

                    </div>


                    <p
                        class="
                            text-xs
                            text-slate-400
                        "
                    >
                        Making businesses more sustainable.
                    </p>

                </div>

            </div>

        </aside>

    `;
}


/* =========================================
   HEADER
========================================= */

function renderHeader(title) {

    const header =
        document.getElementById("header");

    if (!header) {

        console.error(
            "Header element not found"
        );

        return;
    }


    const user =
        auth.getUser() || {};


    const fullName =
        user.full_name ||
        user.name ||
        "User";


    header.innerHTML = `

        <header
            class="
                bg-white
                shadow
                px-8
                py-5
                flex
                justify-between
                items-center
            "
        >

            <!-- PAGE TITLE -->

            <div>

                <h2
                    class="
                        text-2xl
                        font-bold
                        text-slate-900
                    "
                >
                    ${title}
                </h2>


                <p
                    class="
                        text-gray-500
                        text-sm
                        mt-1
                    "
                >
                    Sustainability Reporting
                </p>

            </div>


            <!-- USER -->

            <div
                class="
                    flex
                    items-center
                    gap-4
                "
            >

                <div class="text-right">

                    <h4
                        id="headerUserName"
                        class="
                            font-semibold
                            text-slate-900
                        "
                    >
                        ${fullName}
                    </h4>


                    <p
                        id="headerCompanyName"
                        class="
                            text-sm
                            text-gray-500
                            max-w-xs
                            break-words
                        "
                    >
                        Loading company...
                    </p>

                </div>


                <!-- AVATAR -->

                <div
                    id="headerAvatar"
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


                <!-- LOGOUT -->

                <button
                    id="logoutBtn"
                    type="button"
                    class="
                        bg-red-500
                        hover:bg-red-600
                        text-white
                        px-4
                        py-2
                        rounded-lg
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


    const logoutBtn =
        document.getElementById("logoutBtn");


    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            () => {

                auth.logout();

                window.location.href =
                    "/index.html";

            }
        );

    }

}


/* =========================================
   LOAD USER + COMPANY
========================================= */

async function loadHeaderData() {

    try {

        /*
         * Your Flask endpoint:
         *
         * GET /api/profile/
         *
         * returns:
         *
         * {
         *   success: true,
         *   user: {...},
         *   company: {...}
         * }
         */

        const response =
            await api.get("/profile/");


        console.log(
            "HEADER PROFILE DATA:",
            response
        );


        if (!response.success) {

            console.error(
                "Unable to load profile:",
                response.message
            );

            return;
        }


        /* =====================================
           USER
        ===================================== */

        const user =
            response.user;


        if (user) {

            const fullName =
                user.full_name ||
                "User";


            const userElement =
                document.getElementById(
                    "headerUserName"
                );


            if (userElement) {

                userElement.textContent =
                    fullName;

            }


            const avatar =
                document.getElementById(
                    "headerAvatar"
                );


            if (avatar) {

                avatar.textContent =
                    getInitial(fullName);

            }


            /*
             * IMPORTANT
             *
             * Update localStorage so
             * Dashboard and other pages
             * get the new name.
             */

            const currentUser =
                auth.getUser() || {};


            currentUser.full_name =
                fullName;


            currentUser.email =
                user.email;


            /*
             * Use auth's existing storage
             * method if available.
             */

            if (
                typeof auth.setUser ===
                "function"
            ) {

                auth.setUser(
                    currentUser
                );

            }

        }


        /* =====================================
           COMPANY
        ===================================== */

        const company =
            response.company;


        const companyElement =
            document.getElementById(
                "headerCompanyName"
            );


        if (companyElement) {

            if (
                company &&
                company.company_name
            ) {

                companyElement.textContent =
                    company.company_name;

            }
            else {

                companyElement.textContent =
                    "Company Name";

            }

        }

    }
    catch (error) {

        console.error(
            "Header data error:",
            error
        );


        const companyElement =
            document.getElementById(
                "headerCompanyName"
            );


        if (companyElement) {

            companyElement.textContent =
                "Company Name";

        }

    }

}


/* =========================================
   INITIAL
========================================= */

function getInitial(name) {

    if (!name) {
        return "U";
    }


    return name
        .trim()
        .charAt(0)
        .toUpperCase();

}


/* =========================================
   FOOTER
========================================= */

function renderFooter() {

    const footer =
        document.getElementById("footer");


    if (!footer) {

        console.error(
            "Footer element not found"
        );

        return;
    }


    footer.innerHTML = `

        <footer
            class="
                bg-white
                border-t
                p-4
                text-center
                text-gray-500
                text-sm
            "
        >

            © 2026 EcoFinance SL

        </footer>

    `;

}
/* =========================================================
   SMART QUESTION PAPER GENERATOR
   FRONTEND AUTHENTICATION

   IMPORTANT:
   This is a temporary frontend-only authentication system.
   It uses localStorage for testing.

   Later:
   Replace the login/signup logic with backend API calls.
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const loginPage = document.getElementById("loginPage");
    const signupPage = document.getElementById("signupPage");
    const application = document.getElementById("application");

    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");

    const openSignup = document.getElementById("openSignup");
    const backToLogin = document.getElementById("backToLogin");
    const logoutButton = document.getElementById("logoutButton");

    const loginEmail = document.getElementById("loginEmail");
    const loginPassword = document.getElementById("loginPassword");
    const toggleLoginPassword = document.getElementById("toggleLoginPassword");

    const signupName = document.getElementById("signupName");
    const signupEmail = document.getElementById("signupEmail");
    const signupEmployeeId = document.getElementById("signupEmployeeId");
    const signupDepartment = document.getElementById("signupDepartment");
    const signupPassword = document.getElementById("signupPassword");
    const signupConfirmPassword = document.getElementById("signupConfirmPassword");

    const teacherNavigation = document.getElementById("teacherNavigation");
    const adminNavigation = document.getElementById("adminNavigation");

    const pageTitle = document.getElementById("pageTitle");
    const pageSubtitle = document.getElementById("pageSubtitle");

    /* =====================================================
       STORAGE KEYS
    ===================================================== */

    const USERS_KEY = "smart_qpg_users";
    const SESSION_KEY = "smart_qpg_current_user";

    /* =====================================================
       DEFAULT USERS

       Teacher:
       Email: teacher@example.com
       Password: teacher123

       Admin:
       Email: admin@example.com
       Password: admin123
    ===================================================== */

    function initializeUsers() {

        const existingUsers = localStorage.getItem(USERS_KEY);

        if (existingUsers) {
            return;
        }

        const defaultUsers = [
            {
                id: "teacher-001",
                name: "Demo Teacher",
                email: "teacher@example.com",
                employeeId: "T001",
                department: "Computer Science and Engineering",
                password: "teacher123",
                role: "TEACHER",
                status: "ACTIVE",
                assignedSubjects: []
            },
            {
                id: "admin-001",
                name: "Administrator",
                email: "admin@example.com",
                employeeId: "ADMIN001",
                department: "Administration",
                password: "admin123",
                role: "ADMIN",
                status: "ACTIVE",
                assignedSubjects: []
            }
        ];

        localStorage.setItem(
            USERS_KEY,
            JSON.stringify(defaultUsers)
        );
    }

    /* =====================================================
       GET USERS
    ===================================================== */

    function getUsers() {

        try {

            const data = localStorage.getItem(USERS_KEY);

            if (!data) {
                return [];
            }

            const users = JSON.parse(data);

            return Array.isArray(users) ? users : [];

        } catch (error) {

            console.error("Error reading users:", error);

            return [];
        }
    }

    /* =====================================================
       SAVE USERS
    ===================================================== */

    function saveUsers(users) {

        localStorage.setItem(
            USERS_KEY,
            JSON.stringify(users)
        );
    }

    /* =====================================================
       GET CURRENT USER
    ===================================================== */

    function getCurrentUser() {

        try {

            const data =
                localStorage.getItem(SESSION_KEY);

            if (!data) {
                return null;
            }

            return JSON.parse(data);

        } catch (error) {

            console.error(
                "Error reading current session:",
                error
            );

            return null;
        }
    }

    /* =====================================================
       SAVE CURRENT USER
    ===================================================== */

    function saveCurrentUser(user) {

        const sessionUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            employeeId: user.employeeId || "",
            department: user.department || "",
            role: user.role,
            status: user.status,
            assignedSubjects: user.assignedSubjects || []
        };

        localStorage.setItem(
            SESSION_KEY,
            JSON.stringify(sessionUser)
        );

        return sessionUser;
    }

    /* =====================================================
       CLEAR SESSION
    ===================================================== */

    function clearSession() {

        localStorage.removeItem(SESSION_KEY);
    }

    /* =====================================================
       SHOW LOGIN PAGE
    ===================================================== */

    function showLoginPage() {

        if (loginPage) {
            loginPage.classList.remove("hidden");
        }

        if (signupPage) {
            signupPage.classList.add("hidden");
        }

        if (application) {
            application.classList.add("hidden");
        }

        if (teacherNavigation) {
            teacherNavigation.classList.add("hidden");
        }

        if (adminNavigation) {
            adminNavigation.classList.add("hidden");
        }
    }

    /* =====================================================
       SHOW SIGNUP PAGE
    ===================================================== */

    function showSignupPage() {

        if (loginPage) {
            loginPage.classList.add("hidden");
        }

        if (signupPage) {
            signupPage.classList.remove("hidden");
        }

        if (application) {
            application.classList.add("hidden");
        }
    }

    /* =====================================================
       SHOW APPLICATION
    ===================================================== */

    function showApplication(user) {

        if (!user) {
            showLoginPage();
            return;
        }

        if (loginPage) {
            loginPage.classList.add("hidden");
        }

        if (signupPage) {
            signupPage.classList.add("hidden");
        }

        if (application) {
            application.classList.remove("hidden");
        }

        updateUserUI(user);

        if (user.role === "TEACHER") {

            if (teacherNavigation) {
                teacherNavigation.classList.remove("hidden");
            }

            if (adminNavigation) {
                adminNavigation.classList.add("hidden");
            }

            showPage("teacher-dashboard");
            return;
        }

        if (user.role === "ADMIN") {

            if (teacherNavigation) {
                teacherNavigation.classList.add("hidden");
            }

            if (adminNavigation) {
                adminNavigation.classList.remove("hidden");
            }

            updateAdminTeacherTable();

            showPage("admin-dashboard");
            return;
        }

        clearSession();
        showLoginPage();
    }

    /* =====================================================
       UPDATE USER UI
    ===================================================== */

    function updateUserUI(user) {

        const firstLetter =
            user.name
                ? user.name.charAt(0).toUpperCase()
                : "U";

        /* Sidebar */

        const sidebarAvatar =
            document.getElementById("sidebarAvatar");

        const sidebarUserName =
            document.getElementById("sidebarUserName");

        const sidebarUserRole =
            document.getElementById("sidebarUserRole");

        if (sidebarAvatar) {
            sidebarAvatar.textContent = firstLetter;
        }

        if (sidebarUserName) {
            sidebarUserName.textContent = user.name;
        }

        if (sidebarUserRole) {
            sidebarUserRole.textContent =
                user.role === "ADMIN"
                    ? "Administrator"
                    : "Teacher";
        }

        /* Topbar */

        const topbarUserName =
            document.getElementById("topbarUserName");

        if (topbarUserName) {
            topbarUserName.textContent = user.name;
        }

        /* Teacher dashboard */

        const teacherWelcomeName =
            document.getElementById("teacherWelcomeName");

        if (teacherWelcomeName) {
            teacherWelcomeName.textContent = user.name;
        }

        /* Admin dashboard */

        const adminWelcomeName =
            document.getElementById("adminWelcomeName");

        if (adminWelcomeName) {
            adminWelcomeName.textContent = user.name;
        }

        /* Teacher profile */

        const profileAvatar =
            document.getElementById("profileAvatar");

        const profileName =
            document.getElementById("profileName");

        const profileEmail =
            document.getElementById("profileEmail");

        const profileDepartment =
            document.getElementById("profileDepartment");

        if (profileAvatar) {
            profileAvatar.textContent = firstLetter;
        }

        if (profileName) {
            profileName.textContent = user.name;
        }

        if (profileEmail) {
            profileEmail.textContent = user.email;
        }

        if (profileDepartment) {
            profileDepartment.textContent =
                user.department || "-";
        }

        /* Admin profile */

        const adminProfileName =
            document.getElementById("adminProfileName");

        const adminProfileEmail =
            document.getElementById("adminProfileEmail");

        if (adminProfileName) {
            adminProfileName.textContent = user.name;
        }

        if (adminProfileEmail) {
            adminProfileEmail.textContent = user.email;
        }
    }

    /* =====================================================
       PAGE INFORMATION
    ===================================================== */

    const pageInformation = {

        "teacher-dashboard": {
            title: "Dashboard",
            subtitle:
                "Overview of your question paper generation system"
        },

        "teacher-subjects": {
            title: "My Subjects",
            subtitle:
                "View subjects assigned to you"
        },

        "teacher-syllabus": {
            title: "Syllabus",
            subtitle:
                "Manage subject syllabus and topics"
        },

        "teacher-questions": {
            title: "Question Bank",
            subtitle:
                "Manage your question bank"
        },

        "teacher-pyqs": {
            title: "PYQs",
            subtitle:
                "Upload and analyze previous year question papers"
        },

        "teacher-weightage": {
            title: "Weightage Analysis",
            subtitle:
                "Analyze historical question patterns"
        },

        "teacher-generate": {
            title: "Generate Question Paper",
            subtitle:
                "Create a question paper using AI-assisted analysis"
        },

        "teacher-papers": {
            title: "My Papers",
            subtitle:
                "View and manage generated question papers"
        },

        "teacher-profile": {
            title: "Profile",
            subtitle:
                "Manage your profile information"
        },

        "teacher-help": {
            title: "Help",
            subtitle:
                "Get help with the question paper generator"
        },

        "admin-dashboard": {
            title: "Admin Dashboard",
            subtitle:
                "Manage the question paper generation system"
        },

        "admin-teachers": {
            title: "Teachers",
            subtitle:
                "Manage teacher accounts and approvals"
        },

        "admin-subjects": {
            title: "Subjects",
            subtitle:
                "Manage academic subjects"
        },

        "admin-assignments": {
            title: "Assignments",
            subtitle:
                "Assign subjects to teachers"
        },

        "admin-papers": {
            title: "Question Papers",
            subtitle:
                "View generated question papers"
        },

        "admin-activity": {
            title: "Activity",
            subtitle:
                "View system activities"
        },

        "admin-settings": {
            title: "Settings",
            subtitle:
                "Manage system settings"
        },

        "admin-profile": {
            title: "Profile",
            subtitle:
                "Manage administrator profile"
        }
    };

    /* =====================================================
       SHOW PAGE
    ===================================================== */

    function showPage(pageId) {

        const user = getCurrentUser();

        if (!user) {
            showLoginPage();
            return;
        }

        /* Teacher cannot access Admin pages */

        if (
            user.role === "TEACHER" &&
            pageId.startsWith("admin-")
        ) {
            pageId = "teacher-dashboard";
        }

        /* Admin cannot access Teacher pages */

        if (
            user.role === "ADMIN" &&
            pageId.startsWith("teacher-")
        ) {
            pageId = "admin-dashboard";
        }

        /* Hide all pages */

        document
            .querySelectorAll(".page-section")
            .forEach(function (section) {

                section.classList.add("hidden");
            });

        /* Show selected page */

        const selectedPage =
            document.getElementById(pageId);

        if (!selectedPage) {

            console.error(
                "Page not found:",
                pageId
            );

            return;
        }

        selectedPage.classList.remove("hidden");

        /* Navigation active state */

        document
            .querySelectorAll(".nav-item")
            .forEach(function (item) {

                item.classList.remove("active");
            });

        const activeNav =
            document.querySelector(
                '[data-page="' + pageId + '"]'
            );

        if (activeNav) {
            activeNav.classList.add("active");
        }

        /* Page title */

        const information =
            pageInformation[pageId];

        if (information) {

            if (pageTitle) {
                pageTitle.textContent =
                    information.title;
            }

            if (pageSubtitle) {
                pageSubtitle.textContent =
                    information.subtitle;
            }
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    /* =====================================================
       SIDEBAR NAVIGATION
    ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            const nav =
                event.target.closest(".nav-item");

            if (!nav) {
                return;
            }

            const pageId =
                nav.getAttribute("data-page");

            if (pageId) {
                showPage(pageId);
            }
        }
    );

    /* =====================================================
       QUICK ACTION NAVIGATION
    ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            const element =
                event.target.closest("[data-go]");

            if (!element) {
                return;
            }

            const pageId =
                element.getAttribute("data-go");

            if (pageId) {
                showPage(pageId);
            }
        }
    );

    /* =====================================================
       LOGIN
    ===================================================== */

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                const email =
                    loginEmail
                        ? loginEmail.value.trim().toLowerCase()
                        : "";

                const password =
                    loginPassword
                        ? loginPassword.value
                        : "";

                const selectedRoleElement =
                    document.querySelector(
                        'input[name="loginRole"]:checked'
                    );

                const selectedRole =
                    selectedRoleElement
                        ? selectedRoleElement.value
                        : "TEACHER";

                /* Required fields */

                if (!email || !password) {

                    alert(
                        "Please enter email and password."
                    );

                    return;
                }

                /* Get users */

                const users = getUsers();

                /* Find matching user */

                const user =
                    users.find(function (item) {

                        return (
                            item.email &&
                            item.email.toLowerCase() === email &&
                            item.password === password &&
                            item.role === selectedRole
                        );
                    });

                /* Invalid login */

                if (!user) {

                    alert(
                        "Invalid email, password, or selected role."
                    );

                    return;
                }

                /* Teacher approval */

                if (
                    user.role === "TEACHER" &&
                    user.status !== "ACTIVE"
                ) {

                    alert(
                        "Your teacher account is pending admin approval."
                    );

                    return;
                }

                /* Save session */

                const sessionUser =
                    saveCurrentUser(user);

                /* Open dashboard */

                showApplication(sessionUser);
            }
        );
    }

    /* =====================================================
       OPEN SIGNUP
    ===================================================== */

    if (openSignup) {

        openSignup.addEventListener(
            "click",
            function () {

                showSignupPage();
            }
        );
    }

    /* =====================================================
       BACK TO LOGIN
    ===================================================== */

    if (backToLogin) {

        backToLogin.addEventListener(
            "click",
            function () {

                showLoginPage();
            }
        );
    }

    /* =====================================================
       TEACHER SIGNUP
    ===================================================== */

    if (signupForm) {

        signupForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                const name =
                    signupName
                        ? signupName.value.trim()
                        : "";

                const email =
                    signupEmail
                        ? signupEmail.value.trim().toLowerCase()
                        : "";

                const employeeId =
                    signupEmployeeId
                        ? signupEmployeeId.value.trim()
                        : "";

                const department =
                    signupDepartment
                        ? signupDepartment.value.trim()
                        : "";

                const password =
                    signupPassword
                        ? signupPassword.value
                        : "";

                const confirmPassword =
                    signupConfirmPassword
                        ? signupConfirmPassword.value
                        : "";

                /* Required fields */

                if (
                    !name ||
                    !email ||
                    !employeeId ||
                    !department ||
                    !password ||
                    !confirmPassword
                ) {

                    alert(
                        "Please fill all fields."
                    );

                    return;
                }

                /* Email validation */

                const emailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!emailPattern.test(email)) {

                    alert(
                        "Please enter a valid email address."
                    );

                    return;
                }

                /* Password length */

                if (password.length < 6) {

                    alert(
                        "Password must contain at least 6 characters."
                    );

                    return;
                }

                /* Password confirmation */

                if (password !== confirmPassword) {

                    alert(
                        "Passwords do not match."
                    );

                    return;
                }

                const users = getUsers();

                /* Duplicate email */

                const emailExists =
                    users.some(function (user) {

                        return (
                            user.email &&
                            user.email.toLowerCase() === email
                        );
                    });

                if (emailExists) {

                    alert(
                        "An account with this email already exists."
                    );

                    return;
                }

                /* Duplicate employee ID */

                const employeeExists =
                    users.some(function (user) {

                        return (
                            user.employeeId &&
                            user.employeeId.toLowerCase() ===
                            employeeId.toLowerCase()
                        );
                    });

                if (employeeExists) {

                    alert(
                        "This Employee ID is already registered."
                    );

                    return;
                }

                /* Create new teacher */

                const newTeacher = {

                    id:
                        "teacher-" +
                        Date.now(),

                    name: name,

                    email: email,

                    employeeId:
                        employeeId,

                    department:
                        department,

                    password:
                        password,

                    role:
                        "TEACHER",

                    /* New teachers need Admin approval */

                    status:
                        "PENDING",

                    assignedSubjects: []
                };

                /* Save teacher */

                users.push(newTeacher);

                saveUsers(users);

                alert(
                    "Teacher account created successfully. Your account is pending admin approval."
                );

                /* Reset form */

                signupForm.reset();

                /* Return to login */

                showLoginPage();

                /* Select Teacher role */

                const teacherRadio =
                    document.querySelector(
                        'input[name="loginRole"][value="TEACHER"]'
                    );

                if (teacherRadio) {
                    teacherRadio.checked = true;
                }

                /* Put email in login */

                if (loginEmail) {
                    loginEmail.value = email;
                }

                if (loginPassword) {
                    loginPassword.focus();
                }
            }
        );
    }

    /* =====================================================
       PASSWORD SHOW / HIDE
    ===================================================== */

    if (toggleLoginPassword && loginPassword) {

        toggleLoginPassword.addEventListener(
            "click",
            function () {

                if (loginPassword.type === "password") {

                    loginPassword.type = "text";

                    toggleLoginPassword.textContent =
                        "Hide";

                } else {

                    loginPassword.type = "password";

                    toggleLoginPassword.textContent =
                        "Show";
                }
            }
        );
    }

    /* =====================================================
       LOGOUT
    ===================================================== */

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            function () {

                clearSession();

                if (loginForm) {
                    loginForm.reset();
                }

                showLoginPage();

                if (loginEmail) {
                    loginEmail.focus();
                }
            }
        );
    }

    /* =====================================================
       ADMIN TEACHER TABLE
    ===================================================== */

    function updateAdminTeacherTable() {

        const tableBody =
            document.getElementById(
                "teacherTableBody"
            );

        if (!tableBody) {
            return;
        }

        const users = getUsers();

        const teachers =
            users.filter(function (user) {

                return user.role === "TEACHER";
            });

        const teacherCount =
            document.getElementById(
                "adminTeacherCount"
            );

        if (teacherCount) {

            teacherCount.textContent =
                teachers.length;
        }

        if (teachers.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td
                        colspan="6"
                        style="text-align:center;padding:30px;"
                    >
                        No teacher accounts found.
                    </td>
                </tr>
            `;

            return;
        }

        tableBody.innerHTML =
            teachers
                .map(function (teacher) {

                    const statusClass =
                        teacher.status === "ACTIVE"
                            ? "status-active"
                            : "status-pending";

                    const actionHTML =
                        teacher.status === "PENDING"
                            ? `
                                <button
                                    class="primary-button approve-teacher"
                                    data-teacher-id="${escapeHTML(teacher.id)}"
                                    style="
                                        padding:6px 10px;
                                        font-size:10px;
                                    "
                                >
                                    Approve
                                </button>
                            `
                            : `
                                <span
                                    style="
                                        color:#16a34a;
                                        font-size:11px;
                                    "
                                >
                                    Approved
                                </span>
                            `;

                    return `
                        <tr>

                            <td>
                                ${escapeHTML(teacher.name)}
                            </td>

                            <td>
                                ${escapeHTML(teacher.email)}
                            </td>

                            <td>
                                ${escapeHTML(
                                    teacher.employeeId || "-"
                                )}
                            </td>

                            <td>
                                ${escapeHTML(
                                    teacher.department || "-"
                                )}
                            </td>

                            <td>
                                <span
                                    class="status-badge ${statusClass}"
                                >
                                    ${escapeHTML(
                                        teacher.status
                                    )}
                                </span>
                            </td>

                            <td>
                                ${actionHTML}
                            </td>

                        </tr>
                    `;
                })
                .join("");
    }

    /* =====================================================
       APPROVE TEACHER
    ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    ".approve-teacher"
                );

            if (!button) {
                return;
            }

            const currentUser =
                getCurrentUser();

            /* Only admin */

            if (
                !currentUser ||
                currentUser.role !== "ADMIN"
            ) {

                alert(
                    "Only an administrator can approve teachers."
                );

                return;
            }

            const teacherId =
                button.getAttribute(
                    "data-teacher-id"
                );

            const users = getUsers();

            const teacher =
                users.find(function (user) {

                    return user.id === teacherId;
                });

            if (!teacher) {

                alert(
                    "Teacher account not found."
                );

                return;
            }

            teacher.status = "ACTIVE";

            saveUsers(users);

            updateAdminTeacherTable();

            alert(
                "Teacher account approved successfully."
            );
        }
    );

    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    /* =====================================================
       MOBILE MENU
    ===================================================== */

    const mobileMenu = document.getElementById("mobileMenu");
    const sidebar = document.querySelector(".sidebar");

    if (mobileMenu && sidebar) {
        mobileMenu.addEventListener("click", function () {
            sidebar.classList.toggle("mobile-open");
        });

        document.addEventListener("click", function (event) {
            if (window.innerWidth > 650) {
                return;
            }

            if (
                sidebar.classList.contains("mobile-open") &&
                !sidebar.contains(event.target) &&
                event.target !== mobileMenu
            ) {
                sidebar.classList.remove("mobile-open");
            }
        });
    }

    /* =====================================================
       FRONTEND DEMO PAPER GENERATOR

       This makes the current static frontend usable before a
       Spring Boot + database + AI backend is connected.
       Replace this function later with an API call.
    ===================================================== */

    const generatePaperForm = document.getElementById("generatePaperForm");
    const generationResult = document.getElementById("generationResult");

    const demoQuestionBank = [
        { q: "What is a database management system?", marks: 2, difficulty: "EASY", type: "SHORT" },
        { q: "Define a primary key and explain its purpose.", marks: 2, difficulty: "EASY", type: "SHORT" },
        { q: "What is database normalization?", marks: 2, difficulty: "EASY", type: "SHORT" },
        { q: "What is a foreign key? Give one example.", marks: 2, difficulty: "EASY", type: "SHORT" },
        { q: "Differentiate between DELETE, DROP and TRUNCATE.", marks: 3, difficulty: "EASY", type: "SHORT" },
        { q: "Explain the ACID properties of database transactions.", marks: 5, difficulty: "MEDIUM", type: "LONG" },
        { q: "Explain first, second and third normal forms with examples.", marks: 5, difficulty: "MEDIUM", type: "LONG" },
        { q: "Explain different types of SQL joins with suitable examples.", marks: 5, difficulty: "MEDIUM", type: "LONG" },
        { q: "Explain transaction states and concurrency control techniques.", marks: 5, difficulty: "MEDIUM", type: "LONG" },
        { q: "Explain indexing and compare clustered and non-clustered indexes.", marks: 5, difficulty: "MEDIUM", type: "LONG" },
        { q: "Design a relational schema for a college examination system and identify its keys.", marks: 8, difficulty: "HARD", type: "LONG" },
        { q: "Analyze a transaction schedule and determine whether it is conflict serializable.", marks: 8, difficulty: "HARD", type: "NUMERICAL" },
        { q: "Explain B+ tree indexing and demonstrate an insertion sequence.", marks: 8, difficulty: "HARD", type: "NUMERICAL" },
        { q: "Write SQL queries to find the second-highest salary and department-wise averages.", marks: 8, difficulty: "HARD", type: "NUMERICAL" },
        { q: "Compare 2NF, 3NF and BCNF and explain a case where decomposition is required.", marks: 8, difficulty: "HARD", type: "LONG" }
    ];

    function shuffle(array) {
        const copy = array.slice();
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    function readNumber(id, fallback) {
        const element = document.getElementById(id);
        const value = Number(element ? element.value : fallback);
        return Number.isFinite(value) ? value : fallback;
    }

    function updateGenerationSummary() {
        const title = document.getElementById("paperTitle");
        const subject = document.getElementById("paperSubject");
        const marks = document.getElementById("totalMarks");
        const duration = document.getElementById("duration");
        const summaryTitle = document.getElementById("summaryTitle");
        const summaryDetails = document.getElementById("summaryDetails");

        if (summaryTitle && title) {
            summaryTitle.textContent = title.value.trim() || "Question Paper";
        }

        if (summaryDetails && subject && marks && duration) {
            summaryDetails.textContent =
                `${subject.value} • ${marks.value} Marks • ${duration.value}`;
        }
    }

    function validateDistribution() {
        const easy = readNumber("easyPercent", 0);
        const medium = readNumber("mediumPercent", 0);
        const hard = readNumber("hardPercent", 0);
        const total = easy + medium + hard;
        const message = document.getElementById("distributionMessage");

        if (message) {
            message.textContent = `Total: ${total}%`;
            message.style.color = total === 100 ? "#16a34a" : "#dc2626";
        }

        return total === 100;
    }

    function difficultyCount(total, percent) {
        return Math.round((total * percent) / 100);
    }

    function generateDemoPaper() {
        const title = document.getElementById("paperTitle")?.value.trim() || "Question Paper";
        const subject = document.getElementById("paperSubject")?.value || "Subject";
        const examType = document.getElementById("examType")?.value || "Examination";
        const marks = readNumber("totalMarks", 50);
        const duration = document.getElementById("duration")?.value || "3 Hours";
        const count = Math.max(1, Math.floor(readNumber("questionCount", 20)));

        const easy = readNumber("easyPercent", 30);
        const medium = readNumber("mediumPercent", 50);
        const hard = readNumber("hardPercent", 20);

        const requested = {
            EASY: difficultyCount(count, easy),
            MEDIUM: difficultyCount(count, medium),
            HARD: difficultyCount(count, hard)
        };

        let questions = [];
        ["EASY", "MEDIUM", "HARD"].forEach(function (difficulty) {
            const pool = shuffle(
                demoQuestionBank.filter(q => q.difficulty === difficulty)
            );
            questions.push(...pool.slice(0, requested[difficulty]));
        });

        if (questions.length < count) {
            const used = new Set(questions.map(q => q.q));
            const remaining = shuffle(
                demoQuestionBank.filter(q => !used.has(q.q))
            );
            questions.push(...remaining.slice(0, count - questions.length));
        }

        questions = questions.slice(0, count);

        const previewExamType = document.getElementById("previewExamType");
        const previewSubject = document.getElementById("previewSubject");
        const previewDuration = document.getElementById("previewDuration");
        const previewMarks = document.getElementById("previewMarks");

        if (previewExamType) previewExamType.textContent = `${examType} Examination`;
        if (previewSubject) previewSubject.textContent = subject;
        if (previewDuration) previewDuration.textContent = `Duration: ${duration}`;
        if (previewMarks) previewMarks.textContent = `Maximum Marks: ${marks}`;

        const heading = generationResult?.querySelector(".paper-heading strong");
        if (heading) heading.textContent = "GOVERNMENT COLLEGE OF ENGINEERING";

        const paperHeading = generationResult?.querySelector(".paper-heading");
        const existingQuestionNodes = generationResult?.querySelectorAll(".paper-preview > p");
        if (existingQuestionNodes) {
            existingQuestionNodes.forEach(node => node.remove());
        }

        const sectionA = generationResult?.querySelector(".paper-preview h4:nth-of-type(1)");
        const sectionB = generationResult?.querySelector(".paper-preview h4:nth-of-type(2)");

        if (sectionA && sectionB) {
            let anchor = sectionA.nextElementSibling;
            while (anchor && anchor !== sectionB) {
                const next = anchor.nextElementSibling;
                anchor.remove();
                anchor = next;
            }

            questions.forEach(function (item, index) {
                const p = document.createElement("p");
                p.textContent = `${index + 1}. ${item.q} [${item.marks}]`;
                if (index < Math.ceil(questions.length / 2)) {
                    sectionA.parentNode.insertBefore(p, sectionB);
                } else {
                    sectionB.parentNode.appendChild(p);
                }
            });
        }

        const generatedAt = new Date().toLocaleString();
        const paper = {
            id: `paper-${Date.now()}`,
            title,
            subject,
            examType,
            marks,
            duration,
            questionCount: questions.length,
            questions,
            generatedAt
        };

        localStorage.setItem("smart_qpg_last_generated_paper", JSON.stringify(paper));
        return paper;
    }

    if (generatePaperForm) {
        ["easyPercent", "mediumPercent", "hardPercent"].forEach(function (id) {
            const input = document.getElementById(id);
            if (input) input.addEventListener("input", validateDistribution);
        });

        ["paperTitle", "paperSubject", "totalMarks", "duration"].forEach(function (id) {
            const input = document.getElementById(id);
            if (input) input.addEventListener("input", updateGenerationSummary);
            if (input) input.addEventListener("change", updateGenerationSummary);
        });

        generatePaperForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!validateDistribution()) {
                alert("Easy + Medium + Hard must total exactly 100%.");
                return;
            }

            if (!generationResult) return;

            generateDemoPaper();
            generationResult.classList.remove("hidden");
            generationResult.scrollIntoView({ behavior: "smooth", block: "start" });
        });

        updateGenerationSummary();
        validateDistribution();
    }

    const saveGeneratedPaper = document.getElementById("saveGeneratedPaper");
    if (saveGeneratedPaper) {
        saveGeneratedPaper.addEventListener("click", function () {
            const paper = localStorage.getItem("smart_qpg_last_generated_paper");
            if (!paper) {
                alert("Generate a question paper first.");
                return;
            }

            const saved = JSON.parse(localStorage.getItem("smart_qpg_saved_papers") || "[]");
            saved.unshift(JSON.parse(paper));
            localStorage.setItem("smart_qpg_saved_papers", JSON.stringify(saved.slice(0, 50)));
            alert("Paper saved successfully in this browser.");
        });
    }

    const downloadGeneratedPaper = document.getElementById("downloadGeneratedPaper");
    if (downloadGeneratedPaper) {
        downloadGeneratedPaper.addEventListener("click", function () {
            if (!localStorage.getItem("smart_qpg_last_generated_paper")) {
                alert("Generate a question paper first.");
                return;
            }

            window.print();
        });
    }

    const reviewGeneratedPaper = document.getElementById("reviewGeneratedPaper");
    if (reviewGeneratedPaper) {
        reviewGeneratedPaper.addEventListener("click", function () {
            generationResult?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    }

    /* =====================================================
       INITIALIZE
    ===================================================== */

    initializeUsers();

    const currentUser =
        getCurrentUser();

    if (currentUser) {

        const users = getUsers();

        const validUser =
            users.find(function (user) {

                return (
                    user.id === currentUser.id &&
                    user.email === currentUser.email &&
                    user.role === currentUser.role
                );
            });

        if (validUser) {

            /*
               If teacher became pending/deactivated,
               don't allow an old session to remain active.
            */

            if (
                validUser.role === "TEACHER" &&
                validUser.status !== "ACTIVE"
            ) {

                clearSession();
                showLoginPage();

            } else {

                showApplication(
                    saveCurrentUser(validUser)
                );
            }

        } else {

            clearSession();
            showLoginPage();
        }

    } else {

        showLoginPage();
    }

});
// ================= NEXGENALIGN APP STATE & DATABASE =================

// Default Database Seed Data
const DEFAULT_DATABASE = {
    users: [
        // Admin
        {
            id: "u-admin",
            name: "System Admin",
            email: "admin@portal.com",
            password: "admin123",
            role: "admin",
            status: "active"
        },
        // Companies
        {
            id: "u-comp1",
            name: "CloudTech Solutions",
            email: "cloudtech@company.com",
            password: "company123",
            role: "company",
            industry: "Technology & Software",
            status: "active"
        },
        {
            id: "u-comp2",
            name: "Innovate Financials",
            email: "innovate@company.com",
            password: "company123",
            role: "company",
            industry: "Fintech & Banking",
            status: "active"
        },
        {
            id: "u-comp3",
            name: "Apex Healthcare",
            email: "apex@company.com",
            password: "company123",
            role: "company",
            industry: "Healthcare Systems",
            status: "active"
        },
        // Students
        {
            id: "u-stud1",
            name: "Alex Mercer",
            email: "alex@student.com",
            password: "student123",
            role: "student",
            skills: ["Python", "SQL", "Tableau", "Git", "Machine Learning"],
            degree: "B.Tech Computer Science",
            gradYear: "2027",
            bio: "Aspiring Data Scientist with strong analytical skills and experience building ML models.",
            status: "active"
        },
        {
            id: "u-stud2",
            name: "Jane Miller",
            email: "jane@student.com",
            password: "student123",
            role: "student",
            skills: ["JavaScript", "React", "HTML", "CSS", "Node.js", "GitHub"],
            degree: "M.C.A Systems Management",
            gradYear: "2026",
            bio: "Frontend Developer passionate about crafting elegant user experiences and pixel-perfect UIs.",
            status: "active"
        },
        {
            id: "u-stud3",
            name: "Sam Kaelen",
            email: "sam@student.com",
            password: "student123",
            role: "student",
            skills: ["Java", "Spring Boot", "MySQL", "Docker", "AWS", "Git"],
            degree: "B.E. Information Technology",
            gradYear: "2027",
            bio: "Backend enthusiast experienced in microservices architecture, cloud deployment, and system optimization.",
            status: "active"
        }
    ],
    jobs: [
        {
            id: "job-1",
            companyId: "u-comp1",
            companyName: "CloudTech Solutions",
            title: "Data Analyst Intern",
            description: "We are seeking a detail-oriented Data Analyst to interpret data and turn it into actionable insights. You will collaborate with engineering and business teams.",
            location: "Remote / Seattle",
            salary: "$4,500 - $6,000 / month",
            requiredSkills: ["Python", "SQL", "Tableau", "Excel"],
            createdDate: "2026-06-25",
            status: "active"
        },
        {
            id: "job-2",
            companyId: "u-comp1",
            companyName: "CloudTech Solutions",
            title: "Frontend React Developer",
            description: "Join our core interface team to build modern React panels. You will create highly accessible user interfaces with clean styling and fast loading times.",
            location: "Hybrid (Bangalore)",
            salary: "₹12,00,000 - ₹18,00,000 / annum",
            requiredSkills: ["React", "JavaScript", "HTML", "CSS", "Git"],
            createdDate: "2026-07-01",
            status: "active"
        },
        {
            id: "job-3",
            companyId: "u-comp2",
            companyName: "Innovate Financials",
            title: "Backend Java Engineer",
            description: "Seeking a Java Engineer to design high-throughput transaction processing systems. Experience with secure backend microservices and databases is critical.",
            location: "New York / On-Site",
            salary: "$90,000 - $110,000 / annum",
            requiredSkills: ["Java", "Spring Boot", "MySQL", "Docker"],
            createdDate: "2026-07-02",
            status: "active"
        },
        {
            id: "job-4",
            companyId: "u-comp3",
            companyName: "Apex Healthcare",
            title: "Cloud Infrastructure Specialist",
            description: "Manage and optimize cloud architecture deployments. Ensure maximum uptime and scale Kubernetes pods based on hospital networking demand patterns.",
            location: "Hybrid (Boston)",
            salary: "$85,000 - $105,000 / annum",
            requiredSkills: ["AWS", "Docker", "Kubernetes", "Linux", "Python"],
            createdDate: "2026-07-03",
            status: "active"
        }
    ],
    applications: [
        {
            id: "app-1",
            jobId: "job-2",
            studentId: "u-stud2",
            studentName: "Jane Miller",
            jobTitle: "Frontend React Developer",
            companyName: "CloudTech Solutions",
            status: "shortlisted",
            appliedDate: "2026-07-02"
        },
        {
            id: "app-2",
            jobId: "job-1",
            studentId: "u-stud1",
            studentName: "Alex Mercer",
            jobTitle: "Data Analyst Intern",
            companyName: "CloudTech Solutions",
            status: "pending",
            appliedDate: "2026-07-03"
        }
    ]
};

// State Variables
let db = {};
let currentUser = null;
let activeTab = "recommended-jobs"; // Default tab for student

// ================= LOCAL STORAGE MANAGER =================
function initDatabase() {
    const localData = localStorage.getItem("placement_portal_db");
    if (localData) {
        db = JSON.parse(localData);
    } else {
        db = DEFAULT_DATABASE;
        saveDatabase();
    }
}

function saveDatabase() {
    localStorage.setItem("placement_portal_db", JSON.stringify(db));
}

// ================= TOAST NOTIFICATION ENGINE =================
function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
    let iconClass = "fa-solid fa-circle-check";
    if (type === "error") iconClass = "fa-solid fa-circle-xmark";
    if (type === "warning") iconClass = "fa-solid fa-triangle-exclamation";

    toast.innerHTML = `
        <i class="${iconClass}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Smooth fade out and remove
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(50px)";
        toast.style.transition = "all 0.4s ease";
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// ================= AI MATCHING ENGINE =================
/**
 * Calculates AI Match score based on student skills and job requirements.
 * Jaccard algorithm matching is augmented with weight adjustments.
 */
function calculateAIMatch(studentSkills, requiredSkills) {
    if (!studentSkills || studentSkills.length === 0 || !requiredSkills || requiredSkills.length === 0) {
        return { score: 0, matched: [], missing: [] };
    }
    
    const sSkills = studentSkills.map(s => s.toLowerCase().trim());
    const rSkills = requiredSkills.map(r => r.toLowerCase().trim());
    
    const matched = [];
    const missing = [];
    
    rSkills.forEach((reqSkill, idx) => {
        if (sSkills.includes(reqSkill)) {
            matched.push(requiredSkills[idx]);
        } else {
            // Check for substring matches (e.g. "GitHub" inside "Git")
            const partialMatch = sSkills.find(s => s.includes(reqSkill) || reqSkill.includes(s));
            if (partialMatch) {
                matched.push(requiredSkills[idx]);
            } else {
                missing.push(requiredSkills[idx]);
            }
        }
    });
    
    // Percentage calculation
    const rawScore = (matched.length / requiredSkills.length) * 100;
    const score = Math.round(rawScore);
    
    return {
        score: score,
        matched: matched,
        missing: missing
    };
}

/**
 * Returns customized AI recommendations and reasoning phrases.
 */
function getAIExplanation(score, matched, missing) {
    if (score >= 80) {
        return `Excellent Fit! You match ${matched.length} out of ${matched.length + missing.length} key skills. You have a high probability of shortlisting.`;
    } else if (score >= 50) {
        return `Strong Match. You possess critical skills like [${matched.slice(0, 2).join(', ')}]. Consider learning [${missing.slice(0, 1).join(', ')}] to push your match rate further.`;
    } else if (score > 0) {
        return `Partial Match. Your skills in [${matched.join(', ')}] are valued, but this job strongly requests [${missing.slice(0, 2).join(', ')}].`;
    } else {
        return `Skills mismatch. This role requires programming competencies that are not currently in your active profile.`;
    }
}

// ================= AUTHENTICATION HANDLERS =================
function switchAuthTab(tab) {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const tabs = document.querySelectorAll(".tab-btn");
    
    if (tab === "login") {
        loginForm.classList.remove("hidden");
        registerForm.classList.add("hidden");
        tabs[0].classList.add("active");
        tabs[1].classList.remove("active");
    } else {
        loginForm.classList.add("hidden");
        registerForm.classList.remove("hidden");
        tabs[0].classList.remove("active");
        tabs[1].classList.add("active");
    }
}

function toggleRegFields(role) {
    const studentFields = document.getElementById("student-reg-fields");
    const companyFields = document.getElementById("company-reg-fields");
    const nameLabel = document.getElementById("label-reg-name");
    const nameInput = document.getElementById("reg-name");
    
    if (role === "student") {
        studentFields.classList.remove("hidden");
        companyFields.classList.add("hidden");
        nameLabel.innerHTML = '<i class="fa-solid fa-user"></i> Full Name';
        nameInput.placeholder = "John Doe";
    } else {
        studentFields.classList.add("hidden");
        companyFields.classList.remove("hidden");
        nameLabel.innerHTML = '<i class="fa-solid fa-building"></i> Company Name';
        nameInput.placeholder = "Tech Innovators Ltd";
    }
}

function fillDemo(role) {
    const emailInput = document.getElementById("login-email");
    const passInput = document.getElementById("login-password");
    
    if (role === "student") {
        emailInput.value = "jane@student.com";
        passInput.value = "student123";
    } else if (role === "company") {
        emailInput.value = "cloudtech@company.com";
        passInput.value = "company123";
    } else if (role === "admin") {
        emailInput.value = "admin@portal.com";
        passInput.value = "admin123";
    }
    
    showToast(`Filled credentials for pre-seeded ${role}!`, "success");
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById("login-email").value.trim().toLowerCase();
    const pass = document.getElementById("login-password").value;
    
    const user = db.users.find(u => u.email.toLowerCase() === email && u.password === pass);
    
    if (!user) {
        showToast("Invalid email or password combination.", "error");
        return;
    }
    
    if (user.status !== "active") {
        showToast("Your account has been suspended by the administrator.", "error");
        return;
    }
    
    currentUser = user;
    sessionStorage.setItem("current_user_session", JSON.stringify(user));
    
    showToast(`Welcome back, ${user.name}! Logged in successfully.`, "success");
    setupDashboard();
}

function handleRegister(event) {
    event.preventDefault();
    const role = document.querySelector('input[name="reg-role"]:checked').value;
    const name = document.getElementById("reg-name").value.trim();
    const email = document.getElementById("reg-email").value.trim().toLowerCase();
    const password = document.getElementById("reg-password").value;
    
    // Check if email already exists
    if (db.users.some(u => u.email.toLowerCase() === email)) {
        showToast("An account with this email address already exists.", "error");
        return;
    }
    
    if (password.length < 6) {
        showToast("Password must be at least 6 characters.", "warning");
        return;
    }
    
    const newUser = {
        id: "u-" + Date.now(),
        name,
        email,
        password,
        role,
        status: "active"
    };
    
    if (role === "student") {
        const skillsString = document.getElementById("reg-skills").value.trim();
        newUser.skills = skillsString ? skillsString.split(",").map(s => s.trim()).filter(s => s.length > 0) : [];
        newUser.degree = document.getElementById("reg-degree").value.trim() || "Unspecified Degree";
        newUser.gradYear = document.getElementById("reg-grad-year").value || "2027";
        newUser.bio = "High-performing student seeking career advancement.";
    } else if (role === "company") {
        newUser.industry = document.getElementById("reg-industry").value.trim() || "Technology";
    }
    
    db.users.push(newUser);
    saveDatabase();
    
    showToast("Registration successful! You can now log in.", "success");
    
    // Switch to login tab
    switchAuthTab("login");
    document.getElementById("login-email").value = email;
    document.getElementById("login-password").value = password;
}

function handleLogout() {
    currentUser = null;
    sessionStorage.removeItem("current_user_session");
    
    document.getElementById("auth-view").classList.remove("hidden");
    document.getElementById("dashboard-view").classList.add("hidden");
    
    document.getElementById("login-form").reset();
    document.getElementById("register-form").reset();
    
    showToast("Logged out successfully.", "info");
}

// ================= SIDEBAR & NAVIGATION SETUP =================
function setupDashboard() {
    // Hide auth page, show dashboard layout
    document.getElementById("auth-view").classList.add("hidden");
    document.getElementById("dashboard-view").classList.remove("hidden");
    
    // Populate profile details in sidebar
    document.getElementById("sidebar-user-name").innerText = currentUser.name;
    document.getElementById("sidebar-avatar").innerText = currentUser.name.charAt(0).toUpperCase();
    
    const roleBadge = document.getElementById("sidebar-user-role");
    roleBadge.innerText = currentUser.role.toUpperCase();
    roleBadge.className = `badge badge-${currentUser.role}`;
    
    // Setup Sidebar Menu links based on User Role
    const sidebarMenu = document.getElementById("sidebar-menu");
    sidebarMenu.innerHTML = "";
    
    let menuItems = [];
    if (currentUser.role === "student") {
        menuItems = [
            { id: "recommended-jobs", label: "AI Recommendations", icon: "fa-solid fa-brain" },
            { id: "search-jobs", label: "Search All Jobs", icon: "fa-solid fa-magnifying-glass" },
            { id: "student-applications", label: "My Applications", icon: "fa-solid fa-file-invoice" },
            { id: "student-profile", label: "My Profile", icon: "fa-solid fa-user-pen" }
        ];
        activeTab = "recommended-jobs";
    } else if (currentUser.role === "company") {
        menuItems = [
            { id: "post-job", label: "Post New Job", icon: "fa-solid fa-plus" },
            { id: "company-jobs", label: "Active Postings", icon: "fa-solid fa-briefcase" },
            { id: "company-applicants", label: "Applicants Review", icon: "fa-solid fa-users" }
        ];
        activeTab = "company-jobs";
    } else if (currentUser.role === "admin") {
        menuItems = [
            { id: "admin-analytics", label: "Portal Analytics", icon: "fa-solid fa-chart-line" },
            { id: "admin-users", label: "Manage Users", icon: "fa-solid fa-users-gear" },
            { id: "admin-jobs", label: "Manage Jobs", icon: "fa-solid fa-briefcase" }
        ];
        activeTab = "admin-analytics";
    }
    
    menuItems.forEach((item, idx) => {
        const li = document.createElement("li");
        li.className = `nav-item ${item.id === activeTab ? 'active' : ''}`;
        li.id = `nav-${item.id}`;
        li.onclick = () => switchTab(item.id);
        li.innerHTML = `<i class="${item.icon}"></i> ${item.label}`;
        sidebarMenu.appendChild(li);
    });
    
    // Update headers and render page content
    updateHeader();
    renderPageContent();
}

function switchTab(tabId) {
    document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));
    const activeNav = document.getElementById(`nav-${tabId}`);
    if (activeNav) activeNav.classList.add("active");
    
    activeTab = tabId;
    updateHeader();
    renderPageContent();
}

function updateHeader() {
    const welcomeTitle = document.getElementById("welcome-title");
    const welcomeSubtitle = document.getElementById("welcome-subtitle");
    const dateText = document.getElementById("current-date-time");
    
    dateText.innerHTML = `<i class="fa-regular fa-calendar-days"></i> ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    
    if (currentUser.role === "student") {
        welcomeTitle.innerText = `Hello, ${currentUser.name}!`;
        welcomeSubtitle.innerText = "Discover jobs crafted specifically around your tech stack.";
    } else if (currentUser.role === "company") {
        welcomeTitle.innerText = currentUser.name;
        welcomeSubtitle.innerText = `Industry: ${currentUser.industry} | Review applications and source applicants.`;
    } else {
        welcomeTitle.innerText = "Security Command Center";
        welcomeSubtitle.innerText = "Monitor portal health, audit postings, and verify user listings.";
    }
}

// ================= PAGE CONTAINER RENDERER =================
function renderPageContent() {
    const container = document.getElementById("page-content");
    container.innerHTML = ""; // Clear existing view
    
    switch (activeTab) {
        // STUDENT VIEWS
        case "recommended-jobs":
            renderRecommendedJobs(container);
            break;
        case "search-jobs":
            renderSearchJobs(container);
            break;
        case "student-applications":
            renderStudentApplications(container);
            break;
        case "student-profile":
            renderStudentProfile(container);
            break;
            
        // COMPANY VIEWS
        case "post-job":
            renderPostJob(container);
            break;
        case "company-jobs":
            renderCompanyJobs(container);
            break;
        case "company-applicants":
            renderCompanyApplicants(container);
            break;
            
        // ADMIN VIEWS
        case "admin-analytics":
            renderAdminAnalytics(container);
            break;
        case "admin-users":
            renderAdminUsers(container);
            break;
        case "admin-jobs":
            renderAdminJobs(container);
            break;
    }
}

// ================= STUDENT PAGE RENDERERS =================

function renderRecommendedJobs(container) {
    const activeJobs = db.jobs.filter(j => j.status === "active");
    
    // Run AI matcher for each job
    const rankedJobs = activeJobs.map(job => {
        const matchData = calculateAIMatch(currentUser.skills, job.requiredSkills);
        return {
            ...job,
            aiMatch: matchData
        };
    }).sort((a, b) => b.aiMatch.score - a.aiMatch.score); // Highest match first
    
    container.innerHTML = `
        <h2 class="section-title"><i class="fa-solid fa-brain"></i> Custom AI Job Alignments</h2>
        <p class="subtitle" style="margin-bottom:20px;">AI maps your skills dynamically against available job descriptions.</p>
        <div class="job-recommendations-list">
            ${rankedJobs.length === 0 ? `
                <div class="glass-panel" style="padding:40px; text-align:center;">
                    <i class="fa-solid fa-magnifying-glass" style="font-size:3rem; color:var(--text-muted); margin-bottom:15px;"></i>
                    <h3>No active jobs found</h3>
                    <p class="subtitle">Check back later or ask companies to post listings.</p>
                </div>
            ` : rankedJobs.map(job => {
                const matchClass = job.aiMatch.score >= 70 ? 'high-match' : '';
                const applied = db.applications.some(a => a.studentId === currentUser.id && a.jobId === job.id);
                
                // SVG Progress Dash Calculation
                const radius = 25;
                const circumference = 2 * Math.PI * radius;
                const dashoffset = circumference - (job.aiMatch.score / 100) * circumference;
                
                let strokeColor = "var(--color-primary)";
                if (job.aiMatch.score >= 80) strokeColor = "var(--color-success)";
                else if (job.aiMatch.score >= 50) strokeColor = "var(--color-accent)";
                else if (job.aiMatch.score > 0) strokeColor = "var(--color-warning)";
                else strokeColor = "var(--color-danger)";

                return `
                    <div class="job-card glass-panel ${matchClass}">
                        <div class="job-header-row">
                            <div class="job-meta-title">
                                <h3>${job.title}</h3>
                                <div class="company-name"><i class="fa-solid fa-building"></i> ${job.companyName}</div>
                            </div>
                            <div class="ai-score-indicator">
                                <div style="text-align: right;">
                                    <span class="badge" style="background:${strokeColor}22; color:${strokeColor}; border:1px solid ${strokeColor}55;">AI MATCH</span>
                                </div>
                                <div class="match-ring-wrapper">
                                    <svg class="match-ring-svg" width="60" height="60">
                                        <circle class="match-ring-bg" cx="30" cy="30" r="${radius}"></circle>
                                        <circle class="match-ring-progress" cx="30" cy="30" r="${radius}" 
                                            style="stroke:${strokeColor}; stroke-dasharray:${circumference}; stroke-dashoffset:${dashoffset};">
                                        </circle>
                                    </svg>
                                    <div class="match-ring-text" style="color:${strokeColor}">${job.aiMatch.score}%</div>
                                </div>
                            </div>
                        </div>
                        
                        <p style="font-size:0.9rem; line-height:1.5; color:var(--text-main);">${job.description}</p>
                        
                        <div class="job-details-row">
                            <span><i class="fa-solid fa-location-dot"></i> ${job.location}</span>
                            <span><i class="fa-solid fa-wallet"></i> ${job.salary}</span>
                            <span><i class="fa-regular fa-clock"></i> Posted: ${job.createdDate}</span>
                        </div>
                        
                        <div class="job-skills">
                            ${job.requiredSkills.map(skill => {
                                const isMatched = currentUser.skills.map(s => s.toLowerCase()).includes(skill.toLowerCase());
                                return `<span class="skill-tag ${isMatched ? 'matched' : 'missing'}">${skill}</span>`;
                            }).join('')}
                        </div>
                        
                        <div class="ai-recommendation-reasoning" style="border-color:${strokeColor}44; background:${strokeColor}05;">
                            <i class="fa-solid fa-robot" style="color:${strokeColor}"></i>
                            <p style="color:var(--text-main); font-weight: 500;">
                                ${getAIExplanation(job.aiMatch.score, job.aiMatch.matched, job.aiMatch.missing)}
                            </p>
                        </div>
                        
                        <div class="job-actions-row">
                            <button class="btn btn-secondary btn-sm" onclick="showJobDetailsModal('${job.id}')">Job Details</button>
                            ${applied ? `
                                <button class="btn btn-secondary btn-sm" disabled style="opacity:0.6;"><i class="fa-solid fa-circle-check" style="color:var(--color-success);"></i> Applied</button>
                            ` : `
                                <button class="btn btn-primary btn-sm" onclick="applyForJob('${job.id}')">Apply Now</button>
                            `}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function renderSearchJobs(container) {
    container.innerHTML = `
        <h2 class="section-title"><i class="fa-solid fa-magnifying-glass"></i> Job Search Board</h2>
        
        <!-- Search filters panel -->
        <div class="glass-panel" style="padding:20px; margin-bottom:20px;">
            <div class="grid-fields" style="grid-template-columns: 2fr 1fr 1fr; gap:15px; align-items: end;">
                <div class="input-group">
                    <label for="search-query"><i class="fa-solid fa-keyboard"></i> Search Jobs or Keywords</label>
                    <input type="text" id="search-query" placeholder="e.g. Developer, Python, Remote..." oninput="filterSearchJobs()">
                </div>
                <div class="input-group">
                    <label for="search-location"><i class="fa-solid fa-location-dot"></i> Location</label>
                    <select id="search-location" onchange="filterSearchJobs()">
                        <option value="">All Locations</option>
                        <option value="remote">Remote</option>
                        <option value="hybrid">Hybrid</option>
                        <option value="site">On-Site</option>
                    </select>
                </div>
                <div class="input-group">
                    <label for="search-sort"><i class="fa-solid fa-sort"></i> Sort By</label>
                    <select id="search-sort" onchange="filterSearchJobs()">
                        <option value="newest">Newest First</option>
                        <option value="highest-match">AI Match Score</option>
                    </select>
                </div>
            </div>
        </div>

        <div id="search-jobs-list-container" class="job-recommendations-list">
            <!-- Dynamically filtered lists here -->
        </div>
    `;
    
    filterSearchJobs(); // Run initial render
}

function filterSearchJobs() {
    const listContainer = document.getElementById("search-jobs-list-container");
    if (!listContainer) return;
    
    const query = document.getElementById("search-query").value.toLowerCase();
    const locationVal = document.getElementById("search-location").value.toLowerCase();
    const sortVal = document.getElementById("search-sort").value;
    
    let jobs = db.jobs.filter(j => j.status === "active");
    
    // Filtering
    if (query) {
        jobs = jobs.filter(j => 
            j.title.toLowerCase().includes(query) || 
            j.companyName.toLowerCase().includes(query) ||
            j.description.toLowerCase().includes(query) ||
            j.requiredSkills.some(s => s.toLowerCase().includes(query))
        );
    }
    
    if (locationVal) {
        jobs = jobs.filter(j => j.location.toLowerCase().includes(locationVal));
    }
    
    // Compute AI match details
    let ranked = jobs.map(job => {
        const matchData = calculateAIMatch(currentUser.skills, job.requiredSkills);
        return { ...job, aiMatch: matchData };
    });
    
    // Sorting
    if (sortVal === "highest-match") {
        ranked.sort((a, b) => b.aiMatch.score - a.aiMatch.score);
    } else {
        ranked.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
    }
    
    listContainer.innerHTML = ranked.length === 0 ? `
        <div class="glass-panel" style="padding:40px; text-align:center;">
            <i class="fa-solid fa-folder-open" style="font-size:3rem; color:var(--text-muted); margin-bottom:15px;"></i>
            <h3>No jobs match your search parameters</h3>
            <p class="subtitle">Try tweaking your search terms or filters.</p>
        </div>
    ` : ranked.map(job => {
        const applied = db.applications.some(a => a.studentId === currentUser.id && a.jobId === job.id);
        const radius = 25;
        const circumference = 2 * Math.PI * radius;
        const dashoffset = circumference - (job.aiMatch.score / 100) * circumference;
        
        let strokeColor = "var(--color-primary)";
        if (job.aiMatch.score >= 80) strokeColor = "var(--color-success)";
        else if (job.aiMatch.score >= 50) strokeColor = "var(--color-accent)";
        else if (job.aiMatch.score > 0) strokeColor = "var(--color-warning)";
        else strokeColor = "var(--color-danger)";

        return `
            <div class="job-card glass-panel">
                <div class="job-header-row">
                    <div class="job-meta-title">
                        <h3>${job.title}</h3>
                        <div class="company-name"><i class="fa-solid fa-building"></i> ${job.companyName}</div>
                    </div>
                    <div class="ai-score-indicator">
                        <div class="match-ring-wrapper">
                            <svg class="match-ring-svg" width="60" height="60">
                                <circle class="match-ring-bg" cx="30" cy="30" r="${radius}"></circle>
                                <circle class="match-ring-progress" cx="30" cy="30" r="${radius}" 
                                    style="stroke:${strokeColor}; stroke-dasharray:${circumference}; stroke-dashoffset:${dashoffset};">
                                </circle>
                            </svg>
                            <div class="match-ring-text" style="color:${strokeColor}">${job.aiMatch.score}%</div>
                        </div>
                    </div>
                </div>
                
                <p style="font-size:0.9rem; line-height:1.5; color:var(--text-main);">${job.description}</p>
                
                <div class="job-details-row">
                    <span><i class="fa-solid fa-location-dot"></i> ${job.location}</span>
                    <span><i class="fa-solid fa-wallet"></i> ${job.salary}</span>
                    <span><i class="fa-regular fa-clock"></i> Posted: ${job.createdDate}</span>
                </div>
                
                <div class="job-skills">
                    ${job.requiredSkills.map(skill => {
                        const isMatched = currentUser.skills.map(s => s.toLowerCase()).includes(skill.toLowerCase());
                        return `<span class="skill-tag ${isMatched ? 'matched' : 'missing'}">${skill}</span>`;
                    }).join('')}
                </div>
                
                <div class="job-actions-row">
                    <button class="btn btn-secondary btn-sm" onclick="showJobDetailsModal('${job.id}')">Job Details</button>
                    ${applied ? `
                        <button class="btn btn-secondary btn-sm" disabled style="opacity:0.6;"><i class="fa-solid fa-circle-check" style="color:var(--color-success);"></i> Applied</button>
                    ` : `
                        <button class="btn btn-primary btn-sm" onclick="applyForJob('${job.id}')">Apply Now</button>
                    `}
                </div>
            </div>
        `;
    }).join('');
}

function renderStudentApplications(container) {
    const apps = db.applications.filter(a => a.studentId === currentUser.id);
    
    container.innerHTML = `
        <h2 class="section-title"><i class="fa-solid fa-file-invoice"></i> My Applications Tracker</h2>
        <p class="subtitle" style="margin-bottom:20px;">Review active hiring status and interviews.</p>
        
        <div class="glass-panel" style="padding: 24px;">
            ${apps.length === 0 ? `
                <div style="text-align:center; padding:40px 0;">
                    <i class="fa-regular fa-folder-open" style="font-size:3rem; color:var(--text-muted); margin-bottom:15px;"></i>
                    <h3>No applications yet</h3>
                    <p class="subtitle">Browse recommended jobs and begin applying.</p>
                </div>
            ` : `
                <div class="admin-table-container">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>Role Title</th>
                                <th>Company</th>
                                <th>Applied Date</th>
                                <th>Hiring Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${apps.map(app => {
                                let statusClass = 'status-pending';
                                if (app.status === 'shortlisted') statusClass = 'status-shortlisted';
                                if (app.status === 'approved') statusClass = 'status-approved';
                                if (app.status === 'rejected') statusClass = 'status-rejected';
                                
                                return `
                                    <tr>
                                        <td><strong>${app.jobTitle}</strong></td>
                                        <td><span style="color:var(--color-accent); font-weight:500;">${app.companyName}</span></td>
                                        <td>${app.appliedDate}</td>
                                        <td><span class="applicant-status-badge ${statusClass}">${app.status}</span></td>
                                        <td>
                                            <button class="btn btn-secondary btn-sm" onclick="showJobDetailsModal('${app.jobId}')">View Details</button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            `}
        </div>
    `;
}

function renderStudentProfile(container) {
    container.innerHTML = `
        <h2 class="section-title"><i class="fa-solid fa-user-pen"></i> Manage Candidate Profile</h2>
        
        <div class="profile-layout">
            <!-- Left Side: Profile Summary -->
            <div class="profile-card glass-panel">
                <div class="profile-avatar-large">${currentUser.name.charAt(0).toUpperCase()}</div>
                <h2>${currentUser.name}</h2>
                <span class="badge badge-student" style="margin-bottom:15px;">Graduating ${currentUser.gradYear}</span>
                
                <div class="profile-details-list">
                    <div class="profile-detail-item">
                        <i class="fa-solid fa-envelope"></i>
                        <span>${currentUser.email}</span>
                    </div>
                    <div class="profile-detail-item">
                        <i class="fa-solid fa-award"></i>
                        <span>${currentUser.degree}</span>
                    </div>
                    <div class="profile-detail-item">
                        <i class="fa-solid fa-file-pdf"></i>
                        <span style="color:var(--color-accent); cursor:pointer;">Simulated_Resume.pdf</span>
                    </div>
                </div>
            </div>

            <!-- Right Side: Edit Form / Skills Management -->
            <div class="profile-form-panel glass-panel">
                <h3 style="margin-bottom:20px; font-family:var(--font-heading); border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:10px;">
                    Bio & Skill Matrix
                </h3>
                
                <form id="edit-profile-form" onsubmit="saveStudentProfile(event)">
                    <div class="input-group" style="margin-bottom: 20px;">
                        <label for="profile-bio"><i class="fa-solid fa-pencil"></i> Professional Summary</label>
                        <textarea id="profile-bio" rows="3" required placeholder="Tell companies about yourself...">${currentUser.bio || ''}</textarea>
                    </div>
                    
                    <div class="input-group" style="margin-bottom: 25px;">
                        <label><i class="fa-solid fa-code"></i> AI Matching Skill Tags (Click <i class="fa-solid fa-xmark"></i> to remove)</label>
                        <div class="skills-interactive-container">
                            <div class="current-skills-list" id="profile-skills-list">
                                <!-- Populated dynamically -->
                            </div>
                            
                            <div class="add-skill-form">
                                <input type="text" id="new-skill-input" placeholder="e.g. React, Node.js, Kubernetes" style="flex-grow:1; padding: 8px 12px; font-size:0.9rem;">
                                <button type="button" class="btn btn-accent btn-sm" onclick="addSkillToProfile()">Add Skill</button>
                            </div>
                        </div>
                    </div>
                    
                    <button type="submit" class="btn btn-primary">Save Changes</button>
                </form>
            </div>
        </div>
    `;
    
    renderSkillsChips();
}

function renderSkillsChips() {
    const list = document.getElementById("profile-skills-list");
    if (!list) return;
    
    list.innerHTML = "";
    if (currentUser.skills.length === 0) {
        list.innerHTML = `<span style="font-size:0.85rem; color:var(--text-muted); margin-bottom:10px;">No skills added yet. Add skills to get matches.</span>`;
        return;
    }
    
    currentUser.skills.forEach(skill => {
        const chip = document.createElement("span");
        chip.className = "skill-chip";
        chip.innerHTML = `
            ${skill} 
            <span class="remove-skill-btn" onclick="removeSkillFromProfile('${skill}')">&times;</span>
        `;
        list.appendChild(chip);
    });
}

function addSkillToProfile() {
    const input = document.getElementById("new-skill-input");
    const skill = input.value.trim();
    
    if (!skill) return;
    
    if (currentUser.skills.map(s => s.toLowerCase()).includes(skill.toLowerCase())) {
        showToast("Skill tag already exists in profile.", "warning");
        return;
    }
    
    currentUser.skills.push(skill);
    input.value = "";
    renderSkillsChips();
    
    // Auto-save to DB state
    const dbUserIdx = db.users.findIndex(u => u.id === currentUser.id);
    if (dbUserIdx !== -1) {
        db.users[dbUserIdx].skills = currentUser.skills;
        saveDatabase();
    }
    
    showToast(`Added skill "${skill}". AI suggestions updated in background!`, "success");
}

function removeSkillFromProfile(skill) {
    currentUser.skills = currentUser.skills.filter(s => s !== skill);
    renderSkillsChips();
    
    // Auto-save to DB state
    const dbUserIdx = db.users.findIndex(u => u.id === currentUser.id);
    if (dbUserIdx !== -1) {
        db.users[dbUserIdx].skills = currentUser.skills;
        saveDatabase();
    }
    
    showToast(`Removed skill "${skill}".`, "info");
}

function saveStudentProfile(event) {
    event.preventDefault();
    const bioText = document.getElementById("profile-bio").value.trim();
    
    currentUser.bio = bioText;
    
    const dbUserIdx = db.users.findIndex(u => u.id === currentUser.id);
    if (dbUserIdx !== -1) {
        db.users[dbUserIdx].bio = bioText;
        saveDatabase();
        showToast("Summary saved successfully.", "success");
    }
}

function applyForJob(jobId) {
    const job = db.jobs.find(j => j.id === jobId);
    if (!job) return;
    
    const newApp = {
        id: "app-" + Date.now(),
        jobId: jobId,
        studentId: currentUser.id,
        studentName: currentUser.name,
        jobTitle: job.title,
        companyName: job.companyName,
        status: "pending",
        appliedDate: new Date().toISOString().split('T')[0]
    };
    
    db.applications.push(newApp);
    saveDatabase();
    
    showToast(`Successfully applied to ${job.title}!`, "success");
    renderPageContent(); // Re-render current page to update button states
}

// ================= COMPANY PAGE RENDERERS =================

function renderPostJob(container) {
    container.innerHTML = `
        <h2 class="section-title"><i class="fa-solid fa-plus"></i> Post a New Job Listing</h2>
        <p class="subtitle" style="margin-bottom:20px;">Provide requirements and let our AI algorithm match candidates.</p>
        
        <div class="glass-panel" style="max-width: 700px; padding:30px;">
            <form onsubmit="handlePostJob(event)">
                <div class="input-group" style="margin-bottom: 20px;">
                    <label for="job-title"><i class="fa-solid fa-briefcase"></i> Job Title</label>
                    <input type="text" id="job-title" required placeholder="e.g. Graduate software developer">
                </div>
                
                <div class="input-group" style="margin-bottom: 20px;">
                    <label for="job-desc"><i class="fa-solid fa-align-left"></i> Job Description</label>
                    <textarea id="job-desc" rows="4" required placeholder="Provide day-to-day duties and company expectations..."></textarea>
                </div>
                
                <div class="grid-fields" style="margin-bottom: 20px;">
                    <div class="input-group">
                        <label for="job-location"><i class="fa-solid fa-location-dot"></i> Location</label>
                        <input type="text" id="job-location" required placeholder="e.g. Remote / Bangalore">
                    </div>
                    <div class="input-group">
                        <label for="job-salary"><i class="fa-solid fa-wallet"></i> Salary Range / Stipend</label>
                        <input type="text" id="job-salary" required placeholder="e.g. $80k - $100k / year">
                    </div>
                </div>
                
                <div class="input-group" style="margin-bottom: 25px;">
                    <label for="job-skills-req"><i class="fa-solid fa-code"></i> Required Skills (Comma Separated)</label>
                    <input type="text" id="job-skills-req" required placeholder="e.g. Python, SQL, Git (AI matches based on these tags)">
                </div>
                
                <button type="submit" class="btn btn-primary">Create Job Posting</button>
            </form>
        </div>
    `;
}

function handlePostJob(event) {
    event.preventDefault();
    const title = document.getElementById("job-title").value.trim();
    const description = document.getElementById("job-desc").value.trim();
    const location = document.getElementById("job-location").value.trim();
    const salary = document.getElementById("job-salary").value.trim();
    const skillsString = document.getElementById("job-skills-req").value.trim();
    
    const requiredSkills = skillsString ? skillsString.split(",").map(s => s.trim()).filter(s => s.length > 0) : [];
    
    const newJob = {
        id: "job-" + Date.now(),
        companyId: currentUser.id,
        companyName: currentUser.name,
        title,
        description,
        location,
        salary,
        requiredSkills,
        createdDate: new Date().toISOString().split('T')[0],
        status: "active"
    };
    
    db.jobs.push(newJob);
    saveDatabase();
    
    showToast(`Successfully posted job listing for ${title}!`, "success");
    switchTab("company-jobs");
}

function renderCompanyJobs(container) {
    const activeJobs = db.jobs.filter(j => j.companyId === currentUser.id && j.status === "active");
    
    container.innerHTML = `
        <h2 class="section-title"><i class="fa-solid fa-briefcase"></i> Active Job Listings</h2>
        <p class="subtitle" style="margin-bottom:20px;">Monitor posted roles and candidates matching them.</p>
        
        <div class="job-recommendations-list">
            ${activeJobs.length === 0 ? `
                <div class="glass-panel" style="padding:40px; text-align:center;">
                    <i class="fa-regular fa-folder-open" style="font-size:3rem; color:var(--text-muted); margin-bottom:15px;"></i>
                    <h3>No active postings</h3>
                    <p class="subtitle" style="margin-bottom:15px;">You haven't posted any jobs yet.</p>
                    <button class="btn btn-accent btn-sm" onclick="switchTab('post-job')">Post a Job now</button>
                </div>
            ` : activeJobs.map(job => {
                const totalApplicants = db.applications.filter(a => a.jobId === job.id).length;
                
                return `
                    <div class="job-card glass-panel">
                        <div class="job-header-row">
                            <div class="job-meta-title">
                                <h3>${job.title}</h3>
                                <div class="company-name"><i class="fa-regular fa-calendar-days"></i> Posted: ${job.createdDate}</div>
                            </div>
                            <div>
                                <span class="badge badge-student">${totalApplicants} Applicants</span>
                            </div>
                        </div>
                        
                        <p style="font-size:0.9rem; line-height:1.5; color:var(--text-muted);">${job.description}</p>
                        
                        <div class="job-details-row">
                            <span><i class="fa-solid fa-location-dot"></i> ${job.location}</span>
                            <span><i class="fa-solid fa-wallet"></i> ${job.salary}</span>
                        </div>
                        
                        <div class="job-skills">
                            ${job.requiredSkills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                        </div>
                        
                        <div class="job-actions-row">
                            <button class="btn btn-secondary btn-sm" onclick="showCompanyMatchedTalentModal('${job.id}')">
                                <i class="fa-solid fa-wand-magic-sparkles"></i> AI Sourced Talent
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="archiveCompanyJob('${job.id}')">Archive Job</button>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function archiveCompanyJob(jobId) {
    const jobIdx = db.jobs.findIndex(j => j.id === jobId);
    if (jobIdx !== -1) {
        db.jobs[jobIdx].status = "archived";
        saveDatabase();
        showToast("Job archived and removed from active search.", "info");
        renderPageContent();
    }
}

function renderCompanyApplicants(container) {
    // Get all jobs for current company
    const companyJobIds = db.jobs.filter(j => j.companyId === currentUser.id).map(j => j.id);
    
    // Get applications to these jobs
    const applications = db.applications.filter(a => companyJobIds.includes(a.jobId));
    
    container.innerHTML = `
        <h2 class="section-title"><i class="fa-solid fa-users"></i> Applicants Review Center</h2>
        <p class="subtitle" style="margin-bottom:20px;">Review applied students and matching indexes.</p>
        
        <div class="glass-panel" style="padding:24px;">
            ${applications.length === 0 ? `
                <div style="text-align:center; padding:40px 0;">
                    <i class="fa-regular fa-folder-open" style="font-size:3rem; color:var(--text-muted); margin-bottom:15px;"></i>
                    <h3>No candidates applied yet</h3>
                    <p class="subtitle">Candidates will show up here once they apply.</p>
                </div>
            ` : `
                <div class="applicant-list">
                    ${applications.map(app => {
                        const student = db.users.find(u => u.id === app.studentId);
                        const job = db.jobs.find(j => j.id === app.jobId);
                        
                        if (!student || !job) return ''; // Safeguard
                        
                        // Dynamically calculate AI Match score for the applicant on this job!
                        const ai = calculateAIMatch(student.skills, job.requiredSkills);
                        
                        let strokeColor = "var(--color-primary)";
                        if (ai.score >= 80) strokeColor = "var(--color-success)";
                        else if (ai.score >= 50) strokeColor = "var(--color-accent)";
                        else if (ai.score > 0) strokeColor = "var(--color-warning)";
                        else strokeColor = "var(--color-danger)";

                        let statusClass = 'status-pending';
                        if (app.status === 'shortlisted') statusClass = 'status-shortlisted';
                        if (app.status === 'approved') statusClass = 'status-approved';
                        if (app.status === 'rejected') statusClass = 'status-rejected';

                        return `
                            <div class="applicant-card glass-panel" style="background:rgba(255,255,255,0.02)">
                                <div class="applicant-profile-summary">
                                    <div class="applicant-avatar">${student.name.charAt(0).toUpperCase()}</div>
                                    <div class="applicant-meta">
                                        <h4>${student.name}</h4>
                                        <p style="margin: 4px 0;"><span style="color:var(--color-accent)">Applied to:</span> <strong>${app.jobTitle}</strong></p>
                                        <p style="font-size:0.8rem; color:var(--text-muted);"><i class="fa-solid fa-award"></i> ${student.degree} | Grad: ${student.gradYear}</p>
                                    </div>
                                </div>
                                
                                <div class="applicant-ai-badge" style="text-align: center; border-left:1px solid rgba(255,255,255,0.06); border-right:1px solid rgba(255,255,255,0.06); padding:0 20px;">
                                    <span style="font-size:0.75rem; color:var(--text-muted); display:block; margin-bottom:4px;">AI MATCH</span>
                                    <span style="font-size:1.4rem; font-weight:800; font-family:var(--font-heading); color:${strokeColor};">${ai.score}%</span>
                                </div>

                                <div style="display:flex; flex-direction:column; gap:6px; align-items:flex-end;">
                                    <div style="margin-bottom:8px;">
                                        <span class="applicant-status-badge ${statusClass}">${app.status}</span>
                                    </div>
                                    <div style="display:flex; gap:8px;">
                                        <button class="btn btn-secondary btn-sm" onclick="showStudentResumeModal('${student.id}')">View Profile</button>
                                        
                                        ${app.status === 'pending' ? `
                                            <button class="btn btn-accent btn-sm" onclick="updateApplicationStatus('${app.id}', 'shortlisted')">Shortlist</button>
                                        ` : ''}
                                        
                                        ${app.status !== 'approved' && app.status !== 'rejected' ? `
                                            <button class="btn btn-primary btn-sm" onclick="updateApplicationStatus('${app.id}', 'approved')"><i class="fa-solid fa-check"></i> Hire</button>
                                            <button class="btn btn-danger btn-sm" style="padding:6px 10px;" onclick="updateApplicationStatus('${app.id}', 'rejected')"><i class="fa-solid fa-xmark"></i></button>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `}
        </div>
    `;
}

function updateApplicationStatus(appId, newStatus) {
    const appIdx = db.applications.findIndex(a => a.id === appId);
    if (appIdx !== -1) {
        db.applications[appIdx].status = newStatus;
        saveDatabase();
        
        let msg = `Candidate status updated to ${newStatus}.`;
        if (newStatus === 'approved') msg = `Congratulations! Candidate has been hired.`;
        
        showToast(msg, "success");
        renderPageContent();
    }
}

// ================= ADMIN VIEW PANEL RENDERERS =================

function renderAdminAnalytics(container) {
    const studentsCount = db.users.filter(u => u.role === "student").length;
    const companiesCount = db.users.filter(u => u.role === "company").length;
    const activeJobs = db.jobs.filter(j => j.status === "active").length;
    
    // Placements rate calculation
    const totalApps = db.applications.length;
    const approvedApps = db.applications.filter(a => a.status === "approved").length;
    const placementRate = totalApps > 0 ? Math.round((approvedApps / totalApps) * 100) : 0;
    
    container.innerHTML = `
        <h2 class="section-title"><i class="fa-solid fa-chart-line"></i> Dashboard Analytics</h2>
        <p class="subtitle" style="margin-bottom:20px;">Global metrics and application processing health.</p>
        
        <!-- Stats cards row -->
        <div class="dashboard-grid">
            <div class="stat-card glass-panel">
                <div class="stat-content">
                    <h3>Total Candidates</h3>
                    <div class="number">${studentsCount}</div>
                </div>
                <div class="stat-icon blue"><i class="fa-solid fa-user-graduate"></i></div>
            </div>
            
            <div class="stat-card glass-panel">
                <div class="stat-content">
                    <h3>Active Employers</h3>
                    <div class="number">${companiesCount}</div>
                </div>
                <div class="stat-icon purple"><i class="fa-solid fa-briefcase"></i></div>
            </div>
            
            <div class="stat-card glass-panel">
                <div class="stat-content">
                    <h3>Open Job Roles</h3>
                    <div class="number">${activeJobs}</div>
                </div>
                <div class="stat-icon cyan"><i class="fa-solid fa-clipboard-list"></i></div>
            </div>
            
            <div class="stat-card glass-panel">
                <div class="stat-content">
                    <h3>Hiring Rate</h3>
                    <div class="number">${placementRate}%</div>
                </div>
                <div class="stat-icon green"><i class="fa-solid fa-circle-check"></i></div>
            </div>
        </div>

        <div class="grid-fields" style="grid-template-columns: 2fr 1fr; gap:20px;">
            <!-- PLACEMENTS CHART -->
            <div class="glass-panel" style="padding:24px;">
                <h3 style="margin-bottom:15px; font-family:var(--font-heading);"><i class="fa-solid fa-chart-bar" style="color:var(--color-primary);"></i> Job Postings by Domain</h3>
                <div class="chart-container" id="admin-chart-bars">
                    <!-- Loaded dynamically via JS -->
                </div>
            </div>
            
            <!-- SYSTEM STATS SUMMARY -->
            <div class="glass-panel" style="padding:24px; display:flex; flex-direction:column; justify-content:space-between;">
                <div>
                    <h3 style="margin-bottom:15px; font-family:var(--font-heading);"><i class="fa-solid fa-server" style="color:var(--color-accent);"></i> Portal Auditing</h3>
                    <ul style="list-style:none; display:flex; flex-direction:column; gap:12px; font-size:0.9rem;">
                        <li style="display:flex; justify-content:space-between;">
                            <span style="color:var(--text-muted);">Database Size:</span>
                            <strong>${(JSON.stringify(db).length / 1024).toFixed(2)} KB</strong>
                        </li>
                        <li style="display:flex; justify-content:space-between;">
                            <span style="color:var(--text-muted);">Submitted Applications:</span>
                            <strong>${totalApps}</strong>
                        </li>
                        <li style="display:flex; justify-content:space-between;">
                            <span style="color:var(--text-muted);">Shortlisted Candidates:</span>
                            <strong>${db.applications.filter(a => a.status === "shortlisted").length}</strong>
                        </li>
                        <li style="display:flex; justify-content:space-between;">
                            <span style="color:var(--text-muted);">Active Placements:</span>
                            <strong>${approvedApps}</strong>
                        </li>
                    </ul>
                </div>
                
                <div style="border-top:1px solid rgba(255,255,255,0.06); padding-top:15px; margin-top:15px; text-align:center;">
                    <span style="font-size:0.75rem; color:var(--text-muted);">Systems operational | NexGenAlign AI Engine 2.0</span>
                </div>
            </div>
        </div>
    `;
    
    renderAdminChart();
}

function renderAdminChart() {
    const barsContainer = document.getElementById("admin-chart-bars");
    if (!barsContainer) return;
    
    // Group jobs by domain/category tag matches
    const domains = [
        { label: "Frontend", tags: ["react", "javascript", "html", "css", "vue"] },
        { label: "Backend", tags: ["java", "spring", "node", "express", "sql", "mysql"] },
        { label: "Python/AI", tags: ["python", "machine", "learning", "data", "tableau"] },
        { label: "Cloud/DevOps", tags: ["aws", "docker", "kubernetes", "cloud", "linux"] }
    ];
    
    const counts = domains.map(d => {
        let count = 0;
        db.jobs.forEach(job => {
            const allText = (job.title + " " + job.requiredSkills.join(" ")).toLowerCase();
            if (d.tags.some(tag => allText.includes(tag))) {
                count++;
            }
        });
        return { label: d.label, count: count };
    });
    
    // Calculate heights relative to max
    const maxVal = Math.max(...counts.map(c => c.count), 1);
    
    barsContainer.innerHTML = counts.map(item => {
        const pctHeight = (item.count / maxVal) * 100;
        return `
            <div class="chart-bar-wrapper">
                <div class="chart-bar" style="height:${pctHeight}%" data-val="${item.count}"></div>
                <div class="chart-label">${item.label}</div>
            </div>
        `;
    }).join('');
}

function renderAdminUsers(container) {
    // List all users except current admin
    const users = db.users.filter(u => u.id !== currentUser.id);
    
    container.innerHTML = `
        <h2 class="section-title"><i class="fa-solid fa-users-gear"></i> Manage Portal User Credentials</h2>
        <p class="subtitle" style="margin-bottom:20px;">Review registry files and suspend/activate accounts.</p>
        
        <div class="glass-panel" style="padding:24px;">
            <div class="admin-table-container">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th>Email Address</th>
                            <th>Platform Role</th>
                            <th>Database ID</th>
                            <th>Status Badge</th>
                            <th>Control Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${users.map(user => {
                            let roleClass = 'badge-student';
                            if (user.role === 'company') roleClass = 'badge-company';
                            if (user.role === 'admin') roleClass = 'badge-admin';
                            
                            return `
                                <tr>
                                    <td><strong>${user.name}</strong></td>
                                    <td>${user.email}</td>
                                    <td><span class="badge ${roleClass}">${user.role.toUpperCase()}</span></td>
                                    <td><code style="font-size:0.8rem; color:var(--text-muted);">${user.id}</code></td>
                                    <td>
                                        <span class="badge" style="background:${user.status === 'active' ? 'var(--color-success)' : 'var(--color-danger)'}15; 
                                            color:${user.status === 'active' ? 'var(--color-success)' : 'var(--color-danger)'}; 
                                            border:1px solid ${user.status === 'active' ? 'var(--color-success)' : 'var(--color-danger)'}40;">
                                            ${user.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>
                                        <button class="btn ${user.status === 'active' ? 'btn-danger' : 'btn-accent'} btn-sm" onclick="toggleUserStatus('${user.id}')">
                                            ${user.status === 'active' ? 'Suspend' : 'Activate'}
                                        </button>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function toggleUserStatus(userId) {
    const userIdx = db.users.findIndex(u => u.id === userId);
    if (userIdx !== -1) {
        const currentStatus = db.users[userIdx].status;
        const nextStatus = currentStatus === "active" ? "suspended" : "active";
        
        db.users[userIdx].status = nextStatus;
        saveDatabase();
        
        showToast(`User status updated to ${nextStatus.toUpperCase()}.`, "info");
        renderPageContent();
    }
}

function renderAdminJobs(container) {
    const jobs = db.jobs;
    
    container.innerHTML = `
        <h2 class="section-title"><i class="fa-solid fa-briefcase"></i> Global Job Auditor Panel</h2>
        <p class="subtitle" style="margin-bottom:20px;">Review job requirements or remove listings manually.</p>
        
        <div class="glass-panel" style="padding:24px;">
            ${jobs.length === 0 ? `
                <div style="text-align:center; padding:40px 0;">
                    <i class="fa-regular fa-folder-open" style="font-size:3rem; color:var(--text-muted); margin-bottom:15px;"></i>
                    <h3>No listings found</h3>
                </div>
            ` : `
                <div class="admin-table-container">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>Role Title</th>
                                <th>Employer Name</th>
                                <th>Location</th>
                                <th>Compensation</th>
                                <th>Requirements</th>
                                <th>Auditing Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${jobs.map(job => {
                                return `
                                    <tr>
                                        <td><strong>${job.title}</strong> ${job.status !== 'active' ? '<span class="badge badge-danger">Archived</span>' : ''}</td>
                                        <td><span style="color:var(--color-accent); font-weight:500;">${job.companyName}</span></td>
                                        <td>${job.location}</td>
                                        <td>${job.salary}</td>
                                        <td><span style="font-size:0.8rem; color:var(--text-muted);">${job.requiredSkills.join(', ')}</span></td>
                                        <td>
                                            <button class="btn btn-danger btn-sm" onclick="adminDeleteJob('${job.id}')">
                                                <i class="fa-solid fa-trash-can"></i> Delete
                                            </button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            `}
        </div>
    `;
}

function adminDeleteJob(jobId) {
    const index = db.jobs.findIndex(j => j.id === jobId);
    if (index !== -1) {
        const title = db.jobs[index].title;
        db.jobs.splice(index, 1);
        
        // Also remove applications associated with this job
        db.applications = db.applications.filter(a => a.jobId !== jobId);
        
        saveDatabase();
        showToast(`Auditor deleted listing: ${title}`, "warning");
        renderPageContent();
    }
}

// ================= DYNAMIC MODALS MANAGEMENT =================
function closeModal() {
    const modal = document.getElementById("modal-container");
    modal.classList.remove("active");
    setTimeout(() => {
        modal.innerHTML = "";
        modal.classList.add("hidden");
    }, 300);
}

function openModal(contentHtml) {
    const modal = document.getElementById("modal-container");
    modal.innerHTML = `
        <div class="modal-content glass-panel">
            <button class="modal-close-btn" onclick="closeModal()">&times;</button>
            ${contentHtml}
        </div>
    `;
    modal.classList.remove("hidden");
    // Small delay to allow CSS transitions
    setTimeout(() => {
        modal.classList.add("active");
    }, 10);
}

function showJobDetailsModal(jobId) {
    const job = db.jobs.find(j => j.id === jobId);
    if (!job) return;
    
    let matchHtml = '';
    if (currentUser.role === 'student') {
        const ai = calculateAIMatch(currentUser.skills, job.requiredSkills);
        const strokeColor = ai.score >= 80 ? "var(--color-success)" : ai.score >= 50 ? "var(--color-accent)" : "var(--color-warning)";
        matchHtml = `
            <div class="ai-recommendation-reasoning" style="margin-top:20px; border-color:${strokeColor}44; background:${strokeColor}05;">
                <i class="fa-solid fa-robot" style="color:${strokeColor}"></i>
                <div>
                    <h4 style="margin-bottom:4px; color:white;">AI Recommendation Summary</h4>
                    <p style="font-size:0.85rem; color:var(--text-main);">${getAIExplanation(ai.score, ai.matched, ai.missing)}</p>
                </div>
            </div>
        `;
    }

    const html = `
        <h2 style="font-family:var(--font-heading); margin-bottom:5px; color:white;">${job.title}</h2>
        <h4 style="color:var(--color-accent); font-weight:500; margin-bottom:20px;"><i class="fa-solid fa-building"></i> ${job.companyName}</h4>
        
        <div style="max-height: 350px; overflow-y:auto; padding-right:10px;">
            <p style="font-size:0.95rem; line-height:1.6; color:var(--text-main); margin-bottom:20px;">${job.description}</p>
            
            <div class="grid-fields" style="margin-bottom:20px;">
                <div class="glass-panel" style="padding:12px; background:rgba(255,255,255,0.02)">
                    <span style="font-size:0.75rem; color:var(--text-muted); display:block;">COMPENSATION</span>
                    <strong>${job.salary}</strong>
                </div>
                <div class="glass-panel" style="padding:12px; background:rgba(255,255,255,0.02)">
                    <span style="font-size:0.75rem; color:var(--text-muted); display:block;">LOCATION</span>
                    <strong>${job.location}</strong>
                </div>
            </div>
            
            <h4 style="margin-bottom:10px; color:white;">Skills Required</h4>
            <div class="job-skills" style="margin-bottom:20px;">
                ${job.requiredSkills.map(skill => `<span class="skill-tag matched">${skill}</span>`).join('')}
            </div>
            
            ${matchHtml}
        </div>
    `;
    
    openModal(html);
}

function showStudentResumeModal(studentId) {
    const student = db.users.find(u => u.id === studentId);
    if (!student) return;
    
    const html = `
        <div style="text-align:center; margin-bottom:20px;">
            <div class="profile-avatar-large" style="width:70px; height:70px; font-size:1.8rem; line-height:70px; margin-bottom:10px;">
                ${student.name.charAt(0).toUpperCase()}
            </div>
            <h2 style="font-family:var(--font-heading); color:white; margin:0;">${student.name}</h2>
            <span class="badge badge-student">${student.degree} | Grad: ${student.gradYear}</span>
        </div>
        
        <div style="max-height:300px; overflow-y:auto;">
            <h4 style="color:white; margin-bottom:8px; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:4px;">
                Professional Bio Summary
            </h4>
            <p style="font-size:0.9rem; line-height:1.5; color:var(--text-main); margin-bottom:20px;">
                ${student.bio || 'Candidate has not updated their bio summary.'}
            </p>
            
            <h4 style="color:white; margin-bottom:10px;">Technical Competencies</h4>
            <div class="job-skills" style="margin-bottom:20px;">
                ${student.skills.map(skill => `<span class="skill-tag matched">${skill}</span>`).join('')}
            </div>
            
            <h4 style="color:white; margin-bottom:8px; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:4px;">
                Contact Details
            </h4>
            <p style="font-size:0.9rem; color:var(--text-muted);">
                <i class="fa-regular fa-envelope"></i> Email: <a href="mailto:${student.email}" style="color:var(--color-accent);">${student.email}</a>
            </p>
        </div>
    `;
    
    openModal(html);
}

function showCompanyMatchedTalentModal(jobId) {
    const job = db.jobs.find(j => j.id === jobId);
    if (!job) return;
    
    const students = db.users.filter(u => u.role === "student" && u.status === "active");
    
    // Sort all students by their AI Match score for this job!
    const matches = students.map(stud => {
        const ai = calculateAIMatch(stud.skills, job.requiredSkills);
        return { student: stud, ai };
    }).sort((a, b) => b.ai.score - a.ai.score);

    const html = `
        <h3 style="font-family:var(--font-heading); color:white; margin-bottom:4px;"><i class="fa-solid fa-wand-magic-sparkles" style="color:var(--color-accent);"></i> AI-Sourced Recommendations</h3>
        <p class="subtitle" style="margin-bottom:20px;">Our machine algorithm has evaluated and ranked students that fit "${job.title}".</p>
        
        <div style="max-height:350px; overflow-y:auto; padding-right:8px;">
            <div class="applicant-list">
                ${matches.map(m => {
                    const hasApplied = db.applications.some(a => a.studentId === m.student.id && a.jobId === job.id);
                    
                    let strokeColor = "var(--color-primary)";
                    if (m.ai.score >= 80) strokeColor = "var(--color-success)";
                    else if (m.ai.score >= 50) strokeColor = "var(--color-accent)";
                    else if (m.ai.score > 0) strokeColor = "var(--color-warning)";
                    else strokeColor = "var(--color-danger)";

                    return `
                        <div class="glass-panel" style="padding:15px; display:flex; align-items:center; justify-content:space-between; gap:10px; background:rgba(255,255,255,0.01);">
                            <div>
                                <h4 style="color:white;">${m.student.name}</h4>
                                <span style="font-size:0.75rem; color:var(--text-muted);"><i class="fa-solid fa-award"></i> ${m.student.degree}</span>
                            </div>
                            <div style="text-align:center;">
                                <span style="font-size:0.75rem; color:var(--text-muted); display:block;">MATCH INDEX</span>
                                <span style="font-size:1.1rem; font-weight:800; font-family:var(--font-heading); color:${strokeColor};">${m.ai.score}%</span>
                            </div>
                            <div>
                                ${hasApplied ? `
                                    <span class="badge badge-student" style="opacity:0.8;">Applied</span>
                                ` : `
                                    <button class="btn btn-accent btn-sm" onclick="closeModal(); inviteCandidateToApply('${m.student.id}', '${job.id}')">
                                        Invite
                                    </button>
                                `}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
    
    openModal(html);
}

function inviteCandidateToApply(studentId, jobId) {
    const student = db.users.find(u => u.id === studentId);
    const job = db.jobs.find(j => j.id === jobId);
    
    if (student && job) {
        showToast(`Sent application invitation to ${student.name} for the position ${job.title}!`, "success");
    }
}

// ================= APP LIFECYCLE INITIALIZER =================
window.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize State
    initDatabase();
    
    // 2. Check Session Persistence
    const activeSession = sessionStorage.getItem("current_user_session");
    if (activeSession) {
        const cachedUser = JSON.parse(activeSession);
        // Refresh local memory pointer from DB (in case of updates)
        currentUser = db.users.find(u => u.id === cachedUser.id);
        if (currentUser) {
            setupDashboard();
            return;
        }
    }
    
    // Default: Show Login Panel
    document.getElementById("auth-view").classList.remove("hidden");
    document.getElementById("dashboard-view").classList.add("hidden");
});

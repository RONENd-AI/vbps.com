const appDiv = document.getElementById('app');

window.nextRegStep = function(step) {
    const s1 = document.getElementById('reg-step-1');
    const s2 = document.getElementById('reg-step-2');
    const s3 = document.getElementById('reg-step-3');
    if(s1) s1.style.display = 'none';
    if(s2) s2.style.display = 'none';
    if(s3) s3.style.display = 'none';
    const target = document.getElementById('reg-step-' + step);
    if(target) target.style.display = 'block';
};

function getTodayStr() {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
}

// ------------------- UI COMPONENTS -------------------

function renderNavbar(user) {
    const roleColors = { admin: '#DC2626', teacher: '#059669', student: '#2563EB' };
    return `
        <nav class="nav-bar">
            <div class="nav-brand">Vidya's Balvatika</div>
            <div class="user-controls">
                <div style="text-align: right; line-height:1.2;">
                    <div style="font-weight:700; font-family:var(--font-heading); color:white; text-shadow:0 1px 2px rgba(0,0,0,0.5);">${user.name}</div>
                    <div style="font-size:0.75rem; color:${roleColors[user.role]}; background:white; padding:2px 8px; border-radius:12px; display:inline-block; text-transform:uppercase; font-weight:800; box-shadow:0 2px 4px rgba(0,0,0,0.1); margin-top:3px;">${user.role}</div>
                </div>
                <button id="logout-btn" class="btn btn-logout">Logout</button>
            </div>
        </nav>
    `;
}

function renderLogin() {
    appDiv.innerHTML = `
        <div class="login-wrapper">
            <div class="glass-container">
                <div class="brand-header">
                    <h1>Vidya's Balvatika</h1>
                    <p>Welcome! Please login to your portal.</p>
                </div>
                <div id="login-error" class="error-message"></div>
                <form id="login-form">
                    <div class="form-group">
                        <label>User ID</label>
                        <input type="text" id="userId" class="form-control" required placeholder="Ex: admin, Tch001">
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" id="password" class="form-control" required placeholder="Enter password">
                    </div>
                    <button type="submit" class="btn btn-primary" id="login-btn">Login to Portal</button>
                </form>
            </div>
        </div>
    `;

    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('login-btn');
        const userId = document.getElementById('userId').value.trim();
        const pwd = document.getElementById('password').value;
        const errDiv = document.getElementById('login-error');

        const emailToSubmit = userId.includes('@') ? userId : `${userId}@vidya.edu`;
        btn.innerText = 'Authenticating...';
        btn.disabled = true;
        errDiv.style.display = 'none';

        try {
            await auth.signIn(emailToSubmit, pwd);
        } catch(e) {
            errDiv.innerText = e.message;
            errDiv.style.display = 'block';
            btn.innerText = 'Login to Portal';
            btn.disabled = false;
        }
    });
}

// ------------------- DASHBOARDS -------------------

function renderAdminDashboard(user) {
    const classOptions = `
        <option value="Nursery">Nursery</option>
        <option value="KG I">KG I</option>
        <option value="KG II">KG II</option>
        <option value="1st Class">1st Class</option>
        <option value="2nd Class">2nd Class</option>
        <option value="3rd Class">3rd Class</option>
        <option value="4th Class">4th Class</option>
        <option value="5th Class">5th Class</option>
    `;

    appDiv.innerHTML = `
        ${renderNavbar(user)}
        <div class="dashboard-container">
            <div class="dashboard-header" style="background: rgba(255,255,255,0.9);">
                <h2>Admin Control Panel ⚙️</h2>
                <p style="color:var(--text-muted)">Manage accounts, track global attendance, and moderate posts.</p>
            </div>
            
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem;">
                
                <!-- Registration -->
                <div class="glass-container" style="padding:1.5rem; max-width:100%">
                    <h3>Register New User 👤</h3>
                    <div id="reg-msg" style="margin: 10px 0; font-size: 0.85rem; font-weight:600;"></div>
                    <form id="register-form" style="margin-top: 1rem;">
                        <!-- STEP 1 -->
                        <div id="reg-step-1">
                            <div class="form-group" style="margin-bottom: 0.5rem;"><label>Role</label><select id="reg-role" class="form-control" style="background:#fff"><option value="student">Student</option><option value="teacher">Teacher</option></select></div>
                            <div class="form-group" style="margin-bottom: 0.5rem;"><label>Assigned Class</label><select id="reg-class" class="form-control" style="background:#fff"><option value="">No Class</option>${classOptions}</select></div>
                            <button type="button" class="btn btn-primary" onclick="window.nextRegStep(2)" style="margin-top:0.5rem;">Next Step: Details ➔</button>
                        </div>
                        
                        <!-- STEP 2 -->
                        <div id="reg-step-2" style="display:none">
                            <div class="form-group" style="margin-bottom: 0.5rem;"><label>Full Name</label><input type="text" id="reg-name" class="form-control" required placeholder="Ex: Rohan Kumar"></div>
                            <div class="form-group" style="margin-bottom: 0.5rem;"><label>Mobile Number</label><input type="text" id="reg-mobile" class="form-control" placeholder="Optional"></div>
                            <div class="form-group" style="margin-bottom: 0.5rem;"><label>Aadhar No</label><input type="text" id="reg-aadhar" class="form-control" placeholder="Optional"></div>
                            <div class="form-group" style="margin-bottom: 0.5rem;"><label>Address</label><input type="text" id="reg-address" class="form-control" placeholder="Optional"></div>
                            <div style="display:flex; gap:10px; margin-top:0.5rem;">
                                <button type="button" class="btn" style="background:gray; color:white; flex:1;" onclick="window.nextRegStep(1)">Back</button>
                                <button type="button" class="btn btn-primary" onclick="window.nextRegStep(3)" style="flex:2;">Next Step: Login ➔</button>
                            </div>
                        </div>

                        <!-- STEP 3 -->
                        <div id="reg-step-3" style="display:none">
                            <div class="form-group" style="margin-bottom: 0.5rem;"><label>User ID</label><input type="text" id="reg-id" class="form-control" required placeholder="Ex: vbps001"></div>
                            <div class="form-group" style="margin-bottom: 0.5rem;"><label>Password</label><input type="text" id="reg-password" class="form-control" required></div>
                            <div style="display:flex; gap:10px; margin-top:0.5rem;">
                                <button type="button" class="btn" style="background:gray; color:white; flex:1;" onclick="window.nextRegStep(2)">Back</button>
                                <button type="submit" class="btn btn-primary" id="reg-btn" style="background:#10b981; flex:2;">Create User ✔</button>
                            </div>
                        </div>
                    </form>
                </div>

                <div style="display:flex; flex-direction:column; gap:1.5rem;">
                    <!-- User Directory Manager -->
                    <div class="glass-container" style="padding:1.5rem; max-width:100%">
                        <h3>User Directory 📖</h3>
                        <div style="margin-top:1rem; display:flex; flex-direction:column; gap:10px;">
                            <select id="dir-filter" class="form-control" style="width:100%;">
                                <option value="role|student">All Students</option>
                                <option value="role|teacher">All Teachers</option>
                                <option disabled>-- Filter Students By Class --</option>
                                <option value="class|Nursery">Nursery Class</option>
                                <option value="class|KG I">KG I Class</option>
                                <option value="class|KG II">KG II Class</option>
                                <option value="class|1st Class">1st Class</option>
                                <option value="class|2nd Class">2nd Class</option>
                                <option value="class|3rd Class">3rd Class</option>
                                <option value="class|4th Class">4th Class</option>
                                <option value="class|5th Class">5th Class</option>
                            </select>
                            <div style="display:flex; gap:10px;">
                                <button class="btn btn-primary" id="dir-load" style="flex:1">Load</button>
                                <button class="btn btn-primary" id="dir-export" style="flex:1; background:#10B981; display:none;">CSV Export</button>
                            </div>
                        </div>
                        <div id="dir-list" style="margin-top:1rem; max-height:250px; overflow-y:auto; padding-right:5px;">
                            <p style="font-size:0.9rem; color:var(--text-muted)">Select a filter to load users.</p>
                        </div>
                    </div>

                    <!-- Global Attendance -->
                    <div class="glass-container" style="padding:1.5rem; max-width:100%;">
                        <h3>Global Attendance 📅</h3>
                        <div style="margin-top:1rem;">
                            <label>Class/Group To Analyze</label>
                            <select id="admin-att-class" class="form-control" style="margin-bottom:0.5rem">
                                <option value="STAFF">Teachers (STAFF)</option>
                                ${classOptions}
                            </select>
                            <input type="date" id="admin-att-date" class="form-control" value="${getTodayStr()}" style="margin-bottom:0.5rem">
                            <button class="btn btn-primary" style="background:var(--primary)" id="admin-load-att">Load Attendance</button>
                        </div>
                        <div id="admin-att-results" style="margin-top:1rem; padding:15px; border-radius:10px; background:rgba(255,255,255,0.7); display:none; max-height:250px; overflow-y:auto;"></div>
                    </div>
                </div>
            </div>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem; margin-top:1.5rem;">
                <!-- Global Notice -->
                <div class="glass-container" style="padding:1.5rem; max-width:100%;">
                    <h3>Post Notification 📢</h3>
                    <input type="text" id="notice-title" class="form-control" style="margin:1rem 0 0.5rem" placeholder="Title">
                    <textarea id="notice-msg" class="form-control" style="margin-bottom:0.5rem; height:80px; resize:none" placeholder="Message details..."></textarea>
                    <select id="notice-target" class="form-control" style="margin-bottom:0.5rem">
                        <option value="All">All School (Global)</option>
                        ${classOptions}
                    </select>
                    <button class="btn btn-primary" id="post-notice-btn">Post Notification</button>
                    <div id="notice-status" style="margin-top:5px; font-weight:600; font-size:0.85rem"></div>
                </div>

                <!-- Moderation Feed -->
                <div class="glass-container" style="padding:1.5rem; max-width:100%;">
                    <h3>Moderation Queue (Notices & Results) 🛡️</h3>
                    <button class="btn btn-primary" id="mod-load-btn" style="width:auto">Load All Posts</button>
                    <div id="mod-list" style="margin-top:1rem; display:flex; flex-direction:column; gap:10px; max-height:300px; overflow-y:auto;"></div>
                </div>
            </div>
        </div>
    `;
    attachLogout();
    attachRegisterListener();
    attachAdminEvents(user);
}

function renderTeacherDashboard(user) {
    if(!user.classId) user.classId = "Unassigned";
    
    appDiv.innerHTML = `
        ${renderNavbar(user)}
        <div class="dashboard-container">
            <div class="dashboard-header" style="background: rgba(255,255,255,0.9);">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap;">
                    <div>
                        <h2>Teacher Dashboard: ${user.classId} 🍎</h2>
                        <p style="color:var(--text-muted)">Manage attendance, notices, and test results for your students.</p>
                    </div>
                    <button class="btn btn-accent" id="mark-self-btn" style="width:auto; height:fit-content; background:#10B981; margin-top:10px;">Mark My Attendance Present</button>
                </div>
                <div id="self-att-msg" style="margin-top:10px; font-weight:bold; font-size:0.9rem;">Checking today's attendance status...</div>
            </div>
            
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem;">
                
                <!-- Student Attendance -->
                <div class="glass-container" style="padding:1.5rem; max-width:100%;">
                    <h3>Class Attendance 📝</h3>
                    <div style="margin-top:1rem; display:flex; gap:10px;">
                        <input type="date" id="tch-att-date" class="form-control" value="${getTodayStr()}" style="flex:1;">
                        <button class="btn btn-primary" id="tch-load-att" style="width:auto; padding:0 20px;">Load</button>
                    </div>
                    <div id="tch-att-list" style="margin-top:1rem; max-height:300px; overflow-y:auto; padding-right:5px;">
                        <p style="text-align:center; color:var(--text-muted); font-size:0.9rem; padding:2rem 0;">Click Load to pull your students.</p>
                    </div>
                    <button class="btn btn-primary" id="tch-save-att" style="background:#10B981; margin-top:1rem; display:none;">Save Registers</button>
                    <div id="tch-att-msg" style="margin-top:10px; font-weight:bold; font-size:0.85rem"></div>
                </div>

                <div style="display:flex; flex-direction:column; gap:1.5rem;">
                    <!-- Notices -->
                    <div class="glass-container" style="padding:1.5rem; max-width:100%;">
                        <h3>Post Class Notice 📢</h3>
                        <input type="text" id="notice-title" class="form-control" style="margin:1rem 0 0.5rem" placeholder="Title">
                        <textarea id="notice-msg" class="form-control" style="margin-bottom:0.5rem; height:80px; resize:none" placeholder="Message details..."></textarea>
                        <button class="btn btn-primary" id="post-notice-btn">Post to ${user.classId}</button>
                        <div id="notice-status" style="margin-top:5px; font-weight:600; font-size:0.85rem"></div>
                    </div>
                    
                    <!-- Post Result -->
                    <div class="glass-container" style="padding:1.5rem; max-width:100%;">
                        <h3>Post Student Result 🏆</h3>
                        <p style="font-size:0.8rem; color:var(--text-muted); margin-top:5px;">(Load Attendance Data first to populate dropdown)</p>
                        <select id="res-student" class="form-control" style="margin:0.5rem 0 0.5rem">
                            <option value="">-- Load Class First --</option>
                        </select>
                        <input type="text" id="res-exam" class="form-control" style="margin-bottom:0.5rem" placeholder="Exam Name (e.g. Unit Test 1)">
                        <div style="display:flex; gap:10px; margin-bottom:0.5rem">
                            <input type="text" id="res-marks" class="form-control" placeholder="Marks (e.g. 85/100)">
                            <input type="text" id="res-grade" class="form-control" placeholder="Grade (Optional)">
                        </div>
                        <button class="btn btn-primary" id="post-result-btn" style="background:var(--secondary); color:#000;">Publish Result</button>
                        <div id="res-status" style="margin-top:5px; font-weight:600; font-size:0.85rem"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    attachLogout();
    attachTeacherEvents(user);
}

function renderStudentDashboard(user) {
    if(!user.classId) user.classId = "Unassigned";

    appDiv.innerHTML = `
        ${renderNavbar(user)}
        <div class="dashboard-container">
            <div class="dashboard-header" style="background: rgba(255,255,255,0.9);">
                <h2>Welcome, ${user.name} 🎒</h2>
                <p style="color:var(--text-muted)">Class: <strong>${user.classId}</strong> | School Portal</p>
            </div>
            
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem;">
                <!-- Notice Feed -->
                <div class="glass-container" style="padding:1.5rem; max-width:100%;">
                    <h3>Notice Board 📌</h3>
                    <div id="student-notices" style="margin-top:1rem; display:flex; flex-direction:column; gap:1rem;">
                        <p style="font-size:0.9rem; color:var(--text-muted)">Loading specific school updates...</p>
                    </div>
                </div>

                <div style="display:flex; flex-direction:column; gap:1.5rem;">
                    <!-- Attendance Stats -->
                    <div class="glass-container" style="padding:1.5rem; max-width:100%; text-align:center;">
                        <h3>My Attendance 📊</h3>
                        <div style="margin-top:1rem;">
                            <div style="font-size:3.5rem; font-weight:800; color:var(--primary); font-family:var(--font-heading); text-shadow:0 2px 4px rgba(0,0,0,0.1);" id="stu-att-perc">--%</div>
                            <p style="font-weight:600; color:var(--text-muted);" id="stu-att-text">Calculating your recent attendance...</p>
                        </div>
                    </div>
                    
                    <!-- Results panel -->
                    <div class="glass-container" style="padding:1.5rem; max-width:100%;">
                        <h3>My Results 🏆</h3>
                        <div id="student-results" style="margin-top:1rem; display:flex; flex-direction:column; gap:1rem;">
                            <p style="font-size:0.9rem; color:var(--text-muted)">Loading scores...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    attachLogout();
    attachStudentEvents(user);
}

// ------------------- EVENT ATTACHMENTS -------------------

function attachLogout() {
    document.getElementById('logout-btn').addEventListener('click', () => auth.signOut());
}

function attachRegisterListener() {
    const form = document.getElementById('register-form');
    if(!form) return;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('reg-btn');
        const msgDiv = document.getElementById('reg-msg');
        
        const role = document.getElementById('reg-role').value;
        const classId = document.getElementById('reg-class').value;
        const name = document.getElementById('reg-name').value;
        const mobile = document.getElementById('reg-mobile').value;
        const aadhar = document.getElementById('reg-aadhar').value;
        const address = document.getElementById('reg-address').value;
        const id = document.getElementById('reg-id').value.trim();
        const pwd = document.getElementById('reg-password').value;
        
        btn.innerText = "Processing..."; btn.disabled = true;
        msgDiv.style.color = "var(--text-main)"; msgDiv.innerText = "Connecting to Firebase...";
        
        try {
            await auth.registerNewAccount(id, pwd, role, name, classId, mobile, aadhar, address);
            msgDiv.style.color = "#10b981"; msgDiv.innerText = `Success! ${name} registered.`;
            form.reset();
            window.nextRegStep(1);
        } catch(error) {
            msgDiv.style.color = "#ef4444"; msgDiv.innerText = `Error: ${error.message}`;
        }
        btn.innerText = "Create User"; btn.disabled = false;
    });
}

function attachAdminEvents(user) {
    // Post Global Notice
    document.getElementById('post-notice-btn').addEventListener('click', async () => {
        const title = document.getElementById('notice-title').value;
        const msg = document.getElementById('notice-msg').value;
        const tgt = document.getElementById('notice-target').value;
        const status = document.getElementById('notice-status');
        if(!title || !msg) { status.style.color = 'red'; status.innerText = 'Fields empty.'; return; }
        
        try {
            await db.collection('notices').add({
                title: title, message: msg, targetClass: tgt, author: user.name,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            status.style.color = '#10B981'; status.innerText = 'Notice successfully published!';
            document.getElementById('notice-title').value = ''; document.getElementById('notice-msg').value = '';
        } catch(e) { status.style.color = 'red'; status.innerText = 'Error saving notice.'; }
    });

    // Global Attendance Lookups (Advanced with Name matching)
    document.getElementById('admin-load-att').addEventListener('click', async () => {
        const tgtClass = document.getElementById('admin-att-class').value;
        const dateStr = document.getElementById('admin-att-date').value;
        const resDiv = document.getElementById('admin-att-results');
        resDiv.style.display = 'block'; resDiv.innerHTML = 'Analyzing database...';

        try {
            const docSnap = await db.collection('attendance').doc(tgtClass).collection('records').doc(dateStr).get();
            if(!docSnap.exists) {
                resDiv.innerHTML = `<div style="color:var(--accent); font-weight:bold; font-size:0.9rem">No registers found for ${tgtClass} on this date.</div>`;
                return;
            }
            const data = docSnap.data();
            const pIds = data.present || [];
            const aIds = data.absent || [];
            
            resDiv.innerHTML = 'Mapping UUIDs to User Profiles...';
            // Resolve Names
            await Promise.all([
               ...pIds.map(async (id, idx) => { const u = await db.collection('users').doc(id).get(); pIds[idx] = u.exists ? u.data().name : 'Unknown'; }),
               ...aIds.map(async (id, idx) => { const u = await db.collection('users').doc(id).get(); aIds[idx] = u.exists ? u.data().name : 'Unknown'; })
            ]);

            resDiv.innerHTML = `
                <div style="margin-bottom:15px">
                    <div style="font-weight:800; color:#10B981; font-size:1.1rem; border-bottom:1px solid #ddd; padding-bottom:3px; margin-bottom:5px;">✔️ Present (${pIds.length})</div>
                    <div style="font-size:0.85rem; color:var(--text-main); line-height:1.5">${pIds.join(', ') || 'None'}</div>
                </div>
                <div>
                    <div style="font-weight:800; color:var(--accent); font-size:1.1rem; border-bottom:1px solid #ddd; padding-bottom:3px; margin-bottom:5px;">❌ Absent (${aIds.length})</div>
                    <div style="font-size:0.85rem; color:var(--text-main); line-height:1.5">${aIds.join(', ') || 'None'}</div>
                </div>
            `;
        } catch(e) {
            resDiv.innerHTML = `<span style="color:red; font-size:0.9rem;">Error fetching: ${e.message}</span>`;
        }
    });

    // Directory Manager
    let currentLoadedUsers = [];
    document.getElementById('dir-export').addEventListener('click', () => {
        if(currentLoadedUsers.length === 0) return;
        let csvContent = "Name,Role,Class,Mobile,Aadhar,Address,UserID\n";
        currentLoadedUsers.forEach(u => {
            const row = `"${u.name||''}","${u.role||''}","${u.classId||''}","${u.mobile||''}","${u.aadhar||''}","${u.address||''}","${u.id||''}"`;
            csvContent += row + "\n";
        });
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "directory_export.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    document.getElementById('dir-load').addEventListener('click', async () => {
        const filterVal = document.getElementById('dir-filter').value;
        const [filterType, filterTerm] = filterVal.split('|');
        const listDiv = document.getElementById('dir-list');
        listDiv.innerHTML = "Fetching secure documents...";
        try {
            let snap;
            if(filterType === 'role') {
                snap = await db.collection('users').where('role', '==', filterTerm).get();
            } else {
                snap = await db.collection('users').where('classId', '==', filterTerm).where('role', '==', 'student').get();
            }
            if(snap.empty) { 
                listDiv.innerHTML = "<p style='font-size:0.9rem;color:gray'>No matching users found.</p>"; 
                document.getElementById('dir-export').style.display = 'none';
                currentLoadedUsers = [];
                return; 
            }
            let html = "";
            currentLoadedUsers = [];
            snap.forEach(doc => {
                 const u = doc.data();
                 currentLoadedUsers.push({ id: doc.id, ...u });
                 html += `
                    <div style="padding:10px; border-bottom:1px solid rgba(0,0,0,0.1); background:rgba(255,255,255,0.4)" id="row-${doc.id}">
                        <div style="display:flex; justify-content:space-between; align-items:center;" id="view-${doc.id}">
                            <div>
                                <div style="font-weight:bold; color:var(--primary); font-size:0.9rem;" id="nm-${doc.id}">${u.name}</div>
                                <div style="font-size:0.75rem; color:var(--text-muted)">Class: <span id="cl-${doc.id}">${u.classId || 'N/A'}</span> | Mob: <span id="mb-${doc.id}">${u.mobile || 'N/A'}</span></div>
                            </div>
                            <div>
                                <button class="btn-edit-user" data-id="${doc.id}" style="background:var(--secondary); color:#000; border:none; padding:5px 8px; border-radius:6px; cursor:pointer; font-weight:600; font-size:0.8rem; margin-right:5px">Edit</button>
                                <button class="btn-del-user" data-id="${doc.id}" style="background:var(--accent); color:white; border:none; padding:5px 8px; border-radius:6px; cursor:pointer; font-weight:600; font-size:0.8rem">Del</button>
                            </div>
                        </div>
                        <div style="display:none; margin-top:10px;" id="edit-${doc.id}">
                            <input type="text" id="inp-nm-${doc.id}" value="${u.name}" class="form-control" style="margin-bottom:5px; padding:5px; font-size:0.8rem;">
                            <input type="text" id="inp-cl-${doc.id}" value="${u.classId || ''}" class="form-control" style="margin-bottom:5px; padding:5px; font-size:0.8rem;" placeholder="Class (e.g. Nursery)">
                            <input type="text" id="inp-mb-${doc.id}" value="${u.mobile || ''}" class="form-control" style="margin-bottom:5px; padding:5px; font-size:0.8rem;" placeholder="Mobile">
                            <button class="btn-save-user" data-id="${doc.id}" style="background:#10B981; color:white; border:none; padding:5px 12px; border-radius:6px; cursor:pointer; font-weight:600; font-size:0.8rem; margin-right:5px;">Save</button>
                            <button class="btn-canc-user" data-id="${doc.id}" style="background:gray; color:white; border:none; padding:5px 12px; border-radius:6px; cursor:pointer; font-weight:600; font-size:0.8rem;">Cancel</button>
                        </div>
                    </div>
                 `;
            });
            listDiv.innerHTML = html;
            // Attach events
            document.querySelectorAll('.btn-edit-user').forEach(btn => btn.addEventListener('click', e => {
                const id = e.target.getAttribute('data-id');
                document.getElementById('view-'+id).style.display = 'none';
                document.getElementById('edit-'+id).style.display = 'block';
            }));
            document.querySelectorAll('.btn-canc-user').forEach(btn => btn.addEventListener('click', e => {
                const id = e.target.getAttribute('data-id');
                document.getElementById('view-'+id).style.display = 'flex';
                document.getElementById('edit-'+id).style.display = 'none';
            }));
            document.querySelectorAll('.btn-save-user').forEach(btn => btn.addEventListener('click', async e => {
                const id = e.target.getAttribute('data-id');
                const btnRef = e.target;
                btnRef.innerText = '...';
                try {
                    const nm = document.getElementById('inp-nm-'+id).value;
                    const cl = document.getElementById('inp-cl-'+id).value;
                    const mb = document.getElementById('inp-mb-'+id).value;
                    await db.collection('users').doc(id).update({ name: nm, classId: cl, mobile: mb });
                    document.getElementById('nm-'+id).innerText = nm;
                    document.getElementById('cl-'+id).innerText = cl;
                    document.getElementById('mb-'+id).innerText = mb;
                    document.getElementById('view-'+id).style.display = 'flex';
                    document.getElementById('edit-'+id).style.display = 'none';
                } catch(err) { alert('Error updating data!'); }
                btnRef.innerText = 'Save';
            }));
            document.querySelectorAll('.btn-del-user').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    if(confirm("CRITICAL WARNING: This permanently wipes their user profile from Firestore. Proceed?")) {
                        await db.collection('users').doc(e.target.getAttribute('data-id')).delete();
                        document.getElementById('row-'+e.target.getAttribute('data-id')).remove();
                        currentLoadedUsers = currentLoadedUsers.filter(u => u.id !== e.target.getAttribute('data-id'));
                    }
                });
            });
            document.getElementById('dir-export').style.display = 'block';
        } catch(e) { listDiv.innerHTML = "<span style='color:red;font-size:0.9rem'>Error loading.</span>"; }
    });

    // Moderation Load
    document.getElementById('mod-load-btn').addEventListener('click', async () => {
        const feed = document.getElementById('mod-list');
        feed.innerHTML = "Parsing all databases...";
        try {
            const noticesSnap = await db.collection('notices').get();
            const resultsSnap = await db.collection('results').get();

            let posts = [];
            noticesSnap.forEach(d => posts.push({ id: d.id, col: 'notices', type: 'NOTICE', icon: '📢', ...d.data() }));
            resultsSnap.forEach(d => posts.push({ id: d.id, col: 'results', type: 'RESULT', icon: '🏆', ...d.data() }));
            
            // Sort by latest
            posts.sort((a,b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));

            let html = "";
            posts.forEach(p => {
                 html += `<div style="background:white; padding:12px; border-radius:10px; border-left:4px solid ${p.col==='notices'?'var(--primary)':'var(--secondary)'}; flex: 1 1 100%;">
                    <div style="display:flex; justify-content:space-between;">
                        <strong style="font-size:0.9rem">${p.icon} ${p.examName || p.title}</strong>
                        <button class="btn-del-doc" data-col="${p.col}" data-id="${p.id}" style="background:#fecaca; color:#dc2626; border:1px solid #f87171; padding:2px 8px; border-radius:4px; font-size:0.75rem; cursor:pointer;">Delete</button>
                    </div>
                    <div style="font-size:0.8rem; color:var(--text-main); margin:4px 0;">${p.message || 'Marks: '+p.marks+' | Grade: '+p.grade}</div>
                    <div style="font-size:0.7rem; color:var(--text-muted);">Target: ${p.targetClass || p.classId}</div>
                 </div>`;
            });
            feed.innerHTML = html || "<p style='font-size:0.9rem;color:gray'>No posts to moderate.</p>";

            document.querySelectorAll('.btn-del-doc').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    if(confirm("Confirm hard delete of this post?")) {
                        await db.collection(e.target.getAttribute('data-col')).doc(e.target.getAttribute('data-id')).delete();
                        e.target.parentElement.parentElement.remove();
                    }
                });
            });
        } catch(e) { feed.innerHTML = "<span style='color:red;font-size:0.9rem'>Failed to load feed.</span>"; console.error(e); }
    });
}

function attachTeacherEvents(user) {
    // Initial fetch to check if already marked
    (async () => {
        const msg = document.getElementById('self-att-msg');
        const btn = document.getElementById('mark-self-btn');
        try {
            const today = getTodayStr();
            const doc = await db.collection('attendance').doc('STAFF').collection('records').doc(today).get();
            if (doc.exists && (doc.data().present || []).includes(user.uid)) {
                btn.style.display = 'none';
                msg.style.color = "white"; msg.style.background = "#10B981"; msg.style.padding = "6px 12px"; msg.style.borderRadius = "8px"; msg.style.display="inline-block";
                msg.innerText = "✔ You are marked Present for Today!";
            } else {
                msg.innerText = "";
            }
        } catch(e) { msg.innerText = ""; }
    })();

    // Self Attendance
    document.getElementById('mark-self-btn').addEventListener('click', async () => {
        const msg = document.getElementById('self-att-msg');
        msg.style.color = "var(--text-main)"; msg.innerText = "Marking...";
        try {
            const today = getTodayStr();
            const ref = db.collection('attendance').doc('STAFF').collection('records').doc(today);
            await ref.set({ present: firebase.firestore.FieldValue.arrayUnion(user.uid) }, { merge: true });
            msg.style.color = "white"; msg.style.background = "#10B981"; msg.style.padding = "2px 8px"; msg.style.borderRadius = "8px";
            msg.innerText = "✔ Marked Present for " + today;
        } catch(e) { msg.style.color = "red"; msg.innerText = "Error!"; }
    });

    // Student Attendance Management
    let loadedStudents = [];
    document.getElementById('tch-load-att').addEventListener('click', async () => {
        const listDiv = document.getElementById('tch-att-list');
        listDiv.innerHTML = "Fetching class roster...";
        try {
            const snap = await db.collection('users').where('role', '==', 'student').where('classId', '==', user.classId).get();
            loadedStudents = [];
            snap.forEach(doc => loadedStudents.push({uid: doc.id, ...doc.data()}));
            
            if(loadedStudents.length === 0) { listDiv.innerHTML = "<p style='font-size:0.9rem; color:gray'>No students found assigned to this class.</p>"; return; }
            
            const curDate = document.getElementById('tch-att-date').value;
            const existingDoc = await db.collection('attendance').doc(user.classId).collection('records').doc(curDate).get();
            let existingData = existingDoc.exists ? existingDoc.data() : { present: [], absent: [] };

            let html = "";
            loadedStudents.forEach((stu, idx) => {
                const isAbsent = (existingData.absent || []).includes(stu.uid);
                html += `
                    <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; border-bottom:1px solid rgba(0,0,0,0.05); background: ${idx%2===0?'rgba(255,255,255,0.4)':'transparent'}">
                        <div style="font-weight:600">${stu.name}</div>
                        <div>
                            <select class="form-control att-select" data-uid="${stu.uid}" style="padding:4px 8px; font-size:0.85rem;">
                                <option value="present" ${!isAbsent ? "selected" : ""}>Present</option>
                                <option value="absent" ${isAbsent ? "selected" : ""}>Absent</option>
                            </select>
                        </div>
                    </div>
                `;
            });
            listDiv.innerHTML = html;
            document.getElementById('tch-save-att').style.display = "block";
            
            // Populate Results dropdown too
            const resSelect = document.getElementById('res-student');
            if(resSelect) {
                resSelect.innerHTML = '<option value="">-- Select Student --</option>';
                loadedStudents.forEach((stu) => {
                    resSelect.innerHTML += `<option value="${stu.uid}">${stu.name}</option>`;
                });
            }
        } catch(e) { listDiv.innerHTML = "<span style='color:red; font-size:0.9rem;'>Error loading roster. Check network.</span>"; }
    });

    document.getElementById('tch-save-att').addEventListener('click', async () => {
        const curDate = document.getElementById('tch-att-date').value;
        const selects = document.querySelectorAll('.att-select');
        let present = [], absent = [];
        selects.forEach(sel => {
            if(sel.value === 'present') present.push(sel.getAttribute('data-uid'));
            else absent.push(sel.getAttribute('data-uid'));
        });

        const msgDiv = document.getElementById('tch-att-msg');
        msgDiv.innerText = "Saving registers..."; msgDiv.style.color="black";
        try {
            await db.collection('attendance').doc(user.classId).collection('records').doc(curDate).set({ present, absent });
            msgDiv.innerText = "Registers securely updated!"; msgDiv.style.color="#10B981";
        } catch(e) { msgDiv.innerText = "Failed! " + e.message; msgDiv.style.color="red"; }
    });

    // Notices logic
    document.getElementById('post-notice-btn').addEventListener('click', async () => {
        const title = document.getElementById('notice-title').value;
        const msg = document.getElementById('notice-msg').value;
        const status = document.getElementById('notice-status');
        if(!title || !msg) { status.style.color = 'red'; status.innerText = 'Fields empty.'; return; }
        
        try {
            await db.collection('notices').add({
                title: title, message: msg, targetClass: user.classId, author: user.name,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            status.style.color = '#10B981'; status.innerText = 'Notice dispatched to Class!';
            document.getElementById('notice-title').value = ''; document.getElementById('notice-msg').value = '';
        } catch(e) { status.style.color = 'red'; status.innerText = 'Error saving notice.'; }
    });

    // Post Result logic
    document.getElementById('post-result-btn').addEventListener('click', async () => {
        const sid = document.getElementById('res-student').value;
        const exam = document.getElementById('res-exam').value;
        const marks = document.getElementById('res-marks').value;
        const grade = document.getElementById('res-grade').value || "-";
        const status = document.getElementById('res-status');
        
        if(!sid || !exam || !marks) { status.style.color = 'red'; status.innerText = 'Fields empty.'; return; }
        
        try {
            await db.collection('results').add({
                studentId: sid, examName: exam, marks: marks, grade: grade, teacherId: user.uid, classId: user.classId,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            status.style.color = '#10B981'; status.innerText = 'Result published successfully!';
            document.getElementById('res-exam').value = ''; document.getElementById('res-marks').value = ''; document.getElementById('res-grade').value = '';
        } catch(e) { status.style.color = 'red'; status.innerText = 'Error publishing result.'; }
    });
}

function attachStudentEvents(user) {
    const fetchNotices = async () => {
        const box = document.getElementById('student-notices');
        try {
            const classSnap = await db.collection('notices').where('targetClass', '==', user.classId).get();
            const allSnap = await db.collection('notices').where('targetClass', '==', 'All').get();
            
            let notices = [];
            classSnap.forEach(d => notices.push(d.data())); allSnap.forEach(d => notices.push(d.data()));
            notices.sort((a,b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
            
            if(notices.length === 0) { box.innerHTML = '<p style="font-size:0.9rem;color:gray">No current school announcements.</p>'; return; }
            
            let html = "";
            notices.slice(0, 5).forEach(n => {
                html += `
                    <div style="background:white; padding:15px; border-radius:12px; border-left:5px solid var(--primary); box-shadow:var(--shadow-sm);">
                        <div style="font-weight:800; color:var(--text-main); margin-bottom:5px;">${n.title}</div>
                        <div style="font-size:0.9rem; color:var(--text-muted);">${n.message}</div>
                        <div style="font-size:0.7rem; color:#9ca3af; margin-top:5px;">By ${n.author} • ${n.targetClass}</div>
                    </div>
                `;
            });
            box.innerHTML = html;
        } catch (e) { box.innerHTML = `<p style="color:red; font-size:0.9rem;">Failed to read notice board.</p>`; }
    };

    const calculateAttendance = async () => {
        try {
            const snap = await db.collection('attendance').doc(user.classId).collection('records').limit(30).get();
            let totalDays = 0; let presentDays = 0;
            snap.forEach(doc => {
                totalDays++;
                const data = doc.data();
                if((data.present || []).includes(user.uid)) presentDays++;
            });
            
            if(totalDays === 0) {
                document.getElementById('stu-att-perc').innerText = "-";
                document.getElementById('stu-att-text').innerText = "No registers taken yet for your class.";
                return;
            }
            const perc = Math.round((presentDays / totalDays) * 100);
            document.getElementById('stu-att-perc').innerText = `${perc}%`;
            document.getElementById('stu-att-perc').style.color = perc > 75 ? '#10B981' : '#F59E0B';
            document.getElementById('stu-att-text').innerText = `Present ${presentDays} out of ${totalDays} marked days.`;
        } catch(e) { console.error(e); }
    };

    const fetchResults = async () => {
        const box = document.getElementById('student-results');
        try {
            const snap = await db.collection('results').where('studentId', '==', user.uid).get();
            let results = [];
            snap.forEach(d => results.push(d.data()));
            results.sort((a,b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
            
            if(results.length === 0) { box.innerHTML = '<p style="font-size:0.9rem;color:gray">No test scores posted yet.</p>'; return; }
            
            let html = "";
            results.forEach(r => {
                html += `
                    <div style="background:white; padding:15px; border-radius:12px; border-left:5px solid var(--secondary); box-shadow:var(--shadow-sm); display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <div style="font-weight:800; color:var(--text-main);">${r.examName}</div>
                            <div style="font-size:0.8rem; color:var(--text-muted);">${r.marks}</div>
                        </div>
                        <div style="font-size:1.5rem; font-weight:800; color:var(--accent);">${r.grade}</div>
                    </div>
                `;
            });
            box.innerHTML = html;
        } catch (e) { box.innerHTML = `<p style="color:red; font-size:0.9rem;">Failed to read results.</p>`; }
    };

    fetchNotices();
    calculateAttendance();
    fetchResults();
}

function initializeApp() {
    auth.onAuthStateChanged(user => {
        if (!user) {
            renderLogin();
        } else {
            document.body.style.backgroundImage = "url('bg.jpg'), linear-gradient(180deg, #38bdf8 0%, #e0f2fe 100%)";
            switch(user.role) {
                case 'admin': renderAdminDashboard(user); break;
                case 'teacher': renderTeacherDashboard(user); break;
                case 'student': renderStudentDashboard(user); break;
                default: renderLogin();
            }
        }
    });
}

initializeApp();

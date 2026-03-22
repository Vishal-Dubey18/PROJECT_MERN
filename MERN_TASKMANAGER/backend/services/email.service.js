const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
});

function baseTemplate(content) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f0f4ff}
    .wrap{max-width:580px;margin:40px auto;padding:16px}
    .card{background:#0f1628;border-radius:20px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.4)}
    .hdr{background:linear-gradient(135deg,#4f8ef7,#7c3aed);padding:32px 40px;text-align:center}
    .logo{font-size:26px;font-weight:800;color:#fff;letter-spacing:-.03em}
    .body{padding:36px 40px;color:#eef2ff}
    .h1{font-size:22px;font-weight:700;margin-bottom:14px}
    .p{font-size:15px;line-height:1.7;color:#8b9cc8;margin-bottom:20px}
    .btn{display:inline-block;padding:13px 30px;background:linear-gradient(135deg,#4f8ef7,#7c3aed);color:#fff !important;text-decoration:none;border-radius:10px;font-size:15px;font-weight:700}
    .div{height:1px;background:rgba(79,142,247,.12);margin:24px 0}
    .otp-box{background:rgba(79,142,247,.08);border:2px solid rgba(79,142,247,.3);border-radius:14px;padding:24px;text-align:center;margin:20px 0}
    .otp-code{font-size:44px;font-weight:800;letter-spacing:12px;color:#4f8ef7;font-family:monospace}
    .otp-note{font-size:13px;color:#8b9cc8;margin-top:8px}
    .ftr{padding:20px 40px;text-align:center;font-size:12px;color:#3d4d6e;background:rgba(0,0,0,.2)}
    .stat-row{display:flex;gap:10px;margin-bottom:20px}
    .stat{flex:1;background:rgba(79,142,247,.06);border:1px solid rgba(79,142,247,.12);border-radius:10px;padding:14px;text-align:center}
    .stat-n{font-size:26px;font-weight:800;color:#eef2ff}
    .stat-l{font-size:11px;color:#8b9cc8;margin-top:3px}
    .task{background:rgba(79,142,247,.05);border:1px solid rgba(79,142,247,.12);border-radius:9px;padding:12px 16px;margin-bottom:8px}
    .task-t{font-size:14px;font-weight:600;color:#eef2ff;margin-bottom:3px}
    .task-m{font-size:12px;color:#8b9cc8}
    .badge{display:inline-block;padding:2px 9px;border-radius:99px;font-size:11px;font-weight:600}
    .high{background:rgba(239,68,68,.12);color:#ef4444;border:1px solid rgba(239,68,68,.25)}
    .medium{background:rgba(245,158,11,.12);color:#f59e0b;border:1px solid rgba(245,158,11,.25)}
    .low{background:rgba(16,185,129,.12);color:#10b981;border:1px solid rgba(16,185,129,.25)}
    .pending{background:rgba(245,158,11,.12);color:#f59e0b;border:1px solid rgba(245,158,11,.25)}
    .completed{background:rgba(16,185,129,.12);color:#10b981;border:1px solid rgba(16,185,129,.25)}
  </style></head><body>
  <div class="wrap"><div class="card">
    <div class="hdr"><div class="logo">Task<span style="opacity:.85">Flow</span></div></div>
    ${content}
  </div>
  <div style="text-align:center;margin-top:16px;font-size:12px;color:#8b9cc8">
    © ${new Date().getFullYear()} TaskFlow · You received this because you have an account with us.
  </div></div></body></html>`;
}

// ── 1. Email verification ─────────────────────────────────────
async function sendVerificationEmail({ to, name, otp }) {
  const html = baseTemplate(`
    <div class="body">
      <div class="h1">Verify your email address ✉️</div>
      <p class="p">Hi ${name}! Welcome to TaskFlow. Enter the code below to verify your email and activate your account.</p>
      <div class="otp-box">
        <div class="otp-code">${otp}</div>
        <div class="otp-note">Expires in 15 minutes · Do not share this code</div>
      </div>
      <p class="p" style="font-size:13px">If you did not create a TaskFlow account, you can safely ignore this email.</p>
    </div>
    <div class="ftr">TaskFlow Security · This is an automated message</div>
  `);
  return transporter.sendMail({
    from: `"TaskFlow" <${process.env.GMAIL_USER}>`,
    to, subject: `${otp} is your TaskFlow verification code`, html,
  });
}

// ── 2. Welcome email ──────────────────────────────────────────
async function sendWelcomeEmail({ to, name }) {
  const html = baseTemplate(`
    <div class="body">
      <div class="h1">Welcome to TaskFlow, ${name}! 🎉</div>
      <p class="p">Your account is verified and ready. Start organizing your work and hitting every deadline.</p>
      <a href="${process.env.CLIENT_URL}/dashboard" class="btn">Open my dashboard ✦</a>
      <div class="div"></div>
      <p class="p" style="font-size:13px">
        ✅ &nbsp;Create tasks with titles and due dates<br/>
        🔥 &nbsp;Set priority: High, Medium, Low<br/>
        🔍 &nbsp;Search and filter instantly<br/>
        📧 &nbsp;Get email reminders before deadlines<br/>
        📊 &nbsp;Weekly progress summaries
      </p>
    </div>
    <div class="ftr">Need help? Reply to this email.</div>
  `);
  return transporter.sendMail({
    from: `"TaskFlow" <${process.env.GMAIL_USER}>`,
    to, subject: `Welcome to TaskFlow, ${name}! 🎉`, html,
  });
}

// ── 3. Password reset ─────────────────────────────────────────
async function sendPasswordResetEmail({ to, name, otp }) {
  const html = baseTemplate(`
    <div class="body">
      <div class="h1">Reset your password 🔒</div>
      <p class="p">Hi ${name}, use the code below to reset your password. It expires in <strong style="color:#eef2ff">15 minutes</strong>.</p>
      <div class="otp-box">
        <div class="otp-code">${otp}</div>
        <div class="otp-note">Expires in 15 minutes · Never share this code</div>
      </div>
      <p class="p" style="font-size:12px;color:#3d4d6e">If you did not request this, ignore this email. Your password will not change.</p>
    </div>
    <div class="ftr">TaskFlow Security</div>
  `);
  return transporter.sendMail({
    from: `"TaskFlow Security" <${process.env.GMAIL_USER}>`,
    to, subject: `${otp} — your TaskFlow password reset code`, html,
  });
}

// ── 4. Due date reminder ──────────────────────────────────────
async function sendDueDateReminderEmail({ to, name, tasks }) {
  const rows = tasks.map(t => `
    <div class="task">
      <div class="task-t">${t.title}</div>
      <div class="task-m">
        Due: <strong style="color:#eef2ff">${new Date(t.dueDate).toLocaleDateString('en-IN',{weekday:'short',year:'numeric',month:'short',day:'numeric'})}</strong>
        &nbsp;<span class="badge ${t.priority}">${t.priority}</span>
      </div>
    </div>`).join('');

  const html = baseTemplate(`
    <div class="body">
      <div class="h1">⏰ ${tasks.length} task${tasks.length>1?'s':''} due soon</div>
      <p class="p">Hi ${name}, don't let these slip — they're due in the next 24 hours.</p>
      ${rows}
      <div class="div"></div>
      <a href="${process.env.CLIENT_URL}/dashboard" class="btn">View all tasks →</a>
    </div>
    <div class="ftr">TaskFlow Reminders</div>
  `);
  return transporter.sendMail({
    from: `"TaskFlow Reminders" <${process.env.GMAIL_USER}>`,
    to, subject: `⏰ ${tasks.length} task${tasks.length>1?'s':''} due soon — TaskFlow`, html,
  });
}

// ── 5. Weekly summary ─────────────────────────────────────────
async function sendWeeklySummaryEmail({ to, name, stats, topTasks }) {
  const rows = (topTasks||[]).slice(0,5).map(t => `
    <div class="task">
      <div class="task-t">${t.title}</div>
      <div class="task-m">
        <span class="badge ${t.status}">${t.status}</span>
        &nbsp;<span class="badge ${t.priority}">${t.priority}</span>
        ${t.dueDate ? `&nbsp; Due: ${new Date(t.dueDate).toLocaleDateString()}` : ''}
      </div>
    </div>`).join('');

  const html = baseTemplate(`
    <div class="body">
      <div class="h1">📊 Your weekly summary</div>
      <p class="p">Hi ${name}, here's how your week looked:</p>
      <div class="stat-row">
        <div class="stat"><div class="stat-n">${stats.total||0}</div><div class="stat-l">Total</div></div>
        <div class="stat"><div class="stat-n" style="color:#10b981">${stats.completed||0}</div><div class="stat-l">Done</div></div>
        <div class="stat"><div class="stat-n" style="color:#f59e0b">${stats.pending||0}</div><div class="stat-l">Pending</div></div>
        <div class="stat"><div class="stat-n" style="color:#ef4444">${stats.highPriority||0}</div><div class="stat-l">High pri.</div></div>
      </div>
      ${rows}
      <div class="div"></div>
      <a href="${process.env.CLIENT_URL}/dashboard" class="btn">Plan next week →</a>
    </div>
    <div class="ftr">Weekly summaries sent every Monday 9am IST</div>
  `);
  return transporter.sendMail({
    from: `"TaskFlow Weekly" <${process.env.GMAIL_USER}>`,
    to, subject: `📊 Weekly summary — ${stats.completed||0} tasks completed`, html,
  });
}

async function verifyConnection() {
  try {
    await transporter.verify();
    console.log('✅ Email service connected (Gmail SMTP)');
  } catch (err) {
    console.warn('⚠️  Email service not configured:', err.message);
  }
}

module.exports = {
  sendVerificationEmail, sendWelcomeEmail,
  sendPasswordResetEmail, sendDueDateReminderEmail,
  sendWeeklySummaryEmail, verifyConnection,
};

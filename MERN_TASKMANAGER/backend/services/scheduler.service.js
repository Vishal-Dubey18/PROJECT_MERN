const cron = require('node-cron');
const Task = require('../models/Task');
const User = require('../models/User');
const { sendDueDateReminderEmail, sendWeeklySummaryEmail } = require('./email.service');

/**
 * Run daily at 8:00 AM — send reminder for tasks due in next 24 hours
 */
function scheduleDueDateReminders() {
  cron.schedule('0 8 * * *', async () => {
    console.log('⏰ Running due date reminder job...');
    try {
      const now = new Date();
      const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      // Find all pending tasks due in next 24 hours
      const tasks = await Task.find({
        status: 'pending',
        dueDate: { $gte: now, $lte: in24h },
      }).populate('user', 'name email');

      // Group tasks by user
      const byUser = {};
      tasks.forEach(task => {
        const uid = task.user._id.toString();
        if (!byUser[uid]) byUser[uid] = { user: task.user, tasks: [] };
        byUser[uid].tasks.push(task);
      });

      // Send one email per user
      const promises = Object.values(byUser).map(({ user, tasks: userTasks }) =>
        sendDueDateReminderEmail({
          to: user.email,
          name: user.name,
          tasks: userTasks,
        }).catch(err => console.error(`Failed reminder for ${user.email}:`, err.message))
      );
      await Promise.all(promises);
      console.log(`✅ Sent due date reminders to ${Object.keys(byUser).length} users`);
    } catch (err) {
      console.error('❌ Due date reminder job failed:', err.message);
    }
  }, { timezone: 'Asia/Kolkata' });
}

/**
 * Run every Monday at 9:00 AM IST — send weekly summary to all users
 */
function scheduleWeeklySummaries() {
  cron.schedule('0 9 * * 1', async () => {
    console.log('📊 Running weekly summary job...');
    try {
      const users = await User.find({});
      const promises = users.map(async user => {
        try {
          // Get task stats for this user
          const [total, completed, pending, highPriority] = await Promise.all([
            Task.countDocuments({ user: user._id }),
            Task.countDocuments({ user: user._id, status: 'completed' }),
            Task.countDocuments({ user: user._id, status: 'pending' }),
            Task.countDocuments({ user: user._id, priority: 'high', status: 'pending' }),
          ]);

          // Get top 5 pending tasks
          const topTasks = await Task.find({ user: user._id, status: 'pending' })
            .sort({ priority: -1, dueDate: 1 })
            .limit(5)
            .lean();

          await sendWeeklySummaryEmail({
            to: user.email,
            name: user.name,
            stats: { total, completed, pending, highPriority },
            topTasks,
          });
        } catch (err) {
          console.error(`Failed weekly summary for ${user.email}:`, err.message);
        }
      });
      await Promise.all(promises);
      console.log(`✅ Sent weekly summaries to ${users.length} users`);
    } catch (err) {
      console.error('❌ Weekly summary job failed:', err.message);
    }
  }, { timezone: 'Asia/Kolkata' });
}

function startAllJobs() {
  scheduleDueDateReminders();
  scheduleWeeklySummaries();
  console.log('⏰ Scheduled jobs started (reminders: 8am daily, summaries: 9am Monday)');
}

module.exports = { startAllJobs };

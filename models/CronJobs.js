const mongoose = require('mongoose');

const CronSchema = new mongoose.Schema(
  {
    repeatInterval: {
      type: String,
      default: '30 23 * * *',
    },
    lastRunAt: Date,
    nextRunAt: Date,
    repeatTimezone: {
      type: String,
      default: 'Australia/Sydney',
    },
  },
  { timestamps: true },
);

module.exports = mongoose.models.CronJobs || mongoose.model('CronJobs', CronSchema);

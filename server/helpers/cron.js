const cron = require("node-cron");
const ControllerApi = require("../controllers/controllerApi");
const { Habit } = require("../models");

cron.schedule("* * * * *", async () => {
  try {
    const habits = await Habit.findAll(); // Mengambil semua data dari tabel habits

    // Melakukan looping untuk setiap habit
    for (const habit of habits) {
      const time = habit.time; // Mengambil waktu habit (misalnya "10:00")

      const hour = time.getHours();
      const minute = time.getMinutes();
      const schedule = `${minute} ${hour} * * *`; // Menjadwalkan cron job berdasarkan waktu habit

      // Mengatur cron job untuk habit saat ini
      const task = cron.schedule(schedule, async () => {
        const message = habit.description; // Mengambil deskripsi habit
        const body = { message }; // Membuat objek body dengan deskripsi habit

        await ControllerApi.notificationHabit({ body }); // Mengirim data dengan req.body

        console.log("Notification sent successfully for habit:", habit.id);
      });

      task.start(); // Memulai cron job untuk habit saat ini
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
});

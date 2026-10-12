package com.medibox.care.service

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.os.Build
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat
import com.medibox.care.wear.SamsungHealthSensorManager
import kotlinx.coroutines.*

/**
 * Foreground Service for continuous or periodic sync of Samsung Galaxy Watch 5 Pro health data
 */
class HealthBackgroundSyncService : Service() {

    companion object {
        private const val CHANNEL_ID = "medibox_health_sync"
        private const val NOTIF_ID = 1001
        private const val TAG = "HealthSyncService"
    }

    private val serviceScope = CoroutineScope(Dispatchers.IO + SupervisorJob())
    private lateinit var sensorManager: SamsungHealthSensorManager

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
        sensorManager = SamsungHealthSensorManager(this)
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val notification = createNotification()
        startForeground(NOTIF_ID, notification)

        Log.d(TAG, "Health background sync service started for Galaxy Watch 5 Pro")
        sensorManager.startTracking()

        return START_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
        sensorManager.stopTracking()
        serviceScope.cancel()
        Log.d(TAG, "Health sync service stopped")
    }

    override fun onBind(intent: Intent?): IBinder? = null

    private fun createNotification(): Notification {
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("MediBox Care • Watch Synced")
            .setContentText("Monitoring Heart Rate & SpO2 from Galaxy Watch 5 Pro")
            .setSmallIcon(android.R.drawable.stat_notify_sync)
            .setOngoing(true)
            .build()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Health Sensor Sync",
                NotificationManager.IMPORTANCE_LOW
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager?.createNotificationChannel(channel)
        }
    }
}

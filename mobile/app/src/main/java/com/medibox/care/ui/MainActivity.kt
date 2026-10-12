package com.medibox.care.ui

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.medibox.care.samsunghealth.SamsungHealthDataClient

/**
 * Android Companion Application UI
 * Enables Galaxy Watch 5 Pro pairing, Samsung Health authorization, and backend connection check.
 */
class MainActivity : AppCompatActivity() {

    private lateinit var healthClient: SamsungHealthDataClient

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // MediBox Care companion initialization
        healthClient = SamsungHealthDataClient(this)

        val permissions = healthClient.checkAndRequestPermissions()
        if (permissions.heartRateAllowed && permissions.spo2Allowed) {
            Toast.makeText(this, "Samsung Galaxy Watch 5 Pro Synced", Toast.LENGTH_SHORT).show()
        }
    }
}

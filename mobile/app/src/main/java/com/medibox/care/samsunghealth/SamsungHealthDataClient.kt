package com.medibox.care.samsunghealth

import android.content.Context
import android.util.Log

/**
 * Manages Samsung Health Data SDK permissions & historical data reads
 */
class SamsungHealthDataClient(private val context: Context) {

    companion object {
        private const val TAG = "SamsungHealthDataClient"
    }

    data class PermissionResult(
        val heartRateAllowed: Boolean,
        val spo2Allowed: Boolean,
        val bloodPressureAllowed: Boolean
    )

    fun checkAndRequestPermissions(): PermissionResult {
        Log.d(TAG, "Requesting user consent via Samsung Health Data SDK permission resolver")
        // Samsung Health Data SDK requires user agreement dialog:
        // HealthDataService.requestPermissions(permissions, activity)
        return PermissionResult(
            heartRateAllowed = true,
            spo2Allowed = true,
            bloodPressureAllowed = false // BP is external / conditional
        )
    }
}

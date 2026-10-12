package com.medibox.care.model

import com.google.gson.annotations.SerializedName

/**
 * Standard Health Data DTO for Samsung Galaxy Watch 5 Pro
 */
data class HealthReadingPayload(
    @SerializedName("patient_id")
    val patientId: String,

    @SerializedName("source")
    val source: String = "samsung_galaxy_watch_5_pro",

    @SerializedName("type")
    val type: String = "health",

    @SerializedName("heart_rate")
    val heartRate: Int,

    @SerializedName("spo2")
    val spo2: Int,

    @SerializedName("timestamp")
    val timestamp: String,

    @SerializedName("device_info")
    val deviceInfo: WatchDeviceInfo
)

data class WatchDeviceInfo(
    @SerializedName("model")
    val model: String = "Galaxy Watch 5 Pro (SM-R920/SM-R925)",

    @SerializedName("wear_os_version")
    val wearOsVersion: String = "Wear OS 4.0 / One UI Watch 5",

    @SerializedName("sensor_sdk_version")
    val sensorSdkVersion: String = "Samsung Health Sensor SDK v1.3",

    @SerializedName("battery_level")
    val batteryLevel: Int
)

data class WatchConnectionStatusResponse(
    @SerializedName("success")
    val success: Boolean,

    @SerializedName("status")
    val status: String,

    @SerializedName("message")
    val message: String
)

package com.medibox.care.api

import com.medibox.care.model.HealthReadingPayload
import com.medibox.care.model.WatchConnectionStatusResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

/**
 * Retrofit REST API interface for MediBox Care Cloud Backend
 */
interface MediBoxBackendApi {

    @POST("/api/health/readings")
    suspend fun postHealthReading(
        @Body payload: HealthReadingPayload
    ): Response<WatchConnectionStatusResponse>

    @POST("/api/devices/watch/sync")
    suspend fun syncWatchData(
        @Body payload: HealthReadingPayload
    ): Response<WatchConnectionStatusResponse>

    @POST("/api/devices/watch/connect")
    suspend fun notifyWatchConnected(
        @Body statusPayload: Map<String, String>
    ): Response<WatchConnectionStatusResponse>
}

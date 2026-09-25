import { Activity, ActivityFilterParams, ActivityFormData, ApiResponse } from "../types/activity";
import { apiClient } from "./apiClient";

export const activityApi = {
  async getAll(params: ActivityFilterParams): Promise<ApiResponse<Activity>> {
    const cleanParams = Object.fromEntries(
        Object.entries(params).filter(
            ([_, value]) => value !== undefined && value !== null && value !== ""
        )
    );

    const response = await apiClient.get<ApiResponse<Activity>>('/activities', { 
        params: cleanParams 
    });
    
    return response.data;
},

    async getById(id:string): Promise<ApiResponse<Activity>>{
        const { data } = await apiClient.get<ApiResponse<Activity>>(`/activities/${id}`);
        return data;
    },

    async create(payload: ActivityFormData): Promise<ApiResponse<Activity>> {
        const { data } = await apiClient.post<ApiResponse<Activity>>('/activities', payload);
        return data;
    },

    async update(id: string, payload: Partial<ActivityFormData>): Promise<ApiResponse<Activity>> {
        const { data } = await apiClient.put<ApiResponse<Activity>>(`/activities/${id}`, payload);
        return data;
    },

    async delete(id: string): Promise<ApiResponse<null>> {
        const { data } = await apiClient.delete<ApiResponse<null>>(`/activities/${id}`);
        return data;
    }
}
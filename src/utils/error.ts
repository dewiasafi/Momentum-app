import axios from "axios";

export interface ApiErrorResponse {
     message?: string;
     statusCode?: number;
}

export const getErrorMessage = (error : unknown): string => {
     if (axios.isAxiosError<ApiErrorResponse>(error)){
          return (
               error.response?.data?.message ||
               error.message ||
               "Terjadi kesalahan pada server"
          );
     }

     if (error instanceof Error) {
          return error.message;
     }

     return "Terjadi kesalahan yang tidak diketahui";
}
import { createApi, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { mtdSocialAPI } from '@shared/libs/axios/mtd-social-api';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { BASE_URL } from '@shared/libs/axios/mtd-social-api';

enum METHODS {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH'
}

type MTDSocialAPIBaseQuery = BaseQueryFn<
  {
    url: string;
    method: METHODS;
    data?: AxiosRequestConfig['data'];
    params?: AxiosRequestConfig['params'];
    headers?: AxiosRequestConfig['headers'];
  },
  unknown,
  unknown
>;

const axiosBaseQuery =
  (): MTDSocialAPIBaseQuery =>
  async ({ url, method, data, params, headers }) => {
    try {
      const response = await mtdSocialAPI.request({
        baseURL: BASE_URL,
        url,
        method,
        data,
        headers,
        params
      });

      return { data: response.data };
    } catch (axiosError: any) {
      let err = axiosError as AxiosError;
      if (axiosError.response) {
        err = axiosError.response.data;
      }

      return { error: { status: axiosError.status, data: err } };
    }
  };

// Define a service using a base URL and expected endpoints
export const mtdSocialAPIRTKQ = createApi({
  reducerPath: 'mtd-social-api',
  baseQuery: axiosBaseQuery(),
  endpoints: () => ({})
});

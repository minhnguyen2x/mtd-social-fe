import { mtdSocialAPIRTKQ } from '@shared/libs/redux-toolkit/rtk-query';
import { METHODS } from '@shared/types/common';
import { APIRoute } from '@shared/constants/api-routes';

const loginQuery = mtdSocialAPIRTKQ.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<unknown, any>({
      query: (loginForm) => {
        return {
          method: METHODS.POST,
          url: APIRoute.SignIn,
          data: loginForm
        };
      }
    })
  }),
  overrideExisting: false
});

export const { useLoginMutation } = loginQuery;

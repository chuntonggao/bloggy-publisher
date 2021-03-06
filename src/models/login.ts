import { Effect } from 'dva';
import { stringify } from 'querystring';
import { router } from 'umi';
import { RequestResponse } from 'umi-request';

import {
    login,
    LoginRequestBody,
    LoginResponseBody,
    register,
    RegisterRequestBody,
    RegisterResponseBody
} from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';

export interface LoginModelState {}

export interface LoginModelType {
    namespace: string;
    state: LoginModelState;
    effects: {
        login: (
            { payload }: { type: string; payload: LoginRequestBody },
            { call }: { call: Function }
        ) => Generator;
        register: (
            { payload }: { type: string; payload: RegisterRequestBody },
            { call }: { call: Function }
        ) => Generator;
        logout: Effect;
    };
}

const redirectToHome = (): void => {
    const urlParams = new URL(window.location.href);
    const params = getPageQuery();
    let { redirect } = params as { redirect: string };
    if (redirect) {
        const redirectUrlParams = new URL(redirect);
        if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
                redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
        } else {
            window.location.href = '/';
            return;
        }
    }
    router.replace(redirect || '/');
};

const LoginModel: LoginModelType = {
    namespace: 'login',

    state: {},

    effects: {
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        *login(
            { payload }: { type: string; payload: LoginRequestBody },
            { call }: { call: Function }
        ) {
            const response: RequestResponse<LoginResponseBody> = (yield call(
                login,
                payload
            )) as RequestResponse<LoginResponseBody>;
            const loginResponseBody: LoginResponseBody = response?.data;

            // login successful
            if (loginResponseBody) {
                setAuthority('admin');
                redirectToHome();
            }
        },

        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        *register(
            { payload }: { type: string; payload: RegisterRequestBody },
            { call }: { call: Function }
        ) {
            const response: RequestResponse<RegisterResponseBody> = (yield call(
                register,
                payload
            )) as RequestResponse<RegisterResponseBody>;
            const registerResponseBody: RegisterResponseBody = response?.data;

            // register successful
            if (registerResponseBody) {
                setAuthority('admin');
                redirectToHome();
            }
        },

        logout(): void {
            const { redirect } = getPageQuery();
            // Note: There may be security issues, please note
            if (window.location.pathname !== '/user/login' && !redirect) {
                router.replace({
                    pathname: '/user/login',
                    search: stringify({
                        redirect: window.location.href
                    })
                });
            }
        }
    }
};

export default LoginModel;

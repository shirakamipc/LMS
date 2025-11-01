import { AxiosConfig } from './AxiosConfig';

export const AuthApi = {
    login: (data) => {
        return AxiosConfig.post('/auth/signin', data);
    },
    register: (data) => {
        return AxiosConfig.post('/auth/signup', data);
    },
    refreshToken: (data) => {
        return AxiosConfig.post('/auth/refresh', data);
    },
    logout: () => {
        return AxiosConfig.post('/auth/logout');
    },
    getProfile: () => {
        return AxiosConfig.get('/auth/profile');
    },
};

import { baseAPIUrl } from '../../constants';

export const makeRequest = async (endpoint, method = 'GET', body = null) => {
    const init = {
        method,
        headers: new Headers({ 'Content-Type': 'application/json' }),
    }
    if (body) {
        init.body = body;
    }
    return fetch(baseAPIUrl + endpoint, init)
}
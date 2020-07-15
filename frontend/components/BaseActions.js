'use strict'

import {action, toJS} from 'mobx'
import request from '../util/request'
import {param} from '../util/param'
import Cookie from 'js-cookie'

export default class Actions {
    constructor(store) {
        this.store = store
    }

    get = async(api, params = {}) => {
        params._r = params._r || Math.random()

        let url = api + `?${param(params)}`
        let data = await request(url)
        return toJS(data)
    }

    post = async(api, data, jsonHeaders, allRes) => {
        if (jsonHeaders) {
            return await request(api, {
                method: 'POST',
                body: JSON.stringify(data)
            }, jsonHeaders, allRes)
        } else {
            return await request(api, {
                method: 'POST',
                body: param(data)
            }, jsonHeaders, allRes)
        }
    }

    formPost = (url = ``, data = {}, noMsg=false) => {
        // Default options are marked with *
        let headers = {
            "Content-Type": "application/json; charset=utf-8",
            // "Content-Type": "application/x-www-form-urlencoded",
        }

        if (Cookie.get('csrftoken') && Cookie.get('csrftoken') !== undefined && Cookie.get('csrftoken') !== 'undefined') {
            headers["X-CSRFToken"] = Cookie.get('csrftoken')
        }

        if (Cookie.get('token') && Cookie.get('token') !== undefined && Cookie.get('token') !== 'undefined') {
            headers["Authorization"] = "Token " + Cookie.get('token')
        }

        return fetch(url, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "include", // include, same-origin, *omit
            headers: headers,
            redirect: "follow", // manual, *follow, error
            referrer: "no-referrer", // no-referrer, *client
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        })
            .then(handleResponse)
            .then((response) => {
                // HTTP status codes ,大于400是错误状态
                // https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
                return response

                // TODO: 通过status code来判断是否需要抛出错误
                // throw error
            })// parses response to JSON
            .catch(error => {
                if (noMsg){
                    throw error;
                }

                //TODO: create global error alerter
                if ('err' in error) {
                    let err = error["err"]
                    if (err instanceof Object && !(err instanceof Array)) {
                        for (var i in err) {
                            console.log(err[i])
                            break;
                        }
                    } else if (!(err instanceof Object)) {
                        if (error["status"] == 403 || error["status"] == 401) {
                            console.log(err)
                        } else {
                            console.log("Something went wrong!Please try again later")
                        }

                    }
                }
                return false
            });
    };

    put = async(api, data, jsonHeaders, allRes) => {
        if (jsonHeaders) {
            return await request(api, {
                method: 'PUT',
                body: JSON.stringify(data)
            }, jsonHeaders, allRes)
        } else {
            return await request(api, {
                method: 'PUT',
                body: param(data)
            }, jsonHeaders, allRes)
        }
    }

    patch = async(api, data, jsonHeaders, allRes) => {
        if (jsonHeaders) {
            return await request(api, {
                method: 'PATCH',
                body: JSON.stringify(data)
            }, jsonHeaders, allRes)
        } else {
            return await request(api, {
                method: 'PATCH',
                body: param(data)
            }, jsonHeaders, allRes)
        }
    }

    delete = async(api, data, jsonHeaders, allRes) => {
        if (jsonHeaders) {
            return await request(api, {
                method: 'DELETE',
                body: JSON.stringify(data)
            }, jsonHeaders, allRes)
        } else {
            return await request(api, {
                method: 'DELETE',
                body: param(data)
            }, jsonHeaders, allRes)
        }
    }
}

function handleResponse(response) {
    let contentType = response.headers.get('content-type')
    if (contentType.includes('application/json')) {
        return handleJSONResponse(response)
    } else if (contentType.includes('text/html')) {
        return handleTextResponse(response)
    } else {
        // Other response types as necessary. I haven't found a need for them yet though.
        throw new Error(`Sorry, content-type ${contentType} not supported`)
    }
}


function handleJSONResponse(response) {
    return response.json()
        .then(json => {
            if (response.ok) {
                return json
            } else {
                return Promise.reject({
                    err: json,
                    status: response.status,
                    statusText: response.statusText
                })
            }
        })
}

function handleTextResponse(response) {
    return response.text()
        .then(text => {
            if (response.ok) {
                return text
            } else {
                return Promise.reject({
                    status: response.status,
                    statusText: response.statusText,
                    err: text
                })
            }
        })
}
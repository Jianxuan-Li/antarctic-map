/**
 * 基于 fetch 封装的 请求函数
 */
import fetch from 'isomorphic-fetch'
import Cookie from 'js-cookie'

export default async (input, options = {}, jsonHeaders = false, allResponse = false) => {
    options = Object.assign({
        //credentials: "same-origin"
        credentials: 'include' // 在 request header 中自动附带 cookie
    }, options)

    let headers = {}

    if (/[post|put|patch]/i.test(options.method)) {
        if (typeof options.body === 'string' && !jsonHeaders)
            headers["Content-Type"] = "application/x-www-form-urlencoded; charset=utf-8"
        if (jsonHeaders)
            headers["Content-Type"] = "application/json"
    }

    let url = input.split("?")

    let token = Cookie.get('token')

    if (token != undefined) {
        headers["Authorization"] = "Token " + Cookie.get('token')
    }

    headers["Personal"] = "true"
    options.headers = Object.assign({}, headers, options.headers || {})

    if (allResponse)
        return await fetch(input, options)

    const response = await fetch(input, options)
    const status = response.status

    if (status === 204)
        return null

    // if (status === 401)
    //  location.href = location.origin + location.pathname + '#/login'

    if (status >= 500){
        const text = await response.text()
        return {text, request_error: {status, response}}
    }

    const serialized_json = await response.json()

    if (status >= 400){
        serialized_json['request_error'] = {
            status: status
        }
    }
    return serialized_json
}

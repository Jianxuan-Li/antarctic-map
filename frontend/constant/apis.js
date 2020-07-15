'use strict'
export const LANGUAGE_CODE = location.pathname.indexOf('/en/') !== -1 ? 'en' : 'zh-hans'

let apiServer = window.API_SERVER || API_SERVER_PLACEHOLDER
export const IS_PRODUCTION = window.PRODUCTION || PRODUCTION

export const API_SERVER_NL = apiServer

if(LANGUAGE_CODE)
    apiServer += '/' + LANGUAGE_CODE

export const API_SERVER = apiServer

export const USER_LOGIN = API_SERVER  + '/api/account/login/'
export const SIGN_OUT = API_SERVER + '/api/account/signout/'
export const USER_VALIDATE = API_SERVER + '/api/account/validate/'
export const USER_REGISTER = API_SERVER + '/api/account/register/'
export const USER_FORGOT = API_SERVER + '/api/account/forgot/'
export const USER_SENDEMAIL = API_SERVER + '/api/account/send/'
export const USER_RESET = API_SERVER + '/api/account/reset/'
export const USER_CHANGE = API_SERVER + '/api/account/change/'

export const API_UPLOAD = API_SERVER_NL + '/api/attachment/upload/'
export const API_IMAGE = (name, w, h) => API_SERVER_NL + `/api/attachment/image/${name}/${w}/${h}/`
export const MEDIA_STATIC = (name) => `/media/${name}`
export const API_AVATAR_UPLOAD = API_SERVER_NL + '/api/attachment/upload-avatar'
export const API_AVATAR = (path, size) => API_SERVER_NL + `/api/attachment/avatar/${path}/${size}/`

export const COMMENTS = link => API_SERVER + `/api/archive/comments/${link}`
export const COMMENT = id => API_SERVER + `/api/archive/comment/${id}`
export const REPLIES = id => API_SERVER + `/api/archive/replies/${id}`

export const MY_COMMENTS = API_SERVER + '/api/archive/my/comments'

export const MY_VOCABULARY = API_SERVER + '/api/vocabulary/my/'

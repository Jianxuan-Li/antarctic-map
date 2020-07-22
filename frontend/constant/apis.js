'use strict'

const apiServer = window.API_SERVER || API_SERVER_PLACEHOLDER
export const IS_PRODUCTION = window.PRODUCTION || PRODUCTION

export const DEM_MEAN = (approach) => apiServer + `/api/geodata/dem/mean/${approach}`


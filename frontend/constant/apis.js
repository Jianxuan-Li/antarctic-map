'use strict'

const apiServer = window.API_SERVER || API_SERVER_PLACEHOLDER
export const IS_PRODUCTION = window.PRODUCTION || PRODUCTION

export const DEM_ANALYZE = (algorithm, approach) => apiServer + `/api/geodata/dem/${algorithm}/${approach}`
export const SEAICE_DATASET = apiServer + 'api/geodata/seaice/dataset'


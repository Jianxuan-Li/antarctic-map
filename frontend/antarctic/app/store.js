import { observable } from "mobx"

const LANGUAGE_CODE = location.pathname.indexOf('/en/') !== -1 ? 'en' : 'zh-hans'

class Store {
  @observable view = null
  @observable map = null
  @observable sources = {}
  @observable currentLayer = false

  availableLayers = [
    {
      key: 1,
      name: 'Historic sites and monuments point',
      value: 'Historic_sites_and_monuments_point'
    }, {
      key: 2,
      name: 'Lakes',
      value: 'Lakes_high_res_polygon'
    }, {
      key: 3,
      name: 'Rock outcrop',
      value: 'Rock_outcrop_medium_res_polygon'
    }, {
      key: 4,
      name: 'Contours',
      value: 'Contours_medium_res_line'
    },  {
      key: 5,
      name: 'Antarctic circle',
      value: 'Antarctic_Circle_line'
    }
  ]
}

export default new Store()
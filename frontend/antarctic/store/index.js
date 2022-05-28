import { observable } from "mobx"

class Store {
  @observable view = null
  @observable map = null
  @observable sources = {}

  @observable currentLayer = false
  @observable currentLayerValue = null
  @observable currentBaseLayer = false
  @observable currentBaseLayerValue = null

  @observable bounds = [-4524537.706531357, -4524537.706531357, 
                          4524537.706531376, 4524537.706531376]
  @observable scale = null

  @observable tilesLoading = false
  @observable tilesProgress = '0%'

  @observable baseLayerLoading = false
  @observable baseLayerProgress = '0%'

  @observable showPanel = true
  @observable firstLoad = true
  @observable windowSize = null

  @observable currentDataset = null

  baseLayers = [
    {
      key: 1,
      name: 'Seamask',
      value: 'Seamask_medium_res_polygon'
    }, {
      key: 2,
      name: 'Landsat image mosaic',
      value: 'LIMA_image_mosaic'
    }, {
      key: 3,
      name: 'DEM hillshade  [Analytics tools]',
      value: 'dem_hillshade',
      analysis: true
    }
  ]

  baseLayerBounds = {
    'Seamask_medium_res_polygon': [-4524537.706531357, -4524537.706531357, 4524537.706531376, 4524537.706531376],
    'LIMA_image_mosaic': [-2668274.9891312392, -2294625.04002297, 2813804.919897192, 2362334.9699799465],
    'dem_hillshade': [-2668274.9891312392, -2294625.04002297, 2813804.919897192, 2362334.9699799465]
  }

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
    }/*, {
      key: 4,
      name: 'Contours',
      value: 'Contours_medium_res_line'
    }*/, {
      key: 5,
      name: 'Antarctic circle',
      value: 'Antarctic_Circle_line'
    }, {
      key: 6,
      name: 'DEM',
      value: 'krigged_dem_nsidc',
    }
    // TODO: Seaice
  ]
}

export default new Store()
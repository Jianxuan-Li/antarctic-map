import Draw from 'ol/interaction/Draw.js'
import { Vector as VectorSource } from 'ol/source.js'

import { createEditingStyle } from '@util/map/styles.js'

export default class MapDraw {
  constructor(map) {
      this.map = map
      this.draw = null
  }

  attachDraw(callback){
    var source = new VectorSource({wrapX: false});

    let styles = createEditingStyle()
    this.draw = new Draw({
        source: source,
        type: 'Polygon',
        style: (feature, resolution) => {
            return styles[feature.getGeometry().getType()];
        }
    });

    this.draw.on('drawend', function (e) {
        if(callback){
            callback(e)
        }
    });
  }

  startDraw(){
    this.map.addInteraction(this.draw);
  }

  stopDraw(){
    this.map.removeInteraction(this.draw);
  }
}

import Draw, { createRegularPolygon, createBox } from 'ol/interaction/Draw.js';
import { Vector as VectorSource } from 'ol/source.js';

export default class MapDraw {
  constructor(map) {
      this.map = map
      this.draw = null
  }

  attachDraw(callback){
    var source = new VectorSource({wrapX: false});

    this.draw = new Draw({
        source: source,
        type: 'Circle',
        geometryFunction: createBox()
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

import { METERS_PER_UNIT } from 'ol/proj';

export function getScale(map, evt = null){
    let resolution = null
    if (evt) 
        resolution = evt.target.get('resolution')
    else
        resolution = map.getView().getResolution();


    let units = map.getView().getProjection().getUnits();
    let dpi = 25.4 / 0.28;
    let mpu = METERS_PER_UNIT[units];
    let scale = resolution * mpu * 39.37 * dpi;
    if (scale >= 9500 && scale <= 950000) {
        scale = Math.round(scale / 1000) + "K";
    } else if (scale >= 950000) {
        scale = Math.round(scale / 1000000) + "M";
    } else {
        scale = Math.round(scale);
    }
    return scale
}
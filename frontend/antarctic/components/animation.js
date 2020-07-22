import { easeOut } from 'ol/easing'

export class Animations {
    constructor(map){
        this.map = map
        this.view = map.getView()
    }

    zoomOut(){
        if(this.view.getZoom() < 2) return

        this.view.animate({
            zoom: this.view.getZoom() - 1,
            duration: 500,
            easing: easeOut
        })
    }

    zoomIn(){
        if(this.view.getZoom() >  23) return

        this.view.animate({
            zoom: this.view.getZoom() + 1,
            duration: 500,
            easing: easeOut
        })
    }

    flyToLA(){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let zoom = this.view.getZoom();

                this.view.animate({
                    center: [-10836450.725974582, 4949498.545840508],
                    zoom: 5,
                    duration: 3000,
                    easing: easeOut
                }, () => {
                    setTimeout(()=> {
                        let zoom = this.view.getZoom();
                        this.view.animate({
                            center: [-13149941.164959537, 4021202.4500920675],
                            zoom: 10,
                            duration: 1500,
                            easing: easeOut
                        }, () => {
                            resolve();
                        })
                    }, 1000)
                })
            }, 2000)
        })
    }

    blink(layer){
        return new Promise(function (resolve, reject) {
            layer.setOpacity(0.3);

            let timer, t = 1,
                direction = '+',
                repeat = 1;
            timer = setInterval(function () {
                if (t >= 9) direction = '-';
                if (t <= 0) {
                    direction = '+';
                    repeat++
                }

                if (direction === '+')
                    t++;
                else
                    t--;

                if (repeat >= 3) {
                    layer.setOpacity(1);
                    clearInterval(timer);
                    resolve(true);
                } else
                    layer.setOpacity(t * 0.1);
            }, 100);
        });
    }

    backToHeihe(){
        this.view.animate({
            center: [-10836450.725974582, 4949498.545840508],
            zoom: 7,
            duration: 1500,
            easing: easeOut
        })
    }

    fadeOut(layer, min, max){
        return new Promise(function (resolve, reject) {
            let timer = setInterval(()=>{
                layer.setOpacity(max);
                max = max - 0.1
                if(max <= min){
                    clearInterval(timer)
                    return resolve(true)
                }
            },100)
        })
    }

    fadeIn(layer, min, max){
        return new Promise(function (resolve, reject) {
            let timer = setInterval(()=>{
                layer.setOpacity(min);
                min = min + 0.1
                if(min >= max){
                    clearInterval(timer)
                    return resolve(true)
                }
            },100)
        })
    }

    stay(time){
        return new Promise((resolve, reject) => {
            setTimeout(()=>{
                return resolve()
            }, time)
        })
    }
}
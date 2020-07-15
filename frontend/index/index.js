import Cookie from 'js-cookie'
import style from './index.scss';

import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

library.add(fas, far, fab)
dom.i2svg()

class Index{
    constructor() {
        console.log('Yeti need a new job~ yeti@freeyeti.net')
    }

    
}

(function() {
    const index = new Index()
    
})();
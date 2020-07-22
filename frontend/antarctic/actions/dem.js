import {action, runInAction} from 'mobx'
import store from '@antarctic/store/dem'

import BaseActions from '@components/BaseActions'
import * as apis from '@constant/apis'

class Actions extends BaseActions {
    @action
    merge = (obj = {}) => {
        Object.assign(this.store, obj)
    }

    @action
    toggleDemTools(enable = null) {
        if (enable !== null){
            this.store.enable = enable
            return
        }

        this.store.enable = !this.store.enable
    }
}

export default new Actions(store)
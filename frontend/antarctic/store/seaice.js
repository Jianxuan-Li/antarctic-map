import { observable } from "mobx"

class Store {
    // For image layers    
    @observable currentDate = null
    @observable currentLayer = null

    // For sea ice data analysis
    @observable draw = null
}

export default new Store()

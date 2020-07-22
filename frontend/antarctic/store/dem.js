import { observable } from "mobx"

class Store {
    @observable enable = false
    
    @observable draw = null
}

export default new Store()

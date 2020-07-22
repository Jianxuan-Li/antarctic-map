import { observable } from "mobx"

class Store {
    @observable enable = false

    @observable draw = null
    @observable paintedLayer = null
}

export default new Store()

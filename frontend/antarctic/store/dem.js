import { observable } from "mobx"

class Store {
    @observable enable = false
}

export default new Store()

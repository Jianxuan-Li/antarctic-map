
export const formValidateFieldsAndScroll = (form) => {
    return new Promise((resolve, reject) => {
        form.validateFieldsAndScroll((error, values) => {
            if (error){
                reject(error)
                return
            }
            resolve(values)
        })
    })
}
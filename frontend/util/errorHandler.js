import { message } from 'antd'

const errorHandler = (response_json) => {
  if(response_json.request_error){

    // Django form error
    if(response_json.request_error.status == 400){
      for (let key in response_json){
        if (key == 'request_error') continue

        for (let i in response_json[key]){
          message.error(response_json[key][i])
          return true
        }
      }
    }
    
    //Server Error
    if(response_json.text){
      let lines = response_json.text.split("\n")
      for (let i in lines){
        if(lines[i] == '') return true
        message.error(lines[i])
      }
      return true
    }

    message.error("Unknow request error occurred.")
    return true
  }

  return false
}

export default errorHandler

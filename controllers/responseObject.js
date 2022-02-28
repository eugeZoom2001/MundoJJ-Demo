class CustomAPIResponse  {
    constructor(result, data) {
       this.result= result
       if(data){
        this.data = data
       } 
    }
  }
  
  const createCustomResponse = (result, data) => {
    return new CustomAPIResponse(result, data)
  }
  
  module.exports = { createCustomResponse, CustomAPIResponse }
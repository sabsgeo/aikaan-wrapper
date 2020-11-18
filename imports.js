const axios = require('axios').default;

module.exports.imports = {
  requestTypes: {
    'get': axios.get,
    'post': axios.post,
    'delete': axios.delete,
    'put': axios.put
  }
}
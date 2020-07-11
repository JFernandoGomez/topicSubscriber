const axios = require('axios');

const notifySubscriber = async (url, message) => {
  return await axios.post(url, message)
}

module.exports = notifySubscriber;
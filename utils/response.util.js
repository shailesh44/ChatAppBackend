

/**
 * Success
 * @param {*} data 
 */
 const success = function (data) {
    data = data || {}
    return { code: 200, data: data, error:false }
}


/**
 * Error
 * @param {*} code 
 * @param {*} data 
 */
const error = function (code, data) {
    code = code || 500;
    if (!code && !data) {
        return { code: code, message: 'Internal Server Error' }
    }
    
    return { code: code, data: (data ? (data.message ? data.message: data) : 'Something went wrong!'), error:true }
}



/**
 * EXPORT MODULE
 */

module.exports = {
    success,
    /**
    * @default Response Server Error (500)
    */
    error
}


module.exports.response = {
    success: (body) => {
        return {
            statusCode: 200,
            body: JSON.stringify(body)
        }
    },
    error: (message) => {
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: {
                    message
                }
            })
        }
    }
}
module.exports = ({res, error, message, data = null, status =200}) => {

    if(error){
        console.log(error);
        return res.status(status).send({
            success: "Something went wrong!",
            error: error,     
        })
    } else{
        return res.status(status).send(
            !data? {
                success: true,
                message
            } :
            {
                success: true,
                result: data
            }
        )
    }
}

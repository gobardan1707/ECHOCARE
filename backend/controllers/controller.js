import * as service from '../services/service.js';
 const getMessage = async (req, res) => {
    try{
        const message = await service.fetchMessage();
        res.status(200).json({message});
    }catch(error) {
        console.error('Error fetching message:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};
export default {
    getMessage
};
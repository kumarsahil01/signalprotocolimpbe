import models from '../models/index.js'
const {Device} = models;

export const registerDevice =async (req, res)=>{
    try {
        const {deviceName, deviceType}=req.body;
        const userId = req.user.sub;

        if(!deviceName || !deviceType){
            return res.status(400).json({error:'Device Name and type required'})
        }

        const device = await Device.create({
                userId,
                deviceName,
                deviceType
        })

        res.status(201).json({message:'Device Registered',device})

    }catch(error){
            console.error('Device resgistration failed', error);
            res.status(500).json({error:error.message});
    }
}
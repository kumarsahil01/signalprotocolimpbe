// src/controllers/keyController.js
import models from '../models/index.js';
const { UserKey } = models;

export const uploadKeys = async (req, res) => {
  try {
    const { identityKeyPub, signedPrekeyPub, signedPrekeySignature, oneTimePrekeys,deviceId } = req.body;

    if (!identityKeyPub || !signedPrekeyPub || !signedPrekeySignature) {
      return res.status(400).json({ error: 'Missing keys' });
    }

    const userId = req.user.sub; 
    console.log(userId)
    const keys = await UserKey.create({
      userId,
      identityKeyPub,
      signedPrekeyPub,
      signedPrekeySignature,
      oneTimePrekeys,
      deviceId
    });
    console.log(keys)

        res.status(201).json({ message: 'Keys uploaded', keys });
    } catch (error) {
    console.error('Key upload failed:', error);
    res.status(500).json({ error: error.message });
    }

};

export const getKeys = async (req, res) => {
  try {
    const { userId } = req.params;
    const keys = await UserKey.findOne({ where: { userId } });
    if (!keys) return res.status(404).json({ error: 'No keys found' });

    // Don’t send private data, only public keys
    res.json({
      identityKeyPub: keys.identityKeyPub,
      signedPrekeyPub: keys.signedPrekeyPub,
      signedPrekeySignature: keys.signedPrekeySignature,
      oneTimePrekeys: keys.oneTimePrekeys, // client consumes one
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch keys' });
  }
};

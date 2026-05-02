import express from 'express'
import { addLensType, deleteLensType, getAllLensType, updateLensType } from '../controllers/lensType.js';
import { addLensFeature, deleteFeature, getAllLensFeatures, updateFeature } from '../controllers/lensFeatures.js';



const lensRouter = express.Router();

lensRouter.post('/add',addLensType)
lensRouter.post('/update',updateLensType)
lensRouter.post('/delete',deleteLensType)
lensRouter.get('/getall',getAllLensType)

lensRouter.post('/addfeature',addLensFeature)
lensRouter.post('/updatefeature',updateFeature)
lensRouter.post('/deletefeature',deleteFeature)
lensRouter.get('/getallfeature',getAllLensFeatures)

export default lensRouter;
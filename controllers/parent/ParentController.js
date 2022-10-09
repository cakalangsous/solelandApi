import ParentModel from '../../models/ParentModel.js'

export const profile = (req, res) => {
    console.log(req.email, req.uuid)
    res.send('parent profile')
}
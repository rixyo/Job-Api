const express =require("express")


const router = express.Router()
const {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
  getJob,
} = require('../controllers/job')

router.route('/').post(createJob).get(getAllJobs)

router.route('/:id').get(getJob).delete(deleteJob).patch(updateJob)

module.exports = router



   
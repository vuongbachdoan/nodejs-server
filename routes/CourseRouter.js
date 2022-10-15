const express = require('express');
const CourseController = require('../controllers/CourseController');
const router = express.Router();

router.get('/', CourseController.get);
router.get('/:id', CourseController.getOne);
router.post('/', CourseController.post);
router.patch('/:id', CourseController.update);
// router.delete('/:id', CourseController.delete)
router.delete('/delete-multi', CourseController.deleteMulti)
router.delete('/delete-all', CourseController.deleteAll)

module.exports = router;      
const mongoose = require('mongoose')
const Course = require('../models/Course')

const CourseController = {
    get: async (req, res) => {
        try {
            const courses = await Course.find();
            // return res.json(
            //     jwt.sign(
            //         req.body, 
            //         secretKey,
            //         {
            //             expiresIn: '1h',
            //             algorithm: 'HS256'
            //         }
            //     )
            // )

            return res.status(200).json({
                success: true,
                message: 'Get Course Successfully',
                data: courses
            })
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            })
        }
    },
    getOne: async (req, res) => {
        try {
            const course = await Course.findById(req.params.id)
            return res.status(200).json({
                success: true,
                message: 'Get Course Successfully',
                data: course
            })
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Course does not exist',
                error: err.message    
            })
        }
    },
    post: async (req, res) => {
        try {
            const course = new Course({
                _id: mongoose.Types.ObjectId(),
                title: req.body.title,
                description: req.body.description
            })

            const savedCourse = await course.save();
            return res.status(201).json({
                success: true,
                message: 'Create new course successfully',
                data: savedCourse
            })
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            })
        }
    },
    update: async (req, res) => {
        try {
            const courseUpdating = await Course.findById(req.params.id)
            const courseUpdated = await Object.assign(courseUpdating, req.body)
            return res.status(200).json({
                success: true,
                message: 'Update course successfully',
                data: courseUpdated
            })
        } catch (err) {
            return res.status(500).json({   
                success: false,
                message: 'Can not update this course',
                error: err.message
            })
        }
    },
    delete: async (req, res) => {
        try {
            const deletedCourse = await Course.findByIdAndRemove(req.params.id);
            return res.status(200).json({
                success: true,
                message: 'Delete course successfully',
                data: deletedCourse
            })
        }
        catch (err) {   
            return res.status(500).json({
                success: false,
                message: 'Can not delete this course',
                error: err.message
            })
        }
    },
    deleteAll: async (req, res) => {
        try {
            const deleted = await Course.remove({})
            return res.status(200).json({
                success: true,
                message: 'Delete all course successfully',
                data: deleted
            })

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Can not delete this courses',
                error: err.message
            })
        }
    },
    deleteMulti: async (req, res) => {
        try {
            const result = await Course.remove({_id: {'$in': req.body.ids}})
            return res.status(200).json({
                success: true,
                message: 'Delete courses successfully',
                data: result
            })
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Can not delete this courses',
                error: err.message
            })
        }
    }
}

module.exports = CourseController
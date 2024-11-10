const express = require('express');
const controller = require('../controllers/admin');

const router = express.Router();

// 1. ADMIN

// 1.3 Dashboard
router.get('/dashboard', controller.getDashboard);

// 1.5 Profile
router.get('/profile', controller.getOverview);

// 2.STAFFS
// 2.1 Add staff
router.get('/addStaff', controller.getAddStaff);
router.post('/addStaff', controller.postAddStaff);
// 2.2 Get staffs on query
router.get('/getStaff', controller.getRelevantStaff);
router.post('/getStaff', controller.postRelevantStaff);
// 2.3 Get all staffs
router.get('/getAllStaffs', controller.getAllStaff);
// 2.4 Modify existing staffs
router.get('/settings/staff/:id', controller.getStaffSettings);
router.post('/settings/staff', controller.postStaffSettings);

// 3.STUDENTS
// 3.1 Add Student
router.get('/addStudent', controller.getAddStudent);
router.post('/addStudent', controller.postAddStudent);
// 3.2 Get Students on query
router.get('/getStudent', controller.getRelevantStudent);
router.post('/getStudent', controller.postRelevantStudent);
// 3.3 Get all Students
router.get('/getAllStudents', controller.getAllStudent);
// 3.4 Modify existing students
router.get('/settings/student/:id', controller.getStudentSettings);
router.post('/settings/student', controller.postStudentSettings);

// 4.CLASSES (subjects mapping courses ,staffs and section)
// 4.1 Select class
router.get('/getClass', controller.getClass);
// 4.2 Add class
router.get('/addClass', controller.getAddClass);
router.post('/addClass', controller.postAddClass);
// 4.3 Modify existing classes
router.get('/settings/class/:id', controller.getClassSettings);
router.post('/settings/class', controller.postClassSettings);

// 5.DEPARTMENTS
// 5.1 Select department
router.get('/getDept', controller.getDept);
// 5.2 Add department
router.get('/addDept', controller.getAddDept);
router.post('/addDept', controller.postAddDept);
// 5.3 Modify existing department
router.get('/settings/department/:id', controller.getDeptSettings);
router.post('/settings/department', controller.postDeptSettings);

// 6.COURSES
// 6.1 Get all courses
router.get('/getAllCourses', controller.getAllCourse);
// 6.2 Get courses on query
router.get('/getCourse', controller.getRelevantCourse);
router.post('/getCourse', controller.postRelevantCourse);
// 6.3 Add course
router.get('/addCourse', controller.getAddCourse);
router.post('/addCourse', controller.postAddCourse);
// 6.4 Modify existing courses
router.get('/settings/course/:id', controller.getCourseSettings);
router.post('/settings/course', controller.postCourseSettings);

module.exports = router;

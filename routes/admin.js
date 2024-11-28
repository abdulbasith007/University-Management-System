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
router.get('/getStudent', controller.getRelevantStudents);
router.post('/getStudent', controller.postRelevantStudents);
router.get('/getRelevantStudents', controller.getRelevantStudents);
router.post('/getRelevantStudents', controller.postRelevantStudents);
// 3.3 Get all Students
router.get('/getAllStudents', controller.getAllStudents);
// 3.4 Modify existing students
router.get('/settings/student/:id', controller.getStudentSettings);
router.post('/settings/student', controller.postStudentSettings);

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

// 7.CLUBS
// 7.1 Get all clubs
router.get('/getAllClubs', controller.getAllClubs);
// 7.2 Get clubs on query
router.get('/getClubs', controller.getRelevantClub);
router.post('/getClubs', controller.postRelevantClub);
// 7.3 Add club
router.get('/addClub', controller.getAddClub);
router.post('/addClub', controller.postAddClub);
// 7.4 Modify existing clubs
router.get('/settings/club/:id', controller.getClubSettings);
router.post('/settings/club', controller.postClubSettings);

// 8.SCHOLARSHIPS
// 8.1 Get all scholarships
router.get('/getAllScholarships', controller.getAllScholarships);
// 8.2 Get scholarships on query
router.get('/getScholarships', controller.getRelevantScholarship);
router.post('/getScholarships', controller.postRelevantScholarship);
// 8.3 Add scholarship
router.get('/addScholarship', controller.getAddScholarship);
router.post('/addScholarship', controller.postAddScholarship);
// 8.4 Modify existing scholarships
router.get('/settings/scholarship/:id', controller.getScholarshipSettings);
router.post('/settings/scholarship/:id', controller.postScholarshipSettings);
router.post('/settings/scholarship', controller.postScholarshipSettings);

// Route to handle assigning scholarship to a student
router.post('/assignScholarship', controller.assignScholarshipToStudent);


// 9.INTERNSHIPS
// 9.1 Get all internships
router.get('/getAllInternships', controller.getAllInternships);
// 9.2 Get internships on query
router.get('/getInternships', controller.getRelevantInternship);
router.post('/getInternships', controller.postRelevantInternship);
// 9.3 Add internship
router.get('/addInternship', controller.getAddInternship);
router.post('/addInternship', controller.postAddInternship);
// 9.4 Modify existing internships
router.get('/settings/internship/:id', controller.getInternshipSettings);
router.post('/settings/internship', controller.postInternshipSettings);

// // 10.PAYMENTS
// // 10.1 Get all payments
// router.get('/getAllPayments', controller.getAllPayments);
// // 10.2 Get payments on query
// router.get('/getPayment', controller.getRelevantPayment);
// router.post('/getPayment', controller.postRelevantPayment);
// // 10.3 Add payment
// router.get('/addPayment', controller.getAddPayment);
// router.post('/addPayment', controller.postAddPayment);
// // 10.4 Modify existing payments
// router.get('/settings/payment/:id', controller.getPaymentSettings);
// router.post('/settings/payment', controller.postPaymentSettings);

// 11.EXAMS
// 11.1 Get all exams
router.get('/getAllExams', controller.getExams);
// 11.2 Get exams on query
router.get('/getRelevantExams', controller.getRelevantExams);
router.post('/getRelevantExams', controller.postRelevantExams);
router.get('/getExams', controller.getRelevantExams);
router.post('/getExams', controller.postRelevantExams);
// 11.3 Add exam
router.get('/addExam', controller.getAddExam);
router.post('/addExam', controller.postAddExam);
// 11.4 Modify existing exams
router.get('/settings/exam/:id', controller.getExamSettings);
router.post('/settings/exam', controller.postExamSettings);

// 11.5 View and manage student marks for an exam
router.get('/editExam/:id', controller.getManageExam);
router.post('/editExam/:id', controller.postManageExam);


// 12.ALUMNI
// 12.1 Get all alumni
router.get('/getAllAlumni', controller.getAllAlumni);
// 12.2 Get alumni on query
router.get('/getAlumni', controller.getRelevantAlumni);
router.post('/getAlumni', controller.postRelevantAlumni);
// 12.3 Add alumni
router.get('/addAlumni', controller.getAddAlumni);
router.post('/addAlumni', controller.postAddAlumni);
// 12.4 Modify existing alumni
router.get('/settings/alumni/:id', controller.getAlumniSettings);
router.post('/settings/alumni', controller.postAlumniSettings);

// 13.PARENTS
// 13.1 Get all parents
router.get('/getAllParents', controller.getAllParents);
// 13.2 Get parents on query
router.get('/getParentContacts', controller.getRelevantParent);
router.post('/getParentContacts', controller.postRelevantParent);
router.get('/getRelevantParent', controller.getRelevantParent);
router.post('/getRelevantParent', controller.postRelevantParent);
// 13.3 Add parent
router.get('/addParentContact', controller.getAddParentContact);
router.post('/addParentContact', controller.postAddParentContact);
// 13.4 Modify existing parents
router.get('/settings/parent/:id', controller.getParentSettings);
router.post('/settings/parent', controller.postParentSettings);

// Add new routes for course assignment
router.get('/assignCourses', controller.getAssignCourses);
router.post('/assignCourses', controller.postAssignCourses); 

router.get('/viewCourseAssignments', controller.getCourseAssignmentsByDepartment);

// 1. View all payments
router.get('/payments', controller.getPayments);

// 2. Filter payments by student
router.post('/payments', controller.getPaymentsByStudent);

// 3. View all students for filtering
router.get('/selectStudentForPayments', controller.getAllStudentsP);

// 1.4 Get the form to add a payment (show form with students)
router.get('/addPayment', controller.getAllStudentsForPaymentForm);  // Display the form for adding payments

// 1.5 Handle form submission to add payment
router.post('/addPayment', controller.addPayment);  // Process the form and add the payment



module.exports = router;

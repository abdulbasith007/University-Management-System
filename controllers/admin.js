const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const uuidv4 = require('uuid').v4;
const DOMAIN = process.env.DOMAIN_NAME;

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  dateStrings: 'date',
  database: 'cumsdbms1',
});

// Students limit per section
const SECTION_LIMIT = 20;

// Database query promises
const zeroParamPromise = (sql) => {
  return new Promise((resolve, reject) => {
    db.query(sql, (err, results) => {
      if (err) return reject(err);
      return resolve(results);
    });
  });
};

const queryParamPromise = (sql, queryParam) => {
  return new Promise((resolve, reject) => {
    db.query(sql, queryParam, (err, results) => {
      if (err) return reject(err);
      return resolve(results);
    });
  });
};

// 1. ADMIN

// 1.1 Dashboard
exports.getDashboard = async (req, res, next) => {
//   const sql = 'SELECT * FROM admin WHERE admin_id = ?';
//   const user = (await queryParamPromise(sql, [req.user]))[0];
  res.render('Admin/dashboard', { page_name: 'overview' });
};

// 1.2 Overview
exports.getOverview = async (req, res, next) => {
//   const sql = 'SELECT * FROM admin WHERE admin_id = ?';
//   const user = (await queryParamPromise(sql, [req.user]))[0];
  const students = await zeroParamPromise('SELECT * FROM students');
  const staffs = await zeroParamPromise('SELECT * FROM faculty');
  const departments = await zeroParamPromise('SELECT * FROM departments');
  const courses = await zeroParamPromise('SELECT * FROM courses');
//   const classes = await zeroParamPromise('SELECT * FROM class');
//TODO: Add other tables
  res.render('Admin/overview', {
    students,
    staffs,
    departments,
    courses,
    // classes,
    page_name: 'profile',
  });
};

// 2. STAFFS
// 2.1 Add staff
exports.getAddStaff = async (req, res, next) => {
    const sql = 'SELECT DepartmentID, DepartmentName from departments';
    const results = await zeroParamPromise(sql);
    // let departments = [];
    // for (let i = 0; i < results.length; ++i) {
    //   departments.push(results[i].DepartmentID);
    // }
    res.render('Admin/Staff/addStaff', {
      departments: results,
      page_name: 'staff',
    });
  };
  
exports.postAddStaff = async (req, res, next) => {
    const { email } = req.body;
    const sql1 = 'SELECT count(*) as `count` FROM person WHERE Email = ?';
    const count = (await queryParamPromise(sql1, [email]))[0].count;
    if (count !== 0) {
        req.flash('error', 'Faculty with that email already exists');
        res.redirect('/admin/addStaff');
    } else {
        const {
            dob,
            firstName,
            lastName,
            department,
            address,
            city,
            postalCode,
            contact,
            state,
        } = req.body;

        if (contact.length > 11) {
            req.flash('error', 'Enter a valid phone number');
            return res.redirect('/admin/addStaff');
        }

        const personData = {
            FirstName: firstName,
            LastName: lastName,
            Email: email,
            City: city,
            State: state,
            ZipCode: postalCode,
            DateOfBirth: dob,
        };

        try {
            // Insert data into the person table and retrieve the last inserted PersonID
            const sql2 = 'INSERT INTO person SET ?';
            const personResult = await queryParamPromise(sql2, personData);
            const personId = personResult.insertId; // Get the auto-incremented PersonID

            // Insert data into the faculty table with the obtained PersonID
            const facultyData = {
                DepartmentID: department,
                PersonID: personId,
            };
            const sql3 = 'INSERT INTO faculty SET ?';
            await queryParamPromise(sql3, facultyData);

            req.flash('success_msg', 'Faculty added successfully');
            res.redirect('/admin/getAllStaffs');
        } catch (error) {
            console.error("Error inserting faculty:", error);
            req.flash('error', 'Failed to add faculty');
            res.redirect('/admin/addStaff');
        }
    }
};
// 2.2 Get staffs on query
exports.getRelevantStaff = async (req, res, next) => {
  const sql = 'SELECT DepartmentID, DepartmentName from departments';
  const results = await zeroParamPromise(sql);
  // let departments = [];
  // for (let i = 0; i < results.length; ++i) {
  //   departments.push(results[i].DepartmentID);
  // }
  res.render('Admin/Staff/selectStaff', {
    departments: results,
    page_name: 'staff',
  });
};

exports.postRelevantStaff = async (req, res, next) => {
  const { department } = req.body;
  if (department === 'None') {
    req.flash('error', 'Please select department for the given section');
    res.redirect('/admin/getStaff');
  } else if (department !== 'None') {
    // All teachers from particular department
    const sql = "select FacultyID, DepartmentID, DepartmentName, CONCAT(FirstName, ' ', LastName) AS Name, Email, DateOfBirth from faculty NATURAL JOIN person NATURAL JOIN departments where DepartmentID = ?";
    const results = await queryParamPromise(sql, [department]);
    return res.render('Admin/Staff/getStaff', {
      data: results,
      page_name: 'staff',
    });
  } else {
    return res.redirect('/admin/getAllStaffs');
  }
};

// 2.3 Get all staffs
exports.getAllStaff = async (req, res, next) => {
  const sql = "select FacultyID, DepartmentID, DepartmentName, CONCAT(FirstName, ' ', LastName) AS Name, Email, DateOfBirth from faculty NATURAL JOIN person NATURAL JOIN departments";
  const results = await zeroParamPromise(sql);
  res.render('Admin/Staff/getStaff', { data: results, page_name: 'staff' });
};

// 2.4 Modify existing staffs
exports.getStaffSettings = async (req, res, next) => {
  const staffEmail = req.params.id;
  const sql1 = 'SELECT * FROM faculty WHERE email = ?';
  const staffData = await queryParamPromise(sql1, [staffEmail]);
  const address = staffData[0].st_address.split('-');
  staffData[0].address = address;
  const results = await zeroParamPromise('SELECT * from departments');
  let departments = [];
  for (let i = 0; i < results.length; ++i) {
    departments.push(results[i].dept_id);
  }
  res.render('Admin/Staff/setStaff', {
    staffData: staffData,
    departments: departments,
    page_name: 'Staff Settings',
  });
};
exports.postStaffSettings = async (req, res, next) => {
  const {
    old_email,
    email,
    dob,
    name,
    gender,
    department,
    address,
    city,
    postalCode,
    contact,
  } = req.body;

  const password = dob.toString().split('-').join('');
  const hashedPassword = await hashing(password);

  const sql =
    'update staff set st_name=?, gender=?, dob=?, email=?, st_address=?, contact=?, password=?, dept_id=? where email=?';
  await queryParamPromise(sql, [
    name,
    gender,
    dob,
    email,
    address + '-' + city + '-' + postalCode,
    contact,
    hashedPassword,
    department,
    old_email,
  ]);
  req.flash('success_msg', 'Staff added successfully');
  res.redirect('/admin/getStaff');
};

// 3. STUDENTS
// 3.1 Add student
exports.getAddStudent = async (req, res, next) => {
  const sql = 'SELECT DepartmentID from departments';
  const results = await zeroParamPromise(sql);
  let departments = [];
  for (let i = 0; i < results.length; ++i) {
    departments.push(results[i].DepartmentID);
  }
  res.render('Admin/Student/addStudent', {
    page_name: 'students',
    departments: departments,
  });
};
exports.postAddStudent = async (req, res, next) => {
  const {
    email,
    dob,
    name,
    gender,
    department,
    address,
    city,
    postalCode,
    contact,
  } = req.body;
  const password = dob.toString().split('-').join('');
  const hashedPassword = await hashing(password);
  const sql1 =
    'select count(*) as `count`, section from student where section = (select max(section) from student where dept_id = ?) AND dept_id = ?';
  const results = await queryParamPromise(sql1, [department, department]);
  let section = 1;
  if (results[0].count !== 0) {
    if (results[0].count == SECTION_LIMIT) {
      section = results[0].section + 1;
    } else {
      section = results[0].section;
    }
  }
  const sql2 = 'INSERT INTO STUDENT SET ?';
  await queryParamPromise(sql2, {
    s_id: uuidv4(),
    s_name: name,
    gender: gender,
    dob: dob,
    email: email,
    s_address: address + '-' + city + '-' + postalCode,
    contact: contact,
    password: hashedPassword,
    section: section,
    dept_id: department,
  });
  req.flash('success_msg', 'Student added successfully');
  res.redirect('/admin/getAllStudents');
};

// 3.2 Get students on query
exports.getRelevantStudent = async (req, res, next) => {
  const sql = 'SELECT DepartmentID from departments';
  const results = await zeroParamPromise(sql);
  let departments = [];
  for (let i = 0; i < results.length; ++i) {
    departments.push(results[i].DepartmentID);
  }
  res.render('Admin/Student/deptSelect', {
    departments: departments,
    page_name: 'students',
  });
};

exports.postRelevantStudent = async (req, res, next) => {
  let { section, department } = req.body;
  if (!section && department === 'None') {
    const results = await zeroParamPromise('SELECT * FROM student');
    res.render('Admin/Student/getStudent', {
      data: results,
      page_name: 'students',
    });
  } else if (!section) {
    const sql = 'SELECT * FROM student WHERE dept_id = ?';
    const results = await queryParamPromise(sql, [department]);
    res.render('Admin/Student/getStudent', {
      data: results,
      page_name: 'students',
    });
  } else if (department === 'None') {
    const sql = 'SELECT * FROM student WHERE section = ?';
    const results = await queryParamPromise(sql, [section]);
    res.render('Admin/Student/getStudent', {
      data: results,
      page_name: 'students',
    });
  } else if (section && department !== 'None') {
    const sql =
      'SELECT * FROM student WHERE section = ? AND dept_id = ? GROUP BY s_id';
    const results = await queryParamPromise(sql, [section, department]);
    res.render('Admin/Student/getStudent', {
      data: results,
      page_name: 'students',
    });
  }
};

// 3.3 Get all students
exports.getAllStudent = async (req, res, next) => {
  const sql = 'SELECT * from student';
  const results = await zeroParamPromise(sql);
  res.render('Admin/Student/getStudent', {
    data: results,
    page_name: 'students',
  });
};

// 3.4 Modify existing students
exports.getStudentSettings = async (req, res, next) => {
  const studentEmail = req.params.id;
  const sql1 = 'SELECT * FROM STUDENT WHERE email = ?';
  const studentData = await queryParamPromise(sql1, [studentEmail]);
  const address = studentData[0].s_address.split('-');
  studentData[0].address = address;
  const results = await zeroParamPromise('SELECT * from department');
  let departments = [];
  for (let i = 0; i < results.length; ++i) {
    departments.push(results[i].dept_id);
  }
  res.render('Admin/Student/setStudent', {
    studentData: studentData,
    departments: departments,
    page_name: 'students',
  });
};

exports.postStudentSettings = async (req, res, next) => {
  const {
    old_email,
    email,
    dob,
    name,
    gender,
    department,
    address,
    city,
    postalCode,
    contact,
  } = req.body;
  const password = dob.toString().split('-').join('');
  const hashedPassword = await hashing(password);
  const sql1 =
    'select count(*) as `count`, section from student where section = (select max(section) from student where dept_id = ?) AND dept_id = ?';
  const results = await queryParamPromise(sql1, [department, department]);
  let section = 1;
  if (results[0].count !== 0) {
    if (results[0].count == SECTION_LIMIT) {
      section = results[0].section + 1;
    } else {
      section = results[0].section;
    }
  }
  const sql2 =
    'UPDATE STUDENT SET s_name = ?, gender = ?, dob = ?,email = ?, s_address = ?, contact = ?, password = ?, section = ?, dept_id = ? WHERE email = ?';
  await queryParamPromise(sql2, [
    name,
    gender,
    dob,
    email,
    address + '-' + city + '-' + postalCode,
    contact,
    hashedPassword,
    section,
    department,
    old_email,
  ]);
  req.flash('success_msg', 'Student updated successfully');
  res.redirect('/admin/getAllStudents');
};

// 4. CLASSES

// 4.1 Select Class
exports.getClass = async (req, res, next) => {
  const sql = 'SELECT * FROM class';
  const results = await zeroParamPromise(sql);
  const staffData = [];
  for (const result of results) {
    const staffName = (
      await queryParamPromise(
        'SELECT st_name FROM STAFF WHERE st_id = ?',
        result.st_id
      )
    )[0].st_name;
    staffData.push(staffName);
  }
  res.render('Admin/Class/getClass', {
    data: results,
    staffData: staffData,
    page_name: 'classes',
  });
};

// 4.2 Add class
exports.getAddClass = async (req, res, next) => {
  const results = await zeroParamPromise('SELECT c_id from course');
  let courses = [];
  for (let i = 0; i < results.length; ++i) {
    courses.push(results[i].c_id);
  }
  const staffs = await zeroParamPromise(
    'SELECT st_id, email, dept_id from staff'
  );
  res.render('Admin/Class/addClass', {
    page_name: 'classes',
    courses: courses,
    staffs: staffs,
  });
};

exports.postAddClass = async (req, res, next) => {
  let { course, staff, section } = req.body;
  staff = staff.split(' ')[0];
  const sql1 = 'SELECT st_id, dept_id from staff where email = ?';
  const staffData = (await queryParamPromise(sql1, [staff]))[0];
  const sql2 = 'SELECT semester, dept_id from course where c_id = ?';
  const courseData = (await queryParamPromise(sql2, [course]))[0];
  if (staffData.dept_id !== courseData.dept_id) {
    req.flash('error', 'The staff and course are of different department');
    return res.redirect('/admin/addClass');
  }
  const sql3 =
    'select max(section) as `max_section` from student where dept_id = ?';
  const max_section = (await queryParamPromise(sql3, [staffData.dept_id]))[0]
    .max_section;
  if (section <= 0 || section > max_section) {
    req.flash('error', 'The section for the given department does not exist');
    return res.redirect('/admin/addClass');
  }
  const sql4 = 'INSERT INTO class set ?';
  await queryParamPromise(sql4, {
    section: section,
    semester: courseData.semester,
    c_id: course,
    st_id: staffData.st_id,
  });
  res.redirect('/admin/getClass');
};

// 4.3 Modify existing classes
exports.getClassSettings = async (req, res, next) => {
  const classId = req.params.id;
  const sql1 = 'SELECT * from class WHERE class_id = ?';
  const classData = await queryParamPromise(sql1, [classId]);
  const sql2 = 'SELECT c_id from course';
  const courseData = await zeroParamPromise(sql2);
  const sql3 = 'SELECT st_id, st_name, email from staff';
  const staffData = await zeroParamPromise(sql3);
  const sql4 = 'SELECT st_id, email FROM staff WHERE st_id = ?';
  const staffEmail = await queryParamPromise(sql4, [classData[0].st_id]);
  res.render('Admin/Class/setClass', {
    classData,
    courseData,
    staffData,
    staffEmail: staffEmail[0],
    page_name: 'classes',
  });
};

exports.postClassSettings = async (req, res, next) => {
  const { staff, course, section, classId } = req.body;
  const sql =
    'UPDATE class SET st_id = ?, c_id = ?, section = ? WHERE class_id = ?';
  await queryParamPromise(sql, [staff, course, section, classId]);
  req.flash('success_msg', 'Class changed successfully!');
  res.redirect('/admin/getClass');
};

// 5. DEPARTMENTS
// 5.1 Select department
exports.getDept = async (req, res, next) => {
  const results = await zeroParamPromise('SELECT * FROM departments');
  res.render('Admin/Department/getDept', {
    data: results,
    page_name: 'depts',
  });
};

// Display form to add department
exports.getAddDept = (req, res, next) => {
  res.render('Admin/Department/addDept', { page_name: 'depts' });
};

// Add a new department
exports.postAddDept = async (req, res, next) => {
  const deptName = req.body.department;
  const buildingName = req.body.building;

  const sql1 = 'SELECT * FROM departments WHERE DepartmentName = ?';
  const results = await queryParamPromise(sql1, [deptName]);
  
  if (results.length !== 0) {
    req.flash('error', 'Department with that name already exists');
    return res.redirect('/admin/addDept');
  } else {
    const sql2 = 'INSERT INTO departments SET ?';
    await queryParamPromise(sql2, {
      DepartmentName: deptName,
      Building_Name: buildingName,
    });
    req.flash('success_msg', 'Department added successfully');
    res.redirect('/admin/getDept');
  }
};

// 5.3 Modify existing department
exports.getDeptSettings = async (req, res, next) => {
  const deptId = req.params.id;
  const sql1 = 'SELECT * FROM departments WHERE dept_id = ?';
  const results = await queryParamPromise(sql1, [deptId]);
  res.render('Admin/Department/setDept', {
    name: results[0].d_name,
    id: results[0].dept_id,
    page_name: 'depts',
  });
};

exports.postDeptSettings = async (req, res, next) => {
  const { department, deptId } = req.body;
  const sql = 'UPDATE department SET d_name = ? WHERE dept_id = ?';
  await queryParamPromise(sql, [department, deptId]);
  req.flash('success_msg', 'Department changed successfully!');
  res.redirect('/admin/getDept');
};

// 6. COURSE
// 6.1 Get all courses
exports.getAllCourse = async (req, res, next) => {
  const sql = `
    SELECT CourseID, CourseName, Credits, DepartmentName 
    FROM courses NATURAL JOIN departments ORDER BY CourseID`;
  const results = await zeroParamPromise(sql);
  res.render('Admin/Course/getCourse', {
    data: results,
    page_name: 'courses',
  });
};

// 6.2 Get courses on query
exports.getRelevantCourse = async (req, res, next) => {
  const results = await zeroParamPromise('SELECT DepartmentID, DepartmentName FROM departments');
  res.render('Admin/Course/deptSelect', {
    departments: results,
    page_name: 'courses',
  });
};

exports.postRelevantCourse = async (req, res, next) => {
  const { semester, department } = req.body;

  let sql = `
    SELECT CourseID, CourseName, Credits, DepartmentName 
    FROM courses NATURAL JOIN departments`;
  const params = [];

  if (department !== 'None') {
    sql += ` WHERE DepartmentID = ?`;
    params.push(department);
  }
  // if (semester) {
  //   sql += params.length ? ' AND' : ' WHERE';
  //   sql += ` c.Semester = ?`;
  //   params.push(semester);
  // }

  const results = await queryParamPromise(sql, params);
  res.render('Admin/Course/getCourse', {
    data: results,
    page_name: 'courses',
  });
};


// 6.3 Add course
exports.getAddCourse = async (req, res, next) => {
  const departments = await zeroParamPromise('SELECT DepartmentID, DepartmentName FROM departments');
  res.render('Admin/Course/addCourse', {
    departments,
    page_name: 'courses',
  });
};

exports.postAddCourse = async (req, res, next) => {
  const { course, credits, department } = req.body;

  const courseData = {
    CourseName: course,
    Credits: credits,
    DepartmentID: department,
  };
  const sql = 'INSERT INTO courses SET ?';
  await queryParamPromise(sql, courseData);

  req.flash('success_msg', 'Course added successfully');
  res.redirect('/admin/getAllCourses');
};




// 6.4 Modify existing courses
exports.getCourseSettings = async (req, res, next) => {
  const cId = req.params.id;
  const sql1 = 'SELECT * FROM courses WHERE c_id = ?';
  const courseData = await queryParamPromise(sql1, [cId]);
  const deptData = await zeroParamPromise('SELECT * from department');
  res.render('Admin/Course/setCourse', {
    courseData,
    page_name: 'courses',
    departments: deptData,
  });
};

exports.postCourseSettings = async (req, res, next) => {
  let { course, semester, department, credits, c_type, courseId } = req.body;
  const sql =
    'UPDATE courses SET name = ?, semester = ?, credits = ?, c_type = ?, dept_id = ? WHERE c_id = ?';
  await queryParamPromise(sql, [
    course,
    semester,
    credits,
    c_type,
    department,
    courseId,
  ]);
  req.flash('success_msg', 'Course changed successfully!');
  res.redirect('/admin/getAllCourses');
};

// 1. CLUBS
// 1.1 Add club
exports.getAddClub = async (req, res, next) => {
  const sql = 'SELECT FacultyID, CONCAT(FirstName, " ", LastName) AS Name FROM faculty NATURAL JOIN person';
  const results = await zeroParamPromise(sql);
  
  // Send both FacultyID and Name to the view
  res.render('Admin/Club/addClub', {
      facultyAdvisors: results,  // Send the whole array of faculty data
      page_name: 'clubs',
  });
};

exports.postAddClub = async (req, res, next) => {
  const { clubName, description, facultyAdvisorID } = req.body;

  const sql1 = 'SELECT count(*) as `count` FROM clubs WHERE ClubName = ?';
  const count = (await queryParamPromise(sql1, [clubName]))[0].count;
  if (count !== 0) {
      req.flash('error', 'A club with that name already exists');
      res.redirect('/admin/addClub');
  } else {
      const clubData = {
          ClubName: clubName,
          Description: description,
          FacultyAdvisorID: facultyAdvisorID,
      };

      try {
          const sql2 = 'INSERT INTO clubs SET ?';
          await queryParamPromise(sql2, clubData);

          req.flash('success_msg', 'Club added successfully');
          res.redirect('/admin/getClubs');
      } catch (error) {
          console.error("Error adding club:", error);
          req.flash('error', 'Failed to add club');
          res.redirect('/admin/addClub');
      }
  }
};

// 1.2 Get all clubs
exports.getAllClubs = async (req, res, next) => {
  const sql = `SELECT ClubID, ClubName, Description, CONCAT(FirstName, " ", LastName) AS Name FROM clubs NATURAL JOIN Faculty NATURAL JOIN Person`;
  const results = await zeroParamPromise(sql);
  res.render('Admin/Club/getClubs', { data: results, page_name: 'clubs' });
};

// 1.3 Modify existing club
exports.getClubSettings = async (req, res, next) => {
  const clubID = req.params.id;
  const sql1 = 'SELECT * FROM clubs WHERE ClubID = ?';
  const clubData = await queryParamPromise(sql1, [clubID]);

  const results = await zeroParamPromise('SELECT FacultyAdvisorID FROM faculty');
  let facultyAdvisors = [];
  for (let i = 0; i < results.length; ++i) {
      facultyAdvisors.push(results[i].FacultyAdvisorID);
  }

  res.render('Admin/Club/setClub', {
      clubData: clubData[0],
      facultyAdvisors: facultyAdvisors,
      page_name: 'Club Settings',
  });
};

exports.postClubSettings = async (req, res, next) => {
  const { clubID, clubName, description, facultyAdvisorID } = req.body;

  const sql = 'UPDATE clubs SET ClubName = ?, Description = ?, FacultyAdvisorID = ? WHERE ClubID = ?';
  await queryParamPromise(sql, [clubName, description, facultyAdvisorID, clubID]);

  req.flash('success_msg', 'Club updated successfully');
  res.redirect('/admin/getClubs');
};

// 1.2 Get relevant clubs based on query
exports.getRelevantClub = async (req, res, next) => {
  let sql = "SELECT ClubID, ClubName, Description, CONCAT(FirstName, ' ', LastName) AS Name FROM clubs JOIN faculty ON clubs.FacultyAdvisorID=faculty.FacultyID JOIN person ON person.PersonID=faculty.FacultyID;";
  let params = [];

  // If a facultyAdvisorID is provided, filter by it
  // if (facultyAdvisorID) {
  //   sql += ' WHERE FacultyAdvisorID = ?';
  //   params.push(facultyAdvisorID);
  // }

  const results = await queryParamPromise(sql, params);
  res.render('Admin/Club/getClubs', { data: results, page_name: 'clubs' });
};

// 1.3 Post relevant clubs based on query
exports.postRelevantClub = async (req, res, next) => {
  const { facultyAdvisorID } = req.body;

  if (facultyAdvisorID === 'None') {
    req.flash('error', 'Please select a faculty advisor');
    res.redirect('/admin/getClubs');
  } else {
    const sql = 'SELECT ClubID, ClubName, Description, FacultyAdvisorID FROM clubs WHERE FacultyAdvisorID = ?';
    const results = await queryParamPromise(sql, [facultyAdvisorID]);
    
    res.render('Admin/Club/getClubs', {
      data: results,
      page_name: 'clubs',
    });
  }
};

// 8.1 Add Scholarship
exports.getAddScholarship = async (req, res, next) => {
  const sql = 'SELECT FacultyID, CONCAT(FirstName, " ", LastName) AS Name FROM faculty NATURAL JOIN person';
  const results = await zeroParamPromise(sql);

  res.render('Admin/Scholarship/addScholarship', {
    facultyAdvisors: results,  // Send faculty data to the view
    page_name: 'scholarships',
  });
};

exports.postAddScholarship = async (req, res, next) => {
  const { scholarshipAmount, eligibilityCriteria, facultyAdvisorID } = req.body;

  const sql1 = 'SELECT count(*) as `count` FROM scholarships WHERE Amount = ? AND EligibilityCriteria = ?';
  const count = (await queryParamPromise(sql1, [scholarshipAmount, eligibilityCriteria]))[0].count;

  if (count !== 0) {
    req.flash('error', 'A scholarship with the same amount and criteria already exists');
    res.redirect('/admin/addScholarship');
  } else {
    const scholarshipData = {
      Amount: scholarshipAmount,
      EligibilityCriteria: eligibilityCriteria,
    };

    try {
      const sql2 = 'INSERT INTO scholarships SET ?';
      await queryParamPromise(sql2, scholarshipData);

      req.flash('success_msg', 'Scholarship added successfully');
      res.redirect('/admin/getScholarships');
    } catch (error) {
      console.error("Error adding scholarship:", error);
      req.flash('error', 'Failed to add scholarship');
      res.redirect('/admin/addScholarship');
    }
  }
};

// 8.2 Get All Scholarships
exports.getAllScholarships = async (req, res, next) => {
  const sql = `SELECT ScholarshipID, Amount, EligibilityCriteria FROM scholarships`;
  const results = await zeroParamPromise(sql);
  res.render('Admin/Scholarship/getScholarships', { data: results, page_name: 'scholarships' });
};

// 8.3 Modify Scholarship
exports.getScholarshipSettings = async (req, res, next) => {
  const scholarshipID = req.params.id;
  const sql1 = 'SELECT * FROM scholarships WHERE ScholarshipID = ?';
  const scholarshipData = await queryParamPromise(sql1, [scholarshipID]);

  // const results = await zeroParamPromise('SELECT FacultyAdvisorID FROM faculty');
  // let facultyAdvisors = [];
  // for (let i = 0; i < results.length; ++i) {
  //     facultyAdvisors.push(results[i].FacultyAdvisorID);
  // }

  res.render('Admin/Scholarship/setScholarship', {
    scholarshipData: scholarshipData[0],
    // facultyAdvisors: facultyAdvisors,
    page_name: 'Scholarship Settings',
  });
};

exports.postScholarshipSettings = async (req, res, next) => {
  const { scholarshipID, scholarshipAmount, eligibilityCriteria, facultyAdvisorID } = req.body;

  const sql = 'UPDATE scholarships SET Amount = ?, EligibilityCriteria = ?, FacultyAdvisorID = ? WHERE ScholarshipID = ?';
  await queryParamPromise(sql, [scholarshipAmount, eligibilityCriteria, facultyAdvisorID, scholarshipID]);

  req.flash('success_msg', 'Scholarship updated successfully');
  res.redirect('/admin/getScholarships');
};

// 1.2 Get relevant scholarships based on query
exports.getRelevantScholarship = async (req, res, next) => {
  const { facultyAdvisorID } = req.query;

  let sql = 'SELECT ScholarshipID, Amount, EligibilityCriteria FROM scholarships';
  let params = [];

  const results = await queryParamPromise(sql, params);
  res.render('Admin/Scholarship/getScholarships', { data: results, page_name: 'scholarships' });
};

// 1.3 Post relevant scholarships based on query
exports.postRelevantScholarship = async (req, res, next) => {
  const { facultyAdvisorID } = req.body;

  // if (facultyAdvisorID === 'None') {
  //   req.flash('error', 'Please select a faculty advisor');
  //   res.redirect('/admin/getScholarships');
  // } else {
    // const sql = 'SELECT ScholarshipID, ScholarshipName, Description, Amount FROM scholarships WHERE FacultyAdvisorID = ?';
    // const results = await queryParamPromise(sql, [facultyAdvisorID]);

    // res.render('Admin/Scholarship/getScholarships', {
    //   data: results,
    //   page_name: 'scholarships',
    // });
  // }
};


// 9.1 Add Internship
exports.getAddInternship = async (req, res, next) => {
  const sql = 'SELECT StudentID, CONCAT(FirstName, " ", LastName) AS Name FROM students NATURAL JOIN person';
  const results = await zeroParamPromise(sql);

  res.render('Admin/Internship/addInternship', {
    students: results,  // Send student data to the view
    page_name: 'internships',
  });
};

exports.postAddInternship = async (req, res, next) => {
  const { companyName, duration, stipend, StudentID } = req.body;

  const internshipData = {
    CompanyName: companyName,
    // Duration: duration,
    // Stipend: stipend
  };

  
  try {
    const sql = 'INSERT INTO internships SET ?';
    const result = await queryParamPromise(sql, internshipData);
    const internshipID = result.insertId;
    
    const StudentInternshipData = {
      Duration: duration,
      Stipend: stipend,
      StudentID,
      InternshipID: internshipID
      // Duration: duration,
      // Stipend: stipend
    };

    const sql1 = 'INSERT INTO student_internship_mapping SET ?';
    await queryParamPromise(sql1, StudentInternshipData);

    req.flash('success_msg', 'Internship added successfully');
    res.redirect('/admin/getInternships');
  } catch (error) {
    console.error("Error adding internship:", error);
    req.flash('error', 'Failed to add internship');
    res.redirect('/admin/addInternship');
  }
};

// 9.2 Get All Internships
exports.getAllInternships = async (req, res, next) => {
  const sql = `SELECT InternshipID, CompanyName FROM internships`;
  const results = await zeroParamPromise(sql);
  res.render('Admin/Internship/getInternships', { data: results, page_name: 'internships' });
};

// 9.3 Modify Internship
exports.getInternshipSettings = async (req, res, next) => {
  const internshipID = req.params.id;
  const sql1 = 'SELECT * FROM internships WHERE InternshipID = ?';
  const internshipData = await queryParamPromise(sql1, [internshipID]);

  const results = await zeroParamPromise('SELECT FacultyAdvisorID FROM faculty');
  let facultyAdvisors = [];
  for (let i = 0; i < results.length; ++i) {
    facultyAdvisors.push(results[i].FacultyAdvisorID);
  }

  res.render('Admin/Internship/setInternship', {
    internshipData: internshipData[0],
    facultyAdvisors: facultyAdvisors,
    page_name: 'Internship Settings',
  });
};

exports.postInternshipSettings = async (req, res, next) => {
  const { internshipID, companyName, duration, stipend, facultyAdvisorID } = req.body;

  const sql = 'UPDATE internships SET CompanyName = ?, Duration = ?, Stipend = ?, FacultyAdvisorID = ? WHERE InternshipID = ?';
  await queryParamPromise(sql, [companyName, duration, stipend, facultyAdvisorID, internshipID]);

  req.flash('success_msg', 'Internship updated successfully');
  res.redirect('/admin/getInternships');
};

// 1.2 Get relevant internships based on query
exports.getRelevantInternship = async (req, res, next) => {
  const { facultyAdvisorID } = req.query;

  let sql = `SELECT internships.InternshipID, concat (FirstName,' ',LastName) as StudentName, internships.CompanyName, Duration, Stipend
FROM internships inner join student_internship_mapping on internships.InternshipID = student_internship_mapping.InternshipID
inner join students on students.StudentID = student_internship_mapping.StudentID
inner join Person on Person.PersonID = students.PersonID`;
  let params = [];

  // // If a facultyAdvisorID is provided, filter by it
  // if (facultyAdvisorID) {
  //   sql += ' WHERE FacultyAdvisorID = ?';
  //   params.push(facultyAdvisorID);
  // }

  const results = await queryParamPromise(sql, params);
  res.render('Admin/Internship/getInternships', { data: results, page_name: 'internships' });
};

// 1.3 Post relevant internships based on query
exports.postRelevantInternship = async (req, res, next) => {
  // const { facultyAdvisorID } = req.body;

  // if (facultyAdvisorID === 'None') {
  //   req.flash('error', 'Please select a faculty advisor');
  //   res.redirect('/admin/getInternships');
  // } else {
    const sql = 'SELECT InternshipID, CompanyName FROM internships';
    const results = await queryParamPromise(sql);

    res.render('Admin/Internship/getInternships', {
      data: results,
      page_name: 'internships',
    });
  // }
};

// Fetch department names for alumni addition form
exports.getAddAlumni = async (req, res, next) => {
  const sql = 'SELECT DepartmentID, DepartmentName FROM departments';
  const departments = await zeroParamPromise(sql);
  res.render('Admin/Alumni/addAlumni', {
      departments: departments,
      page_name: 'alumni',
  });
};

// Insert new alumni data
exports.postAddAlumni = async (req, res, next) => {
  const { graduationDate, currentJobTitle, currentEmployer, name, email, department } = req.body;

  const alumniData = {
      GraduationDate: graduationDate,
      CurrentJobTitle: currentJobTitle,
      CurrentEmployer: currentEmployer,
      Name: name,
      Email: email,
      DepartmentID: department,
  };

  try {
      const sql = 'INSERT INTO alumni SET ?';
      await queryParamPromise(sql, alumniData);
      req.flash('success_msg', 'Alumni added successfully');
      res.redirect('/admin/getAllAlumni');
  } catch (error) {
      console.error("Error adding alumni:", error);
      req.flash('error', 'Failed to add alumni');
      res.redirect('/admin/addAlumni');
  }
};

// Retrieve department names for alumni filtering form
exports.getRelevantAlumni = async (req, res, next) => {
  const sql = 'SELECT DepartmentID, DepartmentName FROM departments';
  const departments = await zeroParamPromise(sql);
  res.render('Admin/Alumni/selectAlumni', {
      departments: departments,
      page_name: 'alumni',
  });
};

// Retrieve alumni list for selected department
exports.postRelevantAlumni = async (req, res, next) => {
  const { department } = req.body;

  if (!department || department === 'None') {
      req.flash('error', 'Please select a department.');
      res.redirect('/admin/getAlumni');
  } else {
      const sql = `
          SELECT AlumniID, GraduationDate, CurrentJobTitle, CurrentEmployer, Name, Email, DepartmentName
          FROM alumni
          INNER JOIN departments ON alumni.DepartmentID = departments.DepartmentID
          WHERE alumni.DepartmentID = ?`;
      const alumniList = await queryParamPromise(sql, [department]);

      res.render('Admin/Alumni/getAlumni', {
          data: alumniList,
          page_name: 'alumni',
      });
  }
};

// Retrieve all alumni
exports.getAllAlumni = async (req, res, next) => {
  const sql = `
      SELECT AlumniID, GraduationDate, CurrentJobTitle, CurrentEmployer, Name, Email, DepartmentName
      FROM alumni
      INNER JOIN departments ON alumni.DepartmentID = departments.DepartmentID`;
  const alumniList = await zeroParamPromise(sql);

  res.render('Admin/Alumni/getAlumni', {
      data: alumniList,
      page_name: 'alumni',
  });
};

exports.getAlumniSettings = async (req, res, next) => {
  const alumniID = req.params.id;

  // Fetch alumni data by ID
  const sql1 = `
    SELECT AlumniID, GraduationDate, CurrentJobTitle, CurrentEmployer, Name, Email, DepartmentID 
    FROM Alumni 
    WHERE AlumniID = ?`;
  const alumniData = await queryParamPromise(sql1, [alumniID]);

  // Fetch list of departments for selection
  const departmentResults = await zeroParamPromise('SELECT DepartmentID, DepartmentName FROM Departments');
  const departments = departmentResults.map(dept => ({
    DepartmentID: dept.DepartmentID,
    DepartmentName: dept.DepartmentName
  }));

  // Render alumni settings view with retrieved data
  res.render('Admin/Alumni/setAlumni', {
    alumniData: alumniData[0],
    departments: departments,
    page_name: 'Alumni Settings'
  });
};

// Controller function to post/update alumni settings
exports.postAlumniSettings = async (req, res, next) => {
  const { alumniID, graduationDate, currentJobTitle, currentEmployer, name, email, departmentID } = req.body;

  // SQL query to update alumni information
  const sql = `
    UPDATE Alumni 
    SET GraduationDate = ?, CurrentJobTitle = ?, CurrentEmployer = ?, Name = ?, Email = ?, DepartmentID = ? 
    WHERE AlumniID = ?`;
  await queryParamPromise(sql, [graduationDate, currentJobTitle, currentEmployer, name, email, departmentID, alumniID]);

  // Show success message and redirect back to alumni list or relevant page
  req.flash('success_msg', 'Alumni settings updated successfully');
  res.redirect('/admin/getAlumni');
};

// 1. EXAMS

// 1.1 Add Exam
exports.getAddExam = async (req, res, next) => {
  const sql = 'SELECT CourseID, CourseName FROM courses';
  const results = await zeroParamPromise(sql);
  let courses = [];
  for (let i = 0; i < results.length; ++i) {
    courses.push({ CourseID: results[i].CourseID, CourseName: results[i].CourseName });
  }
  res.render('Admin/Exam/addExam', {
    courses: courses,
    page_name: 'exam',
  });
};

// 1.2 Post Add Exam
exports.postAddExam = async (req, res, next) => {
  const { courseID, examDate, totalMarks } = req.body;
  const sql1 = 'SELECT count(*) as `count` FROM exams WHERE CourseID = ? AND ExamDate = ?';
  const count = (await queryParamPromise(sql1, [courseID, examDate]))[0].count;
  if (count !== 0) {
      req.flash('error', 'Exam for the selected course and date already exists');
      res.redirect('/admin/addExam');
  } else {
      const examData = {
          CourseID: courseID,
          ExamDate: examDate,
          TotalMarks: totalMarks,
      };

      try {
          const sql2 = 'INSERT INTO exams SET ?';
          await queryParamPromise(sql2, examData);
          req.flash('success_msg', 'Exam added successfully');
          res.redirect('/admin/getAllExams');
      } catch (error) {
          console.error("Error inserting exam:", error);
          req.flash('error', 'Failed to add exam');
          res.redirect('/admin/addExam');
      }
  }
};

// 1.2 Get all Exams
exports.getExams = async (req, res, next) => {
  const sql = `
      SELECT ExamID, ExamDate, TotalMarks, CourseName
      FROM exams
      JOIN courses ON exams.CourseID = courses.CourseID`;
  const results = await zeroParamPromise(sql);
  res.render('Admin/Exam/getExams', { data: results, page_name: 'exam' });
};

// 2.1 Get Exams by Course
exports.getRelevantExams = async (req, res, next) => {
  const sql = 'SELECT CourseID, CourseName FROM courses';
  const results = await zeroParamPromise(sql);
  let courses = [];
  for (let i = 0; i < results.length; ++i) {
    courses.push({ CourseID: results[i].CourseID, CourseName: results[i].CourseName });
  }
  res.render('Admin/Exam/selectExam', {
    courses: courses,
    page_name: 'exam',
  });
};

// 2.2 Post Exams by Course
exports.postRelevantExams = async (req, res, next) => {
  const { course: courseID } = req.body;
  if (courseID === 'None') {
    req.flash('error', 'Please select a course');
    res.redirect('/admin/getExams');
  } else {
    const sql = "SELECT ExamID, exams.CourseID as CourseID, CourseName, ExamDate, TotalMarks FROM exams JOIN courses ON exams.CourseID = courses.CourseID WHERE exams.CourseID = ?";
    const results = await queryParamPromise(sql, [courseID]);
    res.render('Admin/Exam/getExams', {
      data: results,
      page_name: 'exam',
    });
  }
};

exports.getExamSettings = async (req, res, next) => { };
exports.postExamSettings = async (req, res, next) => { };



// 2. PARENT CONTACT

// 3. Parent Contacts
// 3.1 Add Parent Contact
exports.getAddParentContact = async (req, res, next) => {
  const sql = 'SELECT StudentID, FirstName, LastName FROM students JOIN person ON students.PersonID = person.PersonID';
  const students = await zeroParamPromise(sql);
  res.render('Admin/ParentContact/addParentContact', {
      students: students,
      page_name: 'parentcontact',
  });
};

exports.postAddParentContact = async (req, res, next) => {
  const { parentName, phoneNumber, relationship, studentID } = req.body;

  // Basic validation
  if (phoneNumber.length > 11 || phoneNumber.length < 10) {
      req.flash('error', 'Enter a valid phone number');
      return res.redirect('/admin/addParentContact');
  }

  const parentContactData = {
      ParentName: parentName,
      PhoneNumber: phoneNumber,
      Relationship: relationship,
      StudentID: studentID,
  };

  try {
      // Insert data into parent_contact table
      const sql = 'INSERT INTO parent_contact SET ?';
      await queryParamPromise(sql, parentContactData);
      req.flash('success_msg', 'Parent contact added successfully');
      res.redirect('/admin/getAllParents');
  } catch (error) {
      console.error("Error inserting parent contact:", error);
      req.flash('error', 'Failed to add parent contact');
      res.redirect('/admin/addParentContact');
  }
};


exports.getAllParents = async (req, res, next) => {
  const sql = `
      SELECT pc.ParentName, pc.PhoneNumber, pc.Relationship, CONCAT(p.FirstName, ' ', p.LastName) AS StudentName, pc.StudentID
      FROM parent_contact pc
      JOIN students s ON pc.StudentID = s.StudentID
      JOIN person p ON s.PersonID = p.PersonID
  `;
  const results = await zeroParamPromise(sql);
  res.render('Admin/ParentContact/getParentContact', {
      data: results,
      page_name: 'parentcontact',
  });
};


exports.getRelevantParent = async (req, res, next) => {
  const sql = 'SELECT StudentID, FirstName, LastName FROM students JOIN person ON students.PersonID = person.PersonID';
  const students = await zeroParamPromise(sql);
  res.render('Admin/ParentContact/selectParent', {
      students: students,
      page_name: 'parentcontact',
  });
};

exports.postRelevantParent = async (req, res, next) => {
  const { studentID } = req.body;
  if (studentID === 'None') {
      req.flash('error', 'Please select a student');
      return res.redirect('/admin/getRelevantParent');
  } else {
      const sql = `
          SELECT pc.ParentName, pc.PhoneNumber, pc.Relationship, CONCAT(p.FirstName, ' ', p.LastName) AS StudentName
          FROM parent_contact pc
          JOIN students s ON pc.StudentID = s.StudentID
          JOIN person p ON s.PersonID = p.PersonID
          WHERE pc.StudentID = ?
      `;
      const results = await queryParamPromise(sql, [studentID]);
      res.render('Admin/ParentContact/getParentContact', {
          data: results,
          page_name: 'parentcontact',
      });
  }
};


exports.getParentSettings = async (req, res, next) => {
  const studentID = req.params.id;
  const sql = `
      SELECT pc.ParentName, pc.PhoneNumber, pc.Relationship, pc.StudentID, p.FirstName, p.LastName
      FROM parent_contact pc
      JOIN students s ON pc.StudentID = s.StudentID
      JOIN person p ON s.PersonID = p.PersonID
      WHERE pc.StudentID = ?
  `;
  const results = await queryParamPromise(sql, [studentID]);
  const parentData = results[0]; // Assuming only one parent contact per student
  res.render('Admin/ParentContact/setParentContact', {
      parentData: parentData,
      page_name: 'parentcontact',
  });
};


exports.postParentSettings = async (req, res, next) => {
  const { parentName, phoneNumber, relationship, studentID } = req.body;

  // Basic validation
  if (phoneNumber.length > 11 || phoneNumber.length < 10) {
      req.flash('error', 'Enter a valid phone number');
      return res.redirect(`/admin/settings/parent/${studentID}`);
  }

  const parentContactData = {
      ParentName: parentName,
      PhoneNumber: phoneNumber,
      Relationship: relationship,
  };

  try {
      // Update parent contact information for the selected student
      const sql = 'UPDATE parent_contact SET ? WHERE StudentID = ?';
      await queryParamPromise(sql, [parentContactData, studentID]);

      req.flash('success_msg', 'Parent contact updated successfully');
      res.redirect('/admin/getAllParents');
  } catch (error) {
      console.error("Error updating parent contact:", error);
      req.flash('error', 'Failed to update parent contact');
      res.redirect(`/admin/settings/parent/${studentID}`);
  }
};

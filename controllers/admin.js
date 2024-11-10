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
    const sql = 'SELECT DepartmentID from departments';
    const results = await zeroParamPromise(sql);
    let departments = [];
    for (let i = 0; i < results.length; ++i) {
      departments.push(results[i].DepartmentID);
    }
    res.render('Admin/Staff/addStaff', {
      departments: departments,
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
  const sql = 'SELECT DepartmentID from departments';
  const results = await zeroParamPromise(sql);
  let departments = [];
  for (let i = 0; i < results.length; ++i) {
    departments.push(results[i].DepartmentID);
  }
  res.render('Admin/Staff/selectStaff', {
    departments: departments,
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
    const sql = "select FacultyID, DepartmentID, CONCAT(FirstName, ' ', LastName) AS Name, Email, DateOfBirth from faculty NATURAL JOIN person where DepartmentID = ?";
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
  const sql = "select FacultyID, DepartmentID, CONCAT(FirstName, ' ', LastName) AS Name, Email, DateOfBirth from faculty NATURAL JOIN person";
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
    FROM courses NATURAL JOIN departments`;
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

const mysql = require('mysql');
const env = require('dotenv');

env.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: 'cumsdbms1',
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Mysql Connected');
});

// Utility function for executing queries with parameters
const queryParamPromise = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      return resolve(results);
    });
  });
};

// Function to insert mock data
const insertMockData = async () => {
  try {
    // Departments
    const departments = [
      { DepartmentName: 'Computer Science', Building_Name: 'Science Hall' },
      { DepartmentName: 'Electrical Engineering', Building_Name: 'Engineering Hub' },
      { DepartmentName: 'Mathematics', Building_Name: 'Math Building' },
      { DepartmentName: 'Physics', Building_Name: 'Physics Center' },
      { DepartmentName: 'Chemistry', Building_Name: 'Chemistry Lab' },
    ];
    for (const dept of departments) {
      await queryParamPromise(
        'INSERT INTO Departments (DepartmentName, Building_Name) VALUES (?, ?)',
        [dept.DepartmentName, dept.Building_Name]
      );
    }

    // Person
    const people = [
      { FirstName: 'Alice', LastName: 'Smith', Email: 'alice@example.com', City: 'New York', State: 'NY', ZipCode: '10001', DateOfBirth: '1990-01-01' },
      { FirstName: 'Bob', LastName: 'Johnson', Email: 'bob@example.com', City: 'Chicago', State: 'IL', ZipCode: '60601', DateOfBirth: '1985-05-15' },
      { FirstName: 'Carol', LastName: 'Williams', Email: 'carol@example.com', City: 'Los Angeles', State: 'CA', ZipCode: '90001', DateOfBirth: '1992-07-20' },
      { FirstName: 'David', LastName: 'Jones', Email: 'david@example.com', City: 'Houston', State: 'TX', ZipCode: '77001', DateOfBirth: '1988-09-10' },
      { FirstName: 'Eve', LastName: 'Brown', Email: 'eve@example.com', City: 'Phoenix', State: 'AZ', ZipCode: '85001', DateOfBirth: '1995-11-30' },
    ];
    for (const person of people) {
      await queryParamPromise(
        'INSERT INTO Person (FirstName, LastName, Email, City, State, ZipCode, DateOfBirth) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [person.FirstName, person.LastName, person.Email, person.City, person.State, person.ZipCode, person.DateOfBirth]
      );
    }

    // Students
    const students = [
      { EnrollmentDate: '2022-09-01', PersonID: 1 },
      { EnrollmentDate: '2023-01-15', PersonID: 2 },
      { EnrollmentDate: '2021-06-20', PersonID: 3 },
      { EnrollmentDate: '2023-09-10', PersonID: 4 },
      { EnrollmentDate: '2020-03-05', PersonID: 5 },
    ];
    for (const student of students) {
      await queryParamPromise(
        'INSERT INTO Students (EnrollmentDate, PersonID) VALUES (?, ?)',
        [student.EnrollmentDate, student.PersonID]
      );
    }

    // Faculty
    const faculties = [
      { DepartmentID: 1, PersonID: 1 },
      { DepartmentID: 2, PersonID: 2 },
      { DepartmentID: 3, PersonID: 3 },
      { DepartmentID: 4, PersonID: 4 },
      { DepartmentID: 5, PersonID: 5 },
    ];
    for (const faculty of faculties) {
      await queryParamPromise(
        'INSERT INTO Faculty (DepartmentID, PersonID) VALUES (?, ?)',
        [faculty.DepartmentID, faculty.PersonID]
      );
    }

    // Courses
    const courses = [
      { CourseName: 'Introduction to CS', Credits: 3, DepartmentID: 1 },
      { CourseName: 'Digital Circuits', Credits: 4, DepartmentID: 2 },
      { CourseName: 'Linear Algebra', Credits: 3, DepartmentID: 3 },
      { CourseName: 'Quantum Mechanics', Credits: 4, DepartmentID: 4 },
      { CourseName: 'Organic Chemistry', Credits: 4, DepartmentID: 5 },
    ];
    for (const course of courses) {
      await queryParamPromise(
        'INSERT INTO Courses (CourseName, Credits, DepartmentID) VALUES (?, ?, ?)',
        [course.CourseName, course.Credits, course.DepartmentID]
      );
    }

    // Exams
    const exams = [
      { CourseID: 1, ExamDate: '2023-05-10', TotalMarks: 100 },
      { CourseID: 2, ExamDate: '2023-06-15', TotalMarks: 80 },
      { CourseID: 3, ExamDate: '2023-07-20', TotalMarks: 90 },
      { CourseID: 4, ExamDate: '2023-08-25', TotalMarks: 85 },
      { CourseID: 5, ExamDate: '2023-09-30', TotalMarks: 100 },
    ];
    for (const exam of exams) {
      await queryParamPromise(
        'INSERT INTO Exams (CourseID, ExamDate, TotalMarks) VALUES (?, ?, ?)',
        [exam.CourseID, exam.ExamDate, exam.TotalMarks]
      );
    }

    // Scholarships
    const scholarships = [
      { Amount: 1000.00, EligibilityCriteria: 'GPA above 3.5' },
      { Amount: 1500.00, EligibilityCriteria: 'Community Service' },
      { Amount: 2000.00, EligibilityCriteria: 'Top 10% in class' },
      { Amount: 1200.00, EligibilityCriteria: 'Financial Need' },
      { Amount: 1800.00, EligibilityCriteria: 'STEM Major' },
    ];
    for (const scholarship of scholarships) {
      await queryParamPromise(
        'INSERT INTO Scholarships (Amount, EligibilityCriteria) VALUES (?, ?)',
        [scholarship.Amount, scholarship.EligibilityCriteria]
      );
    }

    // Clubs
    const clubs = [
      { ClubName: 'Robotics Club', FacultyAdvisorID: 1 },
      { ClubName: 'Drama Club', FacultyAdvisorID: 2 },
      { ClubName: 'Music Club', FacultyAdvisorID: 3 },
      { ClubName: 'Science Club', FacultyAdvisorID: 4 },
      { ClubName: 'Literary Club', FacultyAdvisorID: 5 },
    ];
    for (const club of clubs) {
      await queryParamPromise(
        'INSERT INTO Clubs (ClubName, FacultyAdvisorID) VALUES (?, ?)',
        [club.ClubName, club.FacultyAdvisorID]
      );
    }

    // Payments
    const payments = [
      { Amount: 1500.00, PaymentDate: '2023-08-01', StudentID: 1 },
      { Amount: 1200.00, PaymentDate: '2023-07-15', StudentID: 2 },
      { Amount: 1800.00, PaymentDate: '2023-09-05', StudentID: 3 },
      { Amount: 1000.00, PaymentDate: '2023-10-10', StudentID: 4 },
      { Amount: 1400.00, PaymentDate: '2023-06-20', StudentID: 5 },
    ];
    for (const payment of payments) {
      await queryParamPromise(
        'INSERT INTO Payments (Amount, PaymentDate, StudentID) VALUES (?, ?, ?)',
        [payment.Amount, payment.PaymentDate, payment.StudentID]
      );
    }

    // Alumni
    const alumni = [
      { GraduationDate: '2022-09-01', DepartmentID: 1 },
      { GraduationDate: '2023-09-01', DepartmentID: 2 },
      { GraduationDate: '2024-09-01', DepartmentID: 3 },
      { GraduationDate: '2023-12-01', DepartmentID: 4 },
      { GraduationDate: '2022-09-01', DepartmentID: 5 },
    ];
    for (const alum of alumni) {
      await queryParamPromise(
        'INSERT INTO Alumni (GraduationDate, DepartmentID) VALUES (?, ?)',
        [alum.GraduationDate, alum.DepartmentID]
      );
    }

    // Parent Contact
    const parents = [
      { ParentName: 'John Smith', PhoneNumber: '123-456-7890', StudentID: 1 },
      { ParentName: 'Mary Johnson', PhoneNumber: '234-567-8901', StudentID: 2 },
      { ParentName: 'Richard Williams', PhoneNumber: '345-678-9012', StudentID: 3 },
      { ParentName: 'Linda Jones', PhoneNumber: '456-789-0123', StudentID: 4 },
      { ParentName: 'Karen Brown', PhoneNumber: '567-890-1234', StudentID: 5 },
    ];
    for (const parent of parents) {
      await queryParamPromise(
        'INSERT INTO Parent_Contact (ParentName, PhoneNumber, StudentID) VALUES (?, ?, ?)',
        [parent.ParentName, parent.PhoneNumber, parent.StudentID]
      );
    }

    // Internships
    const internships = [
      { CompanyName: 'TechCorp'},
      { CompanyName: 'DataSolutions'},
      { CompanyName: 'Innovative Labs'},
      { CompanyName: 'GreenTech'},
      { CompanyName: 'HealthPlus'},
    ];
    for (const internship of internships) {
      await queryParamPromise(
        'INSERT INTO Internships (CompanyName) VALUES (?)',
        [internship.CompanyName]
      );
    }

    // Faculty-Course Mapping
    const facultyCourseMapping = [
      { FacultyID: 1, CourseID: 1 },
      { FacultyID: 2, CourseID: 2 },
      { FacultyID: 3, CourseID: 3 },
      { FacultyID: 4, CourseID: 4 },
      { FacultyID: 5, CourseID: 5 },
    ];
    for (const mapping of facultyCourseMapping) {
      await queryParamPromise(
        'INSERT INTO Faculty_Course_Mapping (FacultyID, CourseID) VALUES (?, ?)',
        [mapping.FacultyID, mapping.CourseID]
      );
    }

    // Student-Club Mapping
    const studentClubMapping = [
      { StudentID: 1, ClubID: 1 },
      { StudentID: 2, ClubID: 2 },
      { StudentID: 3, ClubID: 3 },
      { StudentID: 4, ClubID: 4 },
      { StudentID: 5, ClubID: 5 },
    ];
    for (const mapping of studentClubMapping) {
      await queryParamPromise(
        'INSERT INTO Student_Club_Mapping (StudentID, ClubID) VALUES (?, ?)',
        [mapping.StudentID, mapping.ClubID]
      );
    }

    // Scholarship-Student Mapping
    const scholarshipStudentMapping = [
      { ScholarshipID: 1, StudentID: 1 },
      { ScholarshipID: 2, StudentID: 2 },
      { ScholarshipID: 3, StudentID: 3 },
      { ScholarshipID: 4, StudentID: 4 },
      { ScholarshipID: 5, StudentID: 5 },
    ];
    for (const mapping of scholarshipStudentMapping) {
      await queryParamPromise(
        'INSERT INTO Scholarship_Student_Mapping (ScholarshipID, StudentID) VALUES (?, ?)',
        [mapping.ScholarshipID, mapping.StudentID]
      );
    }

    // Student-Course Mapping
    const studentCourseMapping = [
      { StudentID: 1, CourseID: 1 },
      { StudentID: 2, CourseID: 2 },
      { StudentID: 3, CourseID: 3 },
      { StudentID: 4, CourseID: 4 },
      { StudentID: 5, CourseID: 5 },
    ];
    for (const mapping of studentCourseMapping) {
      await queryParamPromise(
        'INSERT INTO Student_Course_Mapping (StudentID, CourseID) VALUES (?, ?)',
        [mapping.StudentID, mapping.CourseID]
      );
    }

    // Student-Internship Mapping
    const studentInternshipMapping = [
      { StudentID: 1, InternshipID: 1 },
      { StudentID: 2, InternshipID: 2 },
      { StudentID: 3, InternshipID: 3 },
      { StudentID: 4, InternshipID: 4 },
      { StudentID: 5, InternshipID: 5 },
    ];
    for (const mapping of studentInternshipMapping) {
      await queryParamPromise(
        'INSERT INTO Student_Internship_Mapping (StudentID, InternshipID) VALUES (?, ?)',
        [mapping.StudentID, mapping.InternshipID]
      );
    }

    // Phone Numbers for Person
    const phoneNumbers = [
      { PersonID: 1, PhoneNumber: '123-555-0001' },
      { PersonID: 2, PhoneNumber: '123-555-0002' },
      { PersonID: 3, PhoneNumber: '123-555-0003' },
      { PersonID: 4, PhoneNumber: '123-555-0004' },
      { PersonID: 5, PhoneNumber: '123-555-0005' },
    ];
    for (const phone of phoneNumbers) {
      await queryParamPromise(
        'INSERT INTO Person_PhoneNumbers (PersonID, PhoneNumber) VALUES (?, ?)',
        [phone.PersonID, phone.PhoneNumber]
      );
    }

    console.log('Mock data inserted successfully.');
  } catch (err) {
    console.error('Error inserting mock data:', err);
  } finally {
    db.end();
  }
};

insertMockData();

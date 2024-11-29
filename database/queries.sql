-- 1) Student able to enroll into multiple courses and be able to view all student enrollments

-- For each studentID, courseID that is chosen on UI,
-- insert student course mapping
-- INSERT INTO student_course_mapping (StudentID, CourseID) 
-- VALUES (${studentID}, ${courseID});

-- Retrieve all student course mappings:
SELECT scm.StudentID, CONCAT(p.FirstName, ' ', p.LastName) AS StudentName, 
       scm.CourseID, c.CourseName
FROM student_course_mapping scm
JOIN students s ON scm.StudentID = s.StudentID
JOIN person p ON s.PersonID = p.PersonID
JOIN courses c ON scm.CourseID = c.CourseID;

-- Retrieve courses chosen by specific student:
SELECT scm.StudentID, CONCAT(p.FirstName, ' ', p.LastName) AS StudentName, 
       scm.CourseID, c.CourseName
FROM student_course_mapping scm
JOIN students s ON scm.StudentID = s.StudentID
JOIN person p ON s.PersonID = p.PersonID
JOIN courses c ON scm.CourseID = c.CourseID
WHERE scm.StudentID = ${studentID};

--------------------------------------------------------------------

-- 2) Assign faculty to teach specific courses and be able to view all course assignments

-- For each faculty that is chosen on UI to teach this course,
-- insert faculty course mapping,
-- INSERT INTO faculty_course_mapping (FacultyID, CourseID) VALUES (${facultyID}, ${courseID});

-- Retrieve all faculty course mappings:
SELECT 
    fcm.FacultyID, 
    CONCAT(p.FirstName, ' ', p.LastName) AS FacultyName, 
    c.CourseID, 
    c.CourseName, 
    c.Credits, 
    d.DepartmentName
FROM faculty_course_mapping fcm
JOIN faculty f ON fcm.FacultyID = f.FacultyID
JOIN person p ON f.PersonID = p.PersonID
JOIN courses c ON fcm.CourseID = c.CourseID
JOIN departments d ON c.DepartmentID = d.DepartmentID
ORDER BY d.DepartmentName, c.CourseName;


-- Retrieve courses being taught by specific faculty:
SELECT 
    c.CourseID, 
    c.CourseName, 
    c.Credits, 
    d.DepartmentName, 
    CONCAT(p.FirstName, ' ', p.LastName) AS FacultyName
FROM faculty_course_mapping fcm
JOIN faculty f ON fcm.FacultyID = f.FacultyID
JOIN person p ON f.PersonID = p.PersonID
JOIN courses c ON fcm.CourseID = c.CourseID
JOIN departments d ON c.DepartmentID = d.DepartmentID
WHERE fcm.FacultyID = ${facultyID}
ORDER BY c.CourseName;

--------------------------------------------------------------------

-- 3) Generate faculty and course assignment for each department, and be able to view all course assignments in department

-- Retrieve all course assignments for all departments:
SELECT 
    fcm.FacultyID, 
    CONCAT(p.FirstName, ' ', p.LastName) AS FacultyName, 
    c.CourseID, 
    c.CourseName, 
    c.Credits, 
    d.DepartmentName
FROM faculty_course_mapping fcm
JOIN faculty f ON fcm.FacultyID = f.FacultyID
JOIN person p ON f.PersonID = p.PersonID
JOIN courses c ON fcm.CourseID = c.CourseID
JOIN departments d ON c.DepartmentID = d.DepartmentID
ORDER BY d.DepartmentName, c.CourseName;

-- Retrieve course assignments in a specific department:
SELECT 
    c.CourseID, 
    c.CourseName, 
    c.Credits, 
    d.DepartmentName, 
    CONCAT(p.FirstName, ' ', p.LastName) AS FacultyName
FROM courses c
LEFT JOIN faculty_course_mapping fcm ON c.CourseID = fcm.CourseID
LEFT JOIN faculty f ON fcm.FacultyID = f.FacultyID
LEFT JOIN person p ON f.PersonID = p.PersonID
JOIN departments d ON c.DepartmentID = d.DepartmentID
WHERE c.DepartmentID = ${departmentID}
ORDER BY c.CourseName;

--------------------------------------------------------------------

-- 4) Record student payments and generate student payments going on in the university.

-- Record Student Payment:
-- INSERT INTO payments (StudentID, Amount, PaymentDate) VALUES (?, ?, ?)

-- Retrieve All Payments:
SELECT PaymentID, PaymentDate, Amount, CONCAT(FirstName, ' ', LastName) AS StudentName 
FROM payments 
JOIN students ON payments.StudentID = students.StudentID 
JOIN person ON students.PersonID = person.PersonID;

-- Retrieve Payments by Specific Student:
SELECT 
                  payments.PaymentID, 
                  payments.PaymentDate, 
                  payments.Amount, 
                  CONCAT(person.FirstName, ' ', person.LastName) AS StudentName
              FROM payments
              JOIN students ON payments.StudentID = students.StudentID
              JOIN person ON students.PersonID = person.PersonID
              WHERE students.StudentID = ?
              ORDER BY payments.PaymentDate DESC;

--------------------------------------------------------------------

-- 5) Schedule exams for courses and record student grades. Be able to view all exam details.

-- Schedule exam for a specific date for the selected course:
-- INSERT INTO exams (CourseID, ExamDate, TotalMarks) 
-- VALUES (${courseID}, '${examDate}', ${totalMarks});

-- Update exam marks for a specific student:
-- UPDATE student_exam_mapping SET Marks = ? WHERE StudentID = ? AND ExamID = ?

-- Retrieve all exams:
SELECT e.ExamDate, e.TotalMarks, c.CourseName, d.DepartmentName
FROM exams e
JOIN courses c ON e.CourseID = c.CourseID
JOIN departments d ON c.DepartmentID = d.DepartmentID;

-- Retrieve all exam marks of a specific student:
SELECT 
    sem.ExamID,
    e.ExamDate,
    e.TotalMarks,
    sem.Marks AS StudentMarks,
    c.CourseID,
    c.CourseName,
    CONCAT(p.FirstName, ' ', p.LastName) AS StudentName
FROM student_exam_mapping sem
JOIN exams e ON sem.ExamID = e.ExamID
JOIN courses c ON e.CourseID = c.CourseID
JOIN students s ON sem.StudentID = s.StudentID
JOIN person p ON s.PersonID = p.PersonID
WHERE sem.StudentID = ${studentID}
ORDER BY e.ExamDate;

--------------------------------------------------------------------

-- 6) Award scholarships to specific students.

-- Award scholarship to a specific student:
-- INSERT INTO scholarship_student_mapping (StudentID, ScholarshipID) VALUES (?, ?)

-- Retrieve All Scholarships:
SELECT ScholarshipID, Amount, EligibilityCriteria FROM scholarships;

-- Retrieve Students Assigned to a Specific Scholarship:
SELECT s.StudentID, p.FirstName, p.LastName 
                FROM students s
                JOIN person p ON s.PersonID = p.PersonID
                JOIN scholarship_student_mapping ss ON s.StudentID = ss.StudentID
                WHERE ss.ScholarshipID = ?;

--------------------------------------------------------------------

-- 7) Manage student club memberships and faculty advisor.

-- Create a new club:
-- INSERT INTO clubs (ClubName, Description, FacultyAdvisorID) 
-- VALUES ('${clubName}', '${description}', ${facultyAdvisorID});

-- Retrieve Clubs Advised by Specific Faculty:
SELECT ClubID, ClubName, Description, FacultyAdvisorID FROM clubs WHERE FacultyAdvisorID = ?;

-- Retrieve All Clubs with Faculty Advisor Details:
SELECT ClubName, Description, CONCAT(FirstName, ' ', LastName) AS FacultyAdvisor 
FROM clubs 
JOIN faculty ON clubs.FacultyAdvisorID = faculty.FacultyID 
JOIN person ON faculty.PersonID = person.PersonID;

--------------------------------------------------------------------

-- 8) Add and retrieve student contact information.
	  
-- Insert Parent Contact:
-- INSERT INTO parent_contact (ParentName, PhoneNumber, Relationship, StudentID) 
-- VALUES ('${parentName}', '${phoneNumber}', '${relationship}', ${studentID});

-- Retrieve all Parent Contacts::
SELECT pc.ParentName, pc.PhoneNumber, pc.Relationship, CONCAT(p.FirstName, ' ', p.LastName) AS StudentName, pc.StudentID
      FROM parent_contact pc
      JOIN students s ON pc.StudentID = s.StudentID
      JOIN person p ON s.PersonID = p.PersonID;
	  
-- Retrieve parent contacts of a specific student:
SELECT 
    pc.ParentName, 
    pc.PhoneNumber, 
    pc.Relationship, 
    CONCAT(p.FirstName, ' ', p.LastName) AS StudentName, 
    pc.StudentID
FROM parent_contact pc
JOIN students s ON pc.StudentID = s.StudentID
JOIN person p ON s.PersonID = p.PersonID
WHERE pc.StudentID = ${studentID}
ORDER BY pc.ParentName;

--------------------------------------------------------------------

-- 9) Track alumni career progression and current employment.

-- Retrieve All Alumni with Department Details:
SELECT AlumniID, GraduationDate, CurrentJobTitle, CurrentEmployer, Name, Email, DepartmentName
      FROM alumni
      INNER JOIN departments ON alumni.DepartmentID = departments.DepartmentID;
	  
	  
-- Retrieve Alumni in a Specific Department:
SELECT a.AlumniID, a.GraduationDate, a.CurrentJobTitle, a.CurrentEmployer, a.Name, a.Email, d.DepartmentName
FROM alumni a
JOIN departments d ON a.DepartmentID = d.DepartmentID
WHERE d.DepartmentID = ?;

--------------------------------------------------------------------

-- 10) Record and manage student internships

-- Insert Student Internship Mapping:
-- INSERT INTO student_internship_mapping (Duration, Stipend, StudentID, InternshipID) 
-- VALUES ('${duration}', ${stipend}, ${studentID}, ${internshipID});


-- Retrieve All Internships:
SELECT CompanyName, Duration, Stipend, CONCAT(FirstName, ' ', LastName) AS StudentName 
FROM student_internship_mapping 
JOIN internships ON student_internship_mapping.InternshipID = internships.InternshipID 
JOIN students ON student_internship_mapping.StudentID = students.StudentID 
JOIN person ON students.PersonID = person.PersonID;

-- Retrieve internship by a specific student:
SELECT 
    i.CompanyName, 
    sim.Duration, 
    sim.Stipend, 
    CONCAT(p.FirstName, ' ', p.LastName) AS StudentName
FROM student_internship_mapping sim
JOIN internships i ON sim.InternshipID = i.InternshipID
JOIN students s ON sim.StudentID = s.StudentID
JOIN person p ON s.PersonID = p.PersonID
WHERE sim.StudentID = ${studentID}
ORDER BY i.CompanyName;

--------------------------------------------------------------------

-- 11) Add and retrieve parent’s contact information.
	  
-- Insert Parent Contact:
-- INSERT INTO parent_contact (ParentName, PhoneNumber, Relationship, StudentID) 
-- VALUES ('${parentName}', '${phoneNumber}', '${relationship}', ${studentID});

-- Retrieve all Parent Contacts::
SELECT pc.ParentName, pc.PhoneNumber, pc.Relationship, CONCAT(p.FirstName, ' ', p.LastName) AS StudentName, pc.StudentID
      FROM parent_contact pc
      JOIN students s ON pc.StudentID = s.StudentID
      JOIN person p ON s.PersonID = p.PersonID;
	  
-- Retrieve parent contacts of a specific student:
SELECT 
    pc.ParentName, 
    pc.PhoneNumber, 
    pc.Relationship, 
    CONCAT(p.FirstName, ' ', p.LastName) AS StudentName, 
    pc.StudentID
FROM parent_contact pc
JOIN students s ON pc.StudentID = s.StudentID
JOIN person p ON s.PersonID = p.PersonID
WHERE pc.StudentID = ${studentID}
ORDER BY pc.ParentName;

--------------------------------------------------------------------

-- 12) Generate departmental course offerings and faculty assignments.

-- Retrieve All Courses with Faculty and Department Info:
SELECT c.CourseID, c.CourseName, c.Credits, d.DepartmentName, CONCAT(p.FirstName, " ", p.LastName) AS FacultyName
FROM courses c
JOIN faculty_course_mapping fcm ON c.CourseID = fcm.CourseID
JOIN faculty f ON fcm.FacultyID = f.FacultyID
JOIN departments d ON c.DepartmentID = d.DepartmentID
JOIN person p ON f.PersonID = p.PersonID
ORDER BY c.CourseID;

-- Retrieve Course Assignments by Department
SELECT 
              courses.CourseID,
              courses.CourseName,
              faculty.FacultyID,
              CONCAT(person.FirstName, " ", person.LastName) AS FacultyName,
              departments.DepartmentName,
              departments.DepartmentID
          FROM courses
          JOIN faculty_course_mapping fcm ON courses.CourseID = fcm.CourseID
          JOIN faculty ON fcm.FacultyID = faculty.FacultyID
          JOIN person ON person.PersonID = faculty.PersonID
          JOIN departments ON courses.DepartmentID = departments.DepartmentID
          WHERE courses.DepartmentID = ${departmentId}
          ORDER BY departments.DepartmentName, courses.CourseName;


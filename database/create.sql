DROP DATABASE IF EXISTS university_management_system;

CREATE DATABASE university_management_system;

USE university_management_system;

CREATE TABLE IF NOT EXISTS `Departments` (
    `DepartmentID` INT UNSIGNED AUTO_INCREMENT,
    `DepartmentName` VARCHAR(50) NOT NULL,
    `Building_Name` VARCHAR(50),
    PRIMARY KEY (`DepartmentID`)
);

CREATE TABLE IF NOT EXISTS `Person` (
    `PersonID` INT UNSIGNED AUTO_INCREMENT,
    `FirstName` VARCHAR(30) NOT NULL,
    `LastName` VARCHAR(30) NOT NULL,
    `Email` VARCHAR(50) NOT NULL UNIQUE,
    `City` VARCHAR(50),
    `State` VARCHAR(50),
    `ZipCode` VARCHAR(10),
    `DateOfBirth` DATE,
    PRIMARY KEY (`PersonID`)
);

CREATE TABLE IF NOT EXISTS `Students` (
    `StudentID` INT UNSIGNED AUTO_INCREMENT,
    `EnrollmentDate` DATE NOT NULL,
    `PersonID` INT UNSIGNED NOT NULL,
    PRIMARY KEY (`StudentID`),
    FOREIGN KEY (`PersonID`) REFERENCES `Person`(`PersonID`) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS `Faculty` (
    `FacultyID` INT UNSIGNED AUTO_INCREMENT,
    `DepartmentID` INT UNSIGNED NOT NULL,
    `PersonID` INT UNSIGNED NOT NULL,
    PRIMARY KEY (`FacultyID`),
    FOREIGN KEY (`DepartmentID`) REFERENCES `Departments`(`DepartmentID`) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (`PersonID`) REFERENCES `Person`(`PersonID`) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS `Courses` (
    `CourseID` INT UNSIGNED AUTO_INCREMENT,
    `CourseName` VARCHAR(50) NOT NULL,
    `Credits` TINYINT UNSIGNED NOT NULL,
    `DepartmentID` INT UNSIGNED NOT NULL,
    PRIMARY KEY (`CourseID`),
    FOREIGN KEY (`DepartmentID`) REFERENCES `Departments`(`DepartmentID`) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS `Exams` (
    `ExamID` INT UNSIGNED AUTO_INCREMENT,
    `CourseID` INT UNSIGNED NOT NULL,
    `ExamDate` DATE NOT NULL,
    `TotalMarks` INT UNSIGNED NOT NULL,
    PRIMARY KEY (`ExamID`),
    FOREIGN KEY (`CourseID`) REFERENCES `Courses`(`CourseID`) ON UPDATE CASCADE ON DELETE RESTRICT,
    CHECK (`TotalMarks` >  0 AND `TotalMarks` <= 100)
);

CREATE TABLE IF NOT EXISTS `Scholarships` (
    `ScholarshipID` INT UNSIGNED AUTO_INCREMENT,
    `Amount` DECIMAL(10,2) NOT NULL,
    `EligibilityCriteria` TEXT,
    PRIMARY KEY (`ScholarshipID`),
    CHECK (`Amount` <= 5000)
);

CREATE TABLE IF NOT EXISTS `Clubs` (
    `ClubID` INT UNSIGNED AUTO_INCREMENT,
    `ClubName` VARCHAR(50) NOT NULL,
    `Description` TEXT,
    `FacultyAdvisorID` INT UNSIGNED,
    PRIMARY KEY (`ClubID`),
    FOREIGN KEY (`FacultyAdvisorID`) REFERENCES `Faculty`(`FacultyID`) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS `Payments` (
    `PaymentID` INT UNSIGNED AUTO_INCREMENT,
    `StudentID` INT UNSIGNED NOT NULL,
    `Amount` DECIMAL(10,2) NOT NULL,
    `PaymentDate` DATE NOT NULL,
    PRIMARY KEY (`PaymentID`),
    FOREIGN KEY (`StudentID`) REFERENCES `Students`(`StudentID`) ON UPDATE CASCADE ON DELETE RESTRICT,
    CHECK (`Amount` > 0)
);

CREATE TABLE IF NOT EXISTS `Alumni` (
    `AlumniID` INT UNSIGNED AUTO_INCREMENT,
    `GraduationDate` DATE NOT NULL,
    `CurrentJobTitle` VARCHAR(50),
    `CurrentEmployer` VARCHAR(50),
    `Name` VARCHAR(50),
    `Email` VARCHAR(50),
    `DepartmentID` INT UNSIGNED,
    PRIMARY KEY (`AlumniID`),
    FOREIGN KEY (`DepartmentID`) REFERENCES `Departments`(`DepartmentID`) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS `Parent_Contact` (
    `StudentID` INT UNSIGNED NOT NULL,
    `ParentName` VARCHAR(50) NOT NULL,
    `PhoneNumber` VARCHAR(15),
    `Relationship` VARCHAR(50),
    PRIMARY KEY (`StudentID`, `ParentName`),
    FOREIGN KEY (`StudentID`) REFERENCES `Students`(`StudentID`) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS `Internships` (
    `InternshipID` INT UNSIGNED AUTO_INCREMENT,
    `CompanyName` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`InternshipID`)
);

CREATE TABLE IF NOT EXISTS `Faculty_Course_Mapping` (
    `FacultyID` INT UNSIGNED NOT NULL,
    `CourseID` INT UNSIGNED NOT NULL,
    PRIMARY KEY (`FacultyID`, `CourseID`),
    FOREIGN KEY (`FacultyID`) REFERENCES `Faculty`(`FacultyID`) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (`CourseID`) REFERENCES `Courses`(`CourseID`) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS `Student_Club_Mapping` (
    `StudentID` INT UNSIGNED NOT NULL,
    `ClubID` INT UNSIGNED NOT NULL,
    PRIMARY KEY (`StudentID`, `ClubID`),
    FOREIGN KEY (`StudentID`) REFERENCES `Students`(`StudentID`) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (`ClubID`) REFERENCES `Clubs`(`ClubID`) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS `Scholarship_Student_Mapping` (
    `StudentID` INT UNSIGNED NOT NULL,
    `ScholarshipID` INT UNSIGNED NOT NULL,
    PRIMARY KEY (`StudentID`, `ScholarshipID`),
    FOREIGN KEY (`StudentID`) REFERENCES `Students`(`StudentID`) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (`ScholarshipID`) REFERENCES `Scholarships`(`ScholarshipID`) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS `Student_Course_Mapping` (
    `StudentID` INT UNSIGNED NOT NULL,
    `CourseID` INT UNSIGNED NOT NULL,
    `Marks` INT CHECK (Marks >= 0),
    PRIMARY KEY (`StudentID`, `CourseID`),
    FOREIGN KEY (`StudentID`) REFERENCES `Students`(`StudentID`) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (`CourseID`) REFERENCES `Courses`(`CourseID`) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS `Student_Exam_Mapping` (
    `StudentID` INT UNSIGNED NOT NULL,
    `ExamID` INT UNSIGNED NOT NULL,
    `Marks` INT,
    PRIMARY KEY (`StudentID`, `ExamID`),
    FOREIGN KEY (`StudentID`) REFERENCES `Students`(`StudentID`) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (`ExamID`) REFERENCES `Exams`(`ExamID`) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS `Student_Internship_Mapping` (
    `StudentID` INT UNSIGNED NOT NULL,
    `InternshipID` INT UNSIGNED NOT NULL,
    `Duration` VARCHAR(50),
    `Stipend` DECIMAL(10,2),
    PRIMARY KEY (`StudentID`, `InternshipID`),
    FOREIGN KEY (`StudentID`) REFERENCES `Students`(`StudentID`) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (`InternshipID`) REFERENCES `Internships`(`InternshipID`) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS `Person_PhoneNumbers` (
    `PersonID` INT UNSIGNED NOT NULL,
    `PhoneNumber` VARCHAR(15) NOT NULL,
    PRIMARY KEY (`PersonID`, `PhoneNumber`),
    FOREIGN KEY (`PersonID`) REFERENCES `Person`(`PersonID`) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE VIEW Faculty_Person_Department AS
SELECT FacultyID, DepartmentID, DepartmentName, CONCAT(FirstName, ' ', LastName) AS Name, Email, DateOfBirth 
FROM faculty NATURAL JOIN person NATURAL JOIN departments;

CREATE VIEW Student_Person AS
SELECT StudentID, CONCAT(FirstName, " ", LastName) AS Name 
FROM students JOIN person ON students.PersonID = person.PersonID;

DELIMITER //

CREATE TRIGGER before_insert_students
BEFORE INSERT ON Students
FOR EACH ROW
BEGIN
  DECLARE dob DATE;
  DECLARE age INT;
  
  -- Retrieve the DateOfBirth into a variable to avoid subquery issues
  SELECT DateOfBirth INTO dob 
  FROM Person 
  WHERE PersonID = NEW.PersonID;

  SET age = TIMESTAMPDIFF(YEAR, dob, CURDATE());
  
  IF age < 16 THEN
    SIGNAL SQLSTATE '45000' 
    SET MESSAGE_TEXT = 'Student must be at least 16 years old to enroll';
  END IF;
END;
//

DELIMITER ;

-- Add index for filtering staff by department
CREATE INDEX idx_faculty_department ON Faculty(DepartmentID);

-- Add index for filtering students by courses
CREATE INDEX idx_student_course ON Student_Course_Mapping(CourseID);

-- Add index for filtering courses by department
CREATE INDEX idx_course_department ON Courses(DepartmentID);
USE cumsdbms;

CREATE TABLE IF NOT EXISTS `Person` (
    `PersonID` INT AUTO_INCREMENT,
    `FirstName` VARCHAR(20) NOT NULL,
    `LastName` VARCHAR(20) NOT NULL,
    `Email` VARCHAR(20) NOT NULL UNIQUE,
    `City` VARCHAR(20),
    `State` VARCHAR(20),
    `ZipCode` VARCHAR(10),
    `DateOfBirth` DATE,
    PRIMARY KEY (`PersonID`)
);

CREATE TABLE IF NOT EXISTS `Students` (
    `StudentID` INT AUTO_INCREMENT,
    `EnrollmentDate` DATE NOT NULL,
    `PersonID` INT NOT NULL,
    PRIMARY KEY (`StudentID`),
    FOREIGN KEY (`PersonID`) REFERENCES `Person`(`PersonID`) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS `Faculty` (
    `FacultyID` INT AUTO_INCREMENT,
    `DepartmentID` INT NOT NULL,
    `PersonID` INT NOT NULL,
    PRIMARY KEY (`FacultyID`),
    FOREIGN KEY (`DepartmentID`) REFERENCES `Departments`(`DepartmentID`) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (`PersonID`) REFERENCES `Person`(`PersonID`) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS `Courses` (
    `CourseID` INT AUTO_INCREMENT,
    `CourseName` VARCHAR(30) NOT NULL,
    `Credits` INT NOT NULL,
    `DepartmentID` INT NOT NULL,
    PRIMARY KEY (`CourseID`),
    FOREIGN KEY (`DepartmentID`) REFERENCES `Departments`(`DepartmentID`) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS `Departments` (
    `DepartmentID` INT AUTO_INCREMENT,
    `DepartmentName` VARCHAR(30) NOT NULL,
    `Building_Name` VARCHAR(20),
    PRIMARY KEY (`DepartmentID`)
);

CREATE TABLE IF NOT EXISTS `Exams` (
    `ExamID` INT AUTO_INCREMENT,
    `CourseID` INT NOT NULL,
    `ExamDate` DATE NOT NULL,
    `TotalMarks` INT NOT NULL,
    PRIMARY KEY (`ExamID`),
    FOREIGN KEY (`CourseID`) REFERENCES `Courses`(`CourseID`) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS `Scholarships` (
    `ScholarshipID` INT AUTO_INCREMENT,
    `Amount` DECIMAL(10,2) NOT NULL,
    `EligibilityCriteria` TEXT,
    PRIMARY KEY (`ScholarshipID`)
);

CREATE TABLE IF NOT EXISTS `Clubs` (
    `ClubID` INT AUTO_INCREMENT,
    `ClubName` VARCHAR(20) NOT NULL,
    `Description` TEXT,
    `FacultyAdvisorID` INT,
    PRIMARY KEY (`ClubID`),
    FOREIGN KEY (`FacultyAdvisorID`) REFERENCES `Faculty`(`FacultyID`) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS `Payments` (
    `PaymentID` INT AUTO_INCREMENT,
    `StudentID` INT NOT NULL,
    `Amount` DECIMAL(10,2) NOT NULL,
    `PaymentDate` DATE NOT NULL,
    PRIMARY KEY (`PaymentID`),
    FOREIGN KEY (`StudentID`) REFERENCES `Students`(`StudentID`) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS `Alumni` (
    `AlumniID` INT AUTO_INCREMENT,
    `GraduationDate` DATE NOT NULL,
    `CurrentJobTitle` VARCHAR(20),
    `CurrentEmployer` VARCHAR(30),
    `Name` VARCHAR(20),
    `Email` VARCHAR(20),
    `DepartmentID` INT,
    PRIMARY KEY (`AlumniID`),
    FOREIGN KEY (`DepartmentID`) REFERENCES `Departments`(`DepartmentID`) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS `Parent_Contact` (
    `StudentID` INT NOT NULL,
    `ParentName` VARCHAR(20) NOT NULL,
    `PhoneNumber` VARCHAR(15),
    `Relationship` VARCHAR(20),
    PRIMARY KEY (`StudentID`, `ParentName`),
    FOREIGN KEY (`StudentID`) REFERENCES `Students`(`StudentID`) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS `Internships` (
    `InternshipID` INT AUTO_INCREMENT,
    `CompanyName` VARCHAR(20) NOT NULL,
    PRIMARY KEY (`InternshipID`)
);

CREATE TABLE IF NOT EXISTS `Faculty_Course_Mapping` (
    `FacultyID` INT NOT NULL,
    `CourseID` INT NOT NULL,
    PRIMARY KEY (`FacultyID`, `CourseID`),
    FOREIGN KEY (`FacultyID`) REFERENCES `Faculty`(`FacultyID`) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (`CourseID`) REFERENCES `Courses`(`CourseID`) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS `Student_Club_Mapping` (
    `StudentID` INT NOT NULL,
    `ClubID` INT NOT NULL,
    PRIMARY KEY (`StudentID`, `ClubID`),
    FOREIGN KEY (`StudentID`) REFERENCES `Students`(`StudentID`) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (`ClubID`) REFERENCES `Clubs`(`ClubID`) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS `Scholarship_Student_Mapping` (
    `StudentID` INT NOT NULL,
    `ScholarshipID` INT NOT NULL,
    PRIMARY KEY (`StudentID`, `ScholarshipID`),
    FOREIGN KEY (`StudentID`) REFERENCES `Students`(`StudentID`) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (`ScholarshipID`) REFERENCES `Scholarships`(`ScholarshipID`) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS `Student_Course_Mapping` (
    `StudentID` INT NOT NULL,
    `CourseID` INT NOT NULL,
    `Marks` INT,
    PRIMARY KEY (`StudentID`, `CourseID`),
    FOREIGN KEY (`StudentID`) REFERENCES `Students`(`StudentID`) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (`CourseID`) REFERENCES `Courses`(`CourseID`) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS `Student_Internship_Mapping` (
    `StudentID` INT NOT NULL,
    `InternshipID` INT NOT NULL,
    `Duration` VARCHAR(50),
    `Stipend` DECIMAL(10,2),
    PRIMARY KEY (`StudentID`, `InternshipID`),
    FOREIGN KEY (`StudentID`) REFERENCES `Students`(`StudentID`) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (`InternshipID`) REFERENCES `Internships`(`InternshipID`) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS `Person_PhoneNumbers` (
    `PersonID` INT NOT NULL,
    `Phone_Number` VARCHAR(15) NOT NULL,
    PRIMARY KEY (`PersonID`, `Phone_Number`),
    FOREIGN KEY (`PersonID`) REFERENCES `Person`(`PersonID`) ON UPDATE CASCADE ON DELETE RESTRICT
);

INSERT INTO Departments (DepartmentName, Building_Name) VALUES 
('Computer Science', 'CS Building'),
('Mathematics', 'Math Hall'),
('Physics', 'Physics Center'),
('Economics', 'Econ Tower'),
('Biology', 'Bio Hall'),
('Engineering', 'Engg Block'),
('History', 'History Tower'),
('Literature', 'Lit Hall'),
('Psychology', 'Psych Center'),
('Law', 'Law Block');

INSERT INTO Person (FirstName, LastName, Email, City, State, ZipCode, DateOfBirth) VALUES
('Ravi', 'Sharma', 'ravi.sharma@example.com', 'Mumbai', 'Maharashtra', '400001', '2000-01-15'),
('Emily', 'Brown', 'emily.brown@example.com', 'New York', 'New York', '10001', '1998-07-22'),
('Arun', 'Kumar', 'arun.kumar@example.com', 'Bangalore', 'Karnataka', '560001', '1995-09-10'),
('Sophia', 'Davis', 'sophia.davis@example.com', 'San Francisco', 'California', '94101', '1992-05-18'),
('Nisha', 'Verma', 'nisha.verma@example.com', 'Delhi', 'Delhi', '110001', '2001-03-05'),
('John', 'Smith', 'john.smith@example.com', 'Chicago', 'Illinois', '60601', '1997-02-14'),
('Ananya', 'Patel', 'ananya.patel@example.com', 'Ahmedabad', 'Gujarat', '380001', '2003-11-22'),
('Daniel', 'Lee', 'daniel.lee@example.com', 'Seattle', 'Washington', '98101', '1996-12-10'),
('Priya', 'Iyer', 'priya.iyer@example.com', 'Chennai', 'Tamil Nadu', '600001', '1999-09-20'),
('Jessica', 'Taylor', 'jessica.taylor@example.com', 'Los Angeles', 'California', '90001', '2002-04-10');

INSERT INTO Students (EnrollmentDate, PersonID) VALUES
('2020-08-15', 1),
('2019-08-15', 2),
('2021-08-15', 3),
('2020-08-15', 4),
('2021-08-15', 5),
('2022-08-15', 6),
('2018-08-15', 7),
('2017-08-15', 8),
('2020-08-15', 9),
('2021-08-15', 10);

INSERT INTO Faculty (DepartmentID, PersonID) VALUES
(1, 2),
(2, 3),
(3, 4),
(4, 5),
(5, 6),
(6, 7),
(7, 8),
(8, 9),
(9, 10),
(10, 1);

INSERT INTO Courses (CourseName, Credits, DepartmentID) VALUES
('Data Structures', 4, 1),
('Linear Algebra', 3, 2),
('Quantum Mechanics', 4, 3),
('Microeconomics', 3, 4),
('Cell Biology', 4, 5),
('Thermodynamics', 3, 6),
('World History', 3, 7),
('Shakespearean Literature', 3, 8),
('Behavioral Psychology', 3, 9),
('Constitutional Law', 4, 10);

INSERT INTO Exams (CourseID, ExamDate, TotalMarks) VALUES
(1, '2023-01-15', 100),
(2, '2023-01-16', 100),
(3, '2023-01-17', 100),
(4, '2023-01-18', 100),
(5, '2023-01-19', 100),
(6, '2023-01-20', 100),
(7, '2023-01-21', 100),
(8, '2023-01-22', 100),
(9, '2023-01-23', 100),
(10, '2023-01-24', 100);

INSERT INTO Scholarships (Amount, EligibilityCriteria) VALUES
(1000, 'Top 10% students in department'),
(1500, 'Top 5% students in university'),
(1200, 'Outstanding extracurricular achievement'),
(800, 'Sports quota'),
(2000, 'Meritorious female students'),
(500, 'SC/ST quota'),
(300, 'Students from economically weaker sections'),
(100, 'Student union leaders'),
(900, 'Arts and culture winners'),
(2000, 'Engineering excellence');

INSERT INTO Clubs (ClubName, Description, FacultyAdvisorID) VALUES
('Robotics Club', 'Focus on robotics and automation', 1),
('Math Society', 'Dedicated to advanced mathematical studies', 2),
('Physics Club', 'Explore quantum mechanics and beyond', 3),
('Economics Forum', 'Discuss global economic trends', 4),
('Bio Innovators', 'Focus on biotechnology projects', 5),
('Tech Club', 'Explore latest technology trends', 6),
('History Buffs', 'Discover and discuss history', 7),
('Literature Circle', 'Discuss classical and modern literature', 8),
('Psychology Hub', 'Delve into behavioral sciences', 9),
('Law Society', 'Focus on constitutional and corporate law', 10);

INSERT INTO Payments (StudentID, Amount, PaymentDate) VALUES
(1, 1200.00, '2023-01-10'),
(2, 1500.00, '2023-02-14'),
(3, 1000.00, '2023-03-12'),
(4, 1300.00, '2023-04-22'),
(5, 1400.00, '2023-05-18'),
(6, 1100.00, '2023-06-01'),
(7, 1050.00, '2023-07-20'),
(8, 1500.00, '2023-08-15'),
(9, 1250.00, '2023-09-10'),
(10, 1400.00, '2023-10-05');

INSERT INTO Alumni (GraduationDate, CurrentJobTitle, CurrentEmployer, Name, Email, DepartmentID) VALUES
('2020-05-15', 'Software Engineer', 'Google', 'Ravi Sharma', 'ravi.sharma@alumni.com', 1),
('2019-06-10', 'Data Scientist', 'Amazon', 'Emily Brown', 'emily.brown@alumni.com', 2),
('2021-07-20', 'Research Scientist', 'ISRO', 'Arun Kumar', 'arun.kumar@alumni.com', 3),
('2020-09-25', 'Economist', 'World Bank', 'Sophia Davis', 'sophia.davis@alumni.com', 4),
('2021-11-12', 'Biotech Analyst', 'Pfizer', 'Nisha Verma', 'nisha.verma@alumni.com', 5),
('2022-01-15', 'Mechanical Engineer', 'Tesla', 'John Smith', 'john.smith@alumni.com', 6),
('2018-03-05', 'Historian', 'National Archives', 'Ananya Patel', 'ananya.patel@alumni.com', 7),
('2017-08-18', 'Editor', 'The New Yorker', 'Daniel Lee', 'daniel.lee@alumni.com', 8),
('2020-05-10', 'Psychologist', 'WHO', 'Priya Iyer', 'priya.iyer@alumni.com', 9),
('2021-10-22', 'Lawyer', 'Supreme Court', 'Jessica Taylor', 'jessica.taylor@alumni.com', 10);

INSERT INTO Faculty_Course_Mapping (FacultyID, CourseID) VALUES
(1, 1), (2, 2), (3, 3), (4, 4), (5, 5),
(6, 6), (7, 7), (8, 8), (9, 9), (10, 10);

INSERT INTO Internships (CompanyName) VALUES
('Google'), ('Microsoft'), ('Amazon'), ('Tesla'), ('ISRO'),
('Pfizer'), ('WHO'), ('National Archives'), ('UNESCO'), ('NASA');

INSERT INTO Student_Internship_Mapping (StudentID, InternshipID, Duration, Stipend) VALUES
(1, 1, '3 months', 30000),
(2, 2, '6 months', 60000),
(3, 3, '1 year', 120000),
(4, 4, '4 months', 40000),
(5, 5, '6 months', 55000),
(6, 6, '3 months', 35000),
(7, 7, '1 year', 100000),
(8, 8, '2 months', 20000),
(9, 9, '5 months', 45000),
(10, 10, '6 months', 50000);

INSERT INTO Parent_Contact (StudentID, ParentName, PhoneNumber, Relationship) VALUES
(1, 'Manoj Sharma', '9123456789', 'Father'),
(2, 'Linda Brown', '8123456789', 'Mother'),
(3, 'Raj Kumar', '7223456789', 'Father'),
(4, 'David Davis', '6323456789', 'Father'),
(5, 'Suman Verma', '9823456789', 'Mother'),
(6, 'George Smith', '9023456789', 'Father'),
(7, 'Meera Patel', '7623456789', 'Mother'),
(8, 'Mark Lee', '8523456789', 'Father'),
(9, 'Ramesh Iyer', '8823456789', 'Father'),
(10, 'Karen Taylor', '7923456789', 'Mother');

INSERT INTO Person_PhoneNumbers (PersonID, PhoneNumber) VALUES
(1, '9123456789'), (2, '8123456789'), (3, '7223456789'),
(4, '6323456789'), (5, '9823456789'), (6, '9023456789'),
(7, '7623456789'), (8, '8523456789'), (9, '8823456789'),
(10, '7923456789');

INSERT INTO Scholarship_Student_Mapping (StudentID, ScholarshipID) VALUES
(1, 1), (2, 2), (3, 3), (4, 4), (5, 5),
(6, 6), (7, 7), (8, 8), (9, 9), (10, 10);

INSERT INTO Student_Club_Mapping (StudentID, ClubID) VALUES
(1, 1), (2, 2), (3, 3), (4, 4), (5, 5),
(6, 6), (7, 7), (8, 8), (9, 9), (10, 10);

INSERT INTO Student_Course_Mapping (StudentID, CourseID, Marks) VALUES
(1, 1, 85), (2, 2, 90), (3, 3, 88), (4, 4, 92), (5, 5, 87),
(6, 6, 89), (7, 7, 94), (8, 8, 86), (9, 9, 93), (10, 10, 91);

INSERT INTO Student_Exam_Mapping (StudentID, ExamID, Marks) VALUES
(1, 1, 85),
(1, 2, 78),
(2, 3, 90),
(2, 4, 88),
(3, 5, 92),
(3, 6, 87),
(4, 7, 80),
(4, 8, 85),
(5, 9, 88),
(5, 10, 93),
(6, 1, 75),
(6, 2, 68),
(7, 3, 81),
(7, 4, 85),
(8, 5, 89),
(8, 6, 78),
(9, 7, 77),
(9, 8, 84),
(10, 9, 80),
(10, 10, 88);
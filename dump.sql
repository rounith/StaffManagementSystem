CREATE DATABASE staff_management;
USE staff_management;


CREATE TABLE staff (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  qualifications VARCHAR(255),
  role VARCHAR(255),
  contact VARCHAR(20),
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending'
);

CREATE TABLE training (
  id INT AUTO_INCREMENT PRIMARY KEY,
  staff_id INT,
  activity_name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  duration_hours INT NOT NULL,
  description TEXT,
  FOREIGN KEY (staff_id) REFERENCES staff(id)
);
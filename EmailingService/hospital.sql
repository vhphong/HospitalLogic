-- MySQL --------------------------------------------------------

CREATE TABLE IF NOT EXISTS patient (
    patient_id INT PRIMARY KEY UNIQUE NOT NULL AUTO_INCREMENT,
    patient_name VARCHAR(200) NOT NULL DEFAULT 'TBD',
    is_inpatient BOOLEAN NOT NULL DEFAULT TRUE,
    patient_status VARCHAR(300),
    date_of_visit DATE NOT NULL
);

INSERT INTO patient(patient_name, patient_status, date_of_visit)
	VALUES ('Alex', 'Tested 1', '2021-11-08');
	
INSERT INTO patient(patient_name, patient_status, date_of_visit)
	VALUES ('Ben', 'Tested 2', '2021-10-18');

INSERT INTO patient(patient_name, patient_status, date_of_visit)
	VALUES ('Cris', 'Tested 3', '2021-9-20');

INSERT INTO patient(patient_name, patient_status, date_of_visit)
	VALUES ('Diane', 'Tested 4', '2021-8-18');

INSERT INTO patient(patient_name, patient_status, date_of_visit)
	VALUES ('Ellie', 'Tested 5', '2021-7-18');

SELECT * FROM patient;
SELECT * FROM patient WHERE patient_id = 1;
SELECT * FROM patient WHERE patient_name = 'Alex';
DELETE * FROM patient WHERE patient_name = samplePatient1;



-- PostgreSQL -------------------------------------------------

DROP TABLE patient;

CREATE TABLE IF NOT EXISTS patient (
    patient_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    patient_name VARCHAR(200) NOT NULL DEFAULT 'TBD',
    is_inpatient BOOLEAN NOT NULL DEFAULT TRUE,
    patient_status VARCHAR(300),
    date_of_visit TIMESTAMP NOT NULL
);


ALTER TABLE patient ALTER COLUMN date_of_visit TYPE TIMESTAMP;
SELECT * FROM patient;
SELECT * FROM patient WHERE patient_id = 1;
SELECT * FROM patient WHERE patient_name = 'Alex';
DELETE FROM patient WHERE patient_name = samplePatient1;
DELETE FROM patient WHERE patient_name LIKE 'patient%';
DELETE FROM patient WHERE patient_name LIKE 'sample%';




-----------------------------------------------
DROP TABLE expense;

CREATE TABLE IF NOT EXISTS expense (
    expense_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    reason VARCHAR(300) NOT NULL,
    amount MONEY NOT NULL,
    billing_date TIMESTAMP NOT NULL,
    p_id INT NOT NULL,
    CONSTRAINT fk_expense_patient FOREIGN KEY (p_id) REFERENCES patient(patient_id)
);

ALTER TABLE expense ALTER COLUMN billing_date TYPE TIMESTAMP;
SELECT * FROM expense ORDER BY p_id;
SELECT * FROM expense WHERE p_id = 1;
SELECT * FROM expense WHERE patient_name = 'Alex';
SELECT * FROM expense WHERE billing_date >= '2021-11-01' AND billing_date <= '2021-11-22';
INSERT INTO expense VALUES (DEFAULT, 'Flu shot', 45.00, '2021-11-19', 1);
INSERT INTO expense VALUES (DEFAULT, 'Insomnia', 578.12, '2021-10-28', 2);
INSERT INTO expense VALUES (DEFAULT, 'Injured from bicyle falling', 724.25, '2021-12-19', 3);
DELETE FROM expense WHERE reason LIKE 'reason%';





-----------------------------------------------
DROP TABLE employee;

CREATE TABLE IF NOT EXISTS employee (
    u_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    u_email VARCHAR(200) NOT NULL,
    u_pw VARCHAR(200) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

SELECT * FROM employee ORDER BY u_id;




-----------------------------------------------
DROP TABLE messages;

CREATE TABLE IF NOT EXISTS messages (
    m_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    sender_email VARCHAR(200) NOT NULL,
    recipient_email VARCHAR(200) NOT NULL,
    m_content TEXT NOT NULL,
    sending_timestamp TIMESTAMP NOT NULL
);

ALTER TABLE messages ADD COLUMN sending_timestamp TIMESTAMP;
SELECT * FROM messages ORDER BY m_id;




-----------------------------------------------
DROP TABLE email;

CREATE TABLE IF NOT EXISTS email (
    email_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    sender_email VARCHAR(200) NOT NULL,
    recipient_email VARCHAR(200) NOT NULL,
    email_subject TEXT NOT NULL,
    email_content TEXT NOT NULL,
    sending_timestamp TIMESTAMP NOT NULL
);

ALTER TABLE email ADD COLUMN sending_timestamp TIMESTAMP;
SELECT * FROM email ORDER BY email_id;
-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 28, 2024 at 11:59 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nmudorm`
--

-- --------------------------------------------------------

--
-- Table structure for table `addressinfo`
--

CREATE TABLE `addressinfo` (
  `addressId` int(11) NOT NULL,
  `governorate` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `memberId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `addressinfo`
--

INSERT INTO `addressinfo` (`addressId`, `governorate`, `city`, `address`, `memberId`) VALUES
(14, 'Assiut', 'manzala', 'fadh', 15),
(15, 'Assiut', 'manzala', 'afdfadf', 16),
(16, 'Assiut', 'manzala', 'afdfadf', 17),
(17, 'Assiut', 'manzala', 'afdfadf', 18),
(19, 'Assiut', 'manzala', 'adfaf', 20),
(21, 'Assiut', 'manzala', 'adfaf', 22),
(22, 'Alexandria', 'Azarita', 'fadf', 26),
(24, 'Giza', 'Giza', 'dsdfadf', 34),
(25, 'Giza', 'Sixth of October', 'dsdfadf', 35),
(28, 'Dakahlia', 'Talkha', 'dsdfadf', 38);

-- --------------------------------------------------------

--
-- Table structure for table `admincredentials`
--

CREATE TABLE `admincredentials` (
  `credentialId` int(11) NOT NULL,
  `adminId` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `passwordHash` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admincredentials`
--

INSERT INTO `admincredentials` (`credentialId`, `adminId`, `email`, `username`, `passwordHash`, `role`) VALUES
(1, 1, 'john.doe@nmu.edu.eg', 'johndoe', '$2y$10$aF5xdmTZH.N5BQ0Fb0MKnO6U25cAhasEM5qzKtdnL50XXS7WT57ua', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `administrators`
--

CREATE TABLE `administrators` (
  `adminId` int(11) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `administrators`
--

INSERT INTO `administrators` (`adminId`, `firstName`, `lastName`) VALUES
(1, 'John', 'Doe');

-- --------------------------------------------------------

--
-- Table structure for table `apartment`
--

CREATE TABLE `apartment` (
  `apartmentId` int(11) NOT NULL,
  `apartmentNumber` int(11) NOT NULL,
  `roomCount` int(11) NOT NULL DEFAULT 30,
  `buildingId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `apartment`
--

INSERT INTO `apartment` (`apartmentId`, `apartmentNumber`, `roomCount`, `buildingId`) VALUES
(111, 210, 30, 35);

-- --------------------------------------------------------

--
-- Table structure for table `building`
--

CREATE TABLE `building` (
  `buildingId` int(11) NOT NULL,
  `buildingNumber` varchar(15) NOT NULL,
  `apartmentLimit` int(11) NOT NULL DEFAULT 30,
  `buildingGender` enum('male','female') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `building`
--

INSERT INTO `building` (`buildingId`, `buildingNumber`, `apartmentLimit`, `buildingGender`) VALUES
(35, '1302', 30, 'male');

-- --------------------------------------------------------

--
-- Table structure for table `contactinfo`
--

CREATE TABLE `contactinfo` (
  `contactId` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phoneNumber` varchar(20) NOT NULL,
  `memberId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contactinfo`
--

INSERT INTO `contactinfo` (`contactId`, `email`, `phoneNumber`, `memberId`) VALUES
(14, 'john.doe@nmu.edu.eg', '01212939615', 15),
(15, 'john.doe@nmu.edu.eg', '01212939615', 16),
(16, 'john.doe@nmu.edu.eg', '01212939615', 17),
(17, 'john.doe@nmu.edu.eg', '01212939615', 18),
(19, 'john.doe@nmu.edu.eg', '01212939615', 20),
(21, 'john.doe@nmu.edu.eg', '01212939615', 22),
(25, 'fadf@yahoo.com', '01212939615', 26),
(28, 'khaled221101039@nmu.edu.eg', '01212939615', 34),
(29, 'khaled221101039@nmu.edu.eg', '01212939615', 35),
(32, 'khaled221101039@nmu.edu.eg', '01212939615', 38);

-- --------------------------------------------------------

--
-- Table structure for table `expelledstudent`
--

CREATE TABLE `expelledstudent` (
  `studentId` int(11) NOT NULL,
  `universityId` int(11) NOT NULL,
  `expelledReason` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `expelledstudent`
--

INSERT INTO `expelledstudent` (`studentId`, `universityId`, `expelledReason`) VALUES
(1, 221101039, 'was making illegal things');

-- --------------------------------------------------------

--
-- Table structure for table `facultyinfo`
--

CREATE TABLE `facultyinfo` (
  `facultyId` int(11) NOT NULL,
  `faculty` varchar(255) NOT NULL,
  `department` varchar(255) NOT NULL,
  `studentId` int(11) NOT NULL,
  `yearOfStudy` int(2) NOT NULL,
  `email` varchar(255) NOT NULL,
  `cgpa` decimal(10,0) DEFAULT NULL,
  `certificateType` varchar(255) DEFAULT NULL,
  `certificateScore` decimal(10,0) DEFAULT NULL,
  `memberId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `facultyinfo`
--

INSERT INTO `facultyinfo` (`facultyId`, `faculty`, `department`, `studentId`, `yearOfStudy`, `email`, `cgpa`, `certificateType`, `certificateScore`, `memberId`) VALUES
(4, 'bio', 'bio', 334435346, 2, 'saeed334435346@nmu.edu.eg', 3, NULL, NULL, 15),
(5, 'ds', 'ds', 454545454, 3, 'khaled454545454@nmu.edu.eg', 4, NULL, NULL, 16),
(6, 'ds', 'ds', 454545454, 3, 'khaled454545454@nmu.edu.eg', 4, NULL, NULL, 17),
(7, 'ds', 'ds', 454545454, 3, 'khaled454545454@nmu.edu.eg', 4, NULL, NULL, 18),
(9, 'mn', 'mn', 454545455, 1, 'khaled454545455@nmu.edu.eg', 3, NULL, NULL, 20),
(11, 'fdf', 'd', 343434334, 1, 'khaled343434334@nmu.edu.eg', 3, NULL, NULL, 22),
(12, 'Faculty of Business', 'Entrepreneurship & Innovation Program', 221101254, 2, 'khaled221101254@nmu.edu.eg', 3, NULL, NULL, 26),
(13, 'Faculty of Textile Science Engineering', 'Textile Polymer & Color Chemistry Engineering Program', 435435435, 1, 'khaled221101039@nmu.edu.eg', 3, NULL, NULL, 34),
(14, 'Faculty of Textile Science Engineering', 'Textile & Apparel Management & Merchandising Program', 343434433, 3, 'khaled221101039@nmu.edu.eg', 3, NULL, NULL, 35),
(17, 'Faculty of Textile Science Engineering', 'Textile Polymer & Color Chemistry Engineering Program', 34234, 1, 'khaled221101039@nmu.edu.eg', 3, NULL, NULL, 38);

-- --------------------------------------------------------

--
-- Table structure for table `field`
--

CREATE TABLE `field` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `field`
--

INSERT INTO `field` (`id`, `name`, `type`) VALUES
(1, 'cgpa', 'numerical'),
(2, 'gender', 'categorical');

-- --------------------------------------------------------

--
-- Table structure for table `fieldcriteria`
--

CREATE TABLE `fieldcriteria` (
  `criteriaId` int(11) NOT NULL,
  `fieldId` int(11) DEFAULT NULL,
  `type` varchar(255) NOT NULL,
  `criteria` text NOT NULL,
  `weight` int(11) NOT NULL,
  `time` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `fieldcriteria`
--

INSERT INTO `fieldcriteria` (`criteriaId`, `fieldId`, `type`, `criteria`, `weight`, `time`) VALUES
(31, 2, 'categorical', 'x = male', 5000, '2024-04-14 16:06:52'),
(32, 2, 'categorical', 'x = female', 2000, '2024-04-14 16:07:04'),
(33, 1, 'compound', 'x > 10 and x < 20', 500, '2024-04-19 11:15:52');

-- --------------------------------------------------------

--
-- Table structure for table `logininfo`
--

CREATE TABLE `logininfo` (
  `loginId` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `passwordHash` varchar(255) NOT NULL,
  `memberId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `logininfo`
--

INSERT INTO `logininfo` (`loginId`, `email`, `passwordHash`, `memberId`) VALUES
(14, 'john.doe@nmu.edu.eg', '309ec4723d8ae0be6a0d1bfec890cc2c', 15),
(15, 'john.doe@nmu.edu.eg', '86daaa2cb3b9547e17622acd8bfa784f', 16),
(16, 'john.doe@nmu.edu.eg', 'e20c91bff5866cd4bef7b66135506428', 17),
(17, 'john.doe@nmu.edu.eg', '2746924d7b2abe641135cefa8e0ef8d3', 18),
(19, 'john.doe@nmu.edu.eg', 'a33d160556e88f88e98b48f9cb24393b', 20),
(21, 'john.doe@nmu.edu.eg', '361a930a96d11eee4081048209a1308b', 22),
(25, 'fadf@yahoo.com', 'c1b54df01434f9f3c8b0c28499dac4f1', 26),
(31, 'khaled221101039@nmu.edu.eg', '35ecfc3b44aa04bb9c5a2792d07a2431', 34),
(32, 'khaled221101039@nmu.edu.eg', '5679b0d88435b3a8b351d48d42f21e3e', 35),
(35, 'khaled221101039@nmu.edu.eg', 'ad252597118c64cb533858fbca248098', 38);

-- --------------------------------------------------------

--
-- Table structure for table `maintenance`
--

CREATE TABLE `maintenance` (
  `Id` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `requestDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('pending','inProgress','complete','reject') NOT NULL,
  `completeDate` timestamp NULL DEFAULT NULL,
  `assignedTo` varchar(35) DEFAULT NULL,
  `roomId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `member`
--

CREATE TABLE `member` (
  `memberId` int(11) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `middleName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `birthdate` date NOT NULL,
  `gender` varchar(7) NOT NULL,
  `nationality` varchar(255) NOT NULL,
  `governmentId` varchar(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `member`
--

INSERT INTO `member` (`memberId`, `firstName`, `middleName`, `lastName`, `birthdate`, `gender`, `nationality`, `governmentId`) VALUES
(20, 'khaled', 'khaled', 'zahran', '2024-05-02', 'male', 'Egyption', '21445554454'),
(22, 'khaled', 'khaled', 'gfgf', '2024-04-17', 'male', 'Egyption', '21445554454'),
(26, 'khaled', 'khaled', 'zahran', '2024-04-12', 'male', 'Algerian', '20200025458'),
(34, 'khaled', 'adfad', 'zahran', '2024-04-03', 'male', 'dafdf', '34343434343433'),
(35, 'khaled', 'adfad', 'zahran', '2024-04-02', 'male', 'dafdf', '34343434343433'),
(38, 'khaled', 'adfad', 'zahran', '2024-04-09', 'male', 'dafdf', '34343434343433');

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `id` int(11) NOT NULL,
  `notificationText` text NOT NULL,
  `senderId` int(11) NOT NULL,
  `receiverId` int(11) DEFAULT NULL,
  `sentAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `allResidents` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `parentalinfo`
--

CREATE TABLE `parentalinfo` (
  `parentId` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phoneNumber` varchar(20) NOT NULL,
  `location` varchar(255) NOT NULL,
  `memberId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `parentalinfo`
--

INSERT INTO `parentalinfo` (`parentId`, `name`, `phoneNumber`, `location`, `memberId`) VALUES
(4, 'khaled zagraf', '01212939615', 'local', 15),
(5, 'khaled saeed', '01212939615', 'local', 16),
(6, 'khaled saeed', '01212939615', 'local', 17),
(7, 'khaled saeed', '01212939615', 'local', 18),
(9, 'khaled gfgf', '01212939615', 'local', 20),
(11, 'khaled gfgf', '01212939615', 'local', 22),
(12, 'khaled zahran', '01212939615', 'abroad', 26),
(13, 'khaled zahran', '01212939615', 'Afghanistan', 34),
(14, 'khaled zahran', '01212939615', 'Afghanistan', 35),
(17, 'khaled zahran', '01212939615', 'Afghanistan', 38);

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `paymentId` int(11) NOT NULL,
  `memberId` int(11) NOT NULL,
  `amount` decimal(10,0) NOT NULL DEFAULT 20000,
  `status` varchar(50) NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`paymentId`, `memberId`, `amount`, `status`) VALUES
(6, 20, 20000, 'pending'),
(8, 22, 20000, 'pending'),
(9, 26, 20000, 'pending'),
(10, 34, 20000, 'pending'),
(11, 35, 20000, 'pending'),
(14, 38, 20000, 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `reservation`
--

CREATE TABLE `reservation` (
  `reservationId` int(11) NOT NULL,
  `residentId` int(11) NOT NULL,
  `roomId` int(11) DEFAULT NULL,
  `reservationDate` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reservation`
--

INSERT INTO `reservation` (`reservationId`, `residentId`, `roomId`, `reservationDate`) VALUES
(16, 11, 28, '2024-04-22 21:21:38');

-- --------------------------------------------------------

--
-- Table structure for table `resident`
--

CREATE TABLE `resident` (
  `residentId` int(11) NOT NULL,
  `score` int(11) NOT NULL,
  `memberId` int(11) NOT NULL,
  `occupancyStatus` varchar(50) NOT NULL DEFAULT 'vacant',
  `moveInDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `moveOutDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `resident`
--

INSERT INTO `resident` (`residentId`, `score`, `memberId`, `occupancyStatus`, `moveInDate`, `moveOutDate`) VALUES
(11, 5000, 20, 'vacant', '2024-04-21 07:30:50', NULL),
(12, 5000, 22, 'vacant', '2024-04-21 07:38:30', NULL),
(13, 5000, 26, 'vacant', '2024-04-25 19:11:00', NULL),
(14, 5000, 34, 'vacant', '2024-04-27 05:37:49', NULL),
(15, 5000, 35, 'vacant', '2024-04-28 10:24:20', NULL),
(16, 5000, 38, 'vacant', '2024-04-28 11:08:03', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `room`
--

CREATE TABLE `room` (
  `roomId` int(11) NOT NULL,
  `roomNumber` int(11) NOT NULL,
  `apartmentId` int(11) DEFAULT NULL,
  `occupancyStatus` varchar(255) NOT NULL DEFAULT 'vacant'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `room`
--

INSERT INTO `room` (`roomId`, `roomNumber`, `apartmentId`, `occupancyStatus`) VALUES
(28, 545, 111, 'vacant');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addressinfo`
--
ALTER TABLE `addressinfo`
  ADD PRIMARY KEY (`addressId`),
  ADD KEY `idxAddressInfoMemberId` (`memberId`);

--
-- Indexes for table `admincredentials`
--
ALTER TABLE `admincredentials`
  ADD PRIMARY KEY (`credentialId`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `adminId` (`adminId`);

--
-- Indexes for table `administrators`
--
ALTER TABLE `administrators`
  ADD PRIMARY KEY (`adminId`);

--
-- Indexes for table `apartment`
--
ALTER TABLE `apartment`
  ADD PRIMARY KEY (`apartmentId`),
  ADD KEY `buildingId` (`buildingId`);

--
-- Indexes for table `building`
--
ALTER TABLE `building`
  ADD PRIMARY KEY (`buildingId`);

--
-- Indexes for table `contactinfo`
--
ALTER TABLE `contactinfo`
  ADD PRIMARY KEY (`contactId`),
  ADD KEY `idxContactInfoMemberId` (`memberId`);

--
-- Indexes for table `expelledstudent`
--
ALTER TABLE `expelledstudent`
  ADD PRIMARY KEY (`studentId`);

--
-- Indexes for table `facultyinfo`
--
ALTER TABLE `facultyinfo`
  ADD PRIMARY KEY (`facultyId`),
  ADD KEY `idxFacultyInfoMemberId` (`memberId`);

--
-- Indexes for table `field`
--
ALTER TABLE `field`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `fieldcriteria`
--
ALTER TABLE `fieldcriteria`
  ADD PRIMARY KEY (`criteriaId`),
  ADD KEY `fieldId` (`fieldId`);

--
-- Indexes for table `logininfo`
--
ALTER TABLE `logininfo`
  ADD PRIMARY KEY (`loginId`),
  ADD KEY `idxLoginInfoEmail` (`email`),
  ADD KEY `memberId` (`memberId`);

--
-- Indexes for table `maintenance`
--
ALTER TABLE `maintenance`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `roomId_idx` (`roomId`);

--
-- Indexes for table `member`
--
ALTER TABLE `member`
  ADD PRIMARY KEY (`memberId`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id`),
  ADD KEY `senderId` (`senderId`),
  ADD KEY `receiverId` (`receiverId`);

--
-- Indexes for table `parentalinfo`
--
ALTER TABLE `parentalinfo`
  ADD PRIMARY KEY (`parentId`),
  ADD KEY `idxParentalInfoMemberId` (`memberId`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`paymentId`),
  ADD KEY `idxPaymentMemberId` (`memberId`);

--
-- Indexes for table `reservation`
--
ALTER TABLE `reservation`
  ADD PRIMARY KEY (`reservationId`),
  ADD KEY `idxReservationResidentId` (`residentId`),
  ADD KEY `fk_roomId` (`roomId`);

--
-- Indexes for table `resident`
--
ALTER TABLE `resident`
  ADD PRIMARY KEY (`residentId`),
  ADD KEY `idxResidentMemberId` (`memberId`);

--
-- Indexes for table `room`
--
ALTER TABLE `room`
  ADD PRIMARY KEY (`roomId`),
  ADD KEY `apartmentId` (`apartmentId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addressinfo`
--
ALTER TABLE `addressinfo`
  MODIFY `addressId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `admincredentials`
--
ALTER TABLE `admincredentials`
  MODIFY `credentialId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `administrators`
--
ALTER TABLE `administrators`
  MODIFY `adminId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `apartment`
--
ALTER TABLE `apartment`
  MODIFY `apartmentId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=112;

--
-- AUTO_INCREMENT for table `building`
--
ALTER TABLE `building`
  MODIFY `buildingId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `contactinfo`
--
ALTER TABLE `contactinfo`
  MODIFY `contactId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `expelledstudent`
--
ALTER TABLE `expelledstudent`
  MODIFY `studentId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `facultyinfo`
--
ALTER TABLE `facultyinfo`
  MODIFY `facultyId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `field`
--
ALTER TABLE `field`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `fieldcriteria`
--
ALTER TABLE `fieldcriteria`
  MODIFY `criteriaId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `logininfo`
--
ALTER TABLE `logininfo`
  MODIFY `loginId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `maintenance`
--
ALTER TABLE `maintenance`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `member`
--
ALTER TABLE `member`
  MODIFY `memberId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `parentalinfo`
--
ALTER TABLE `parentalinfo`
  MODIFY `parentId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `paymentId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `reservation`
--
ALTER TABLE `reservation`
  MODIFY `reservationId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `resident`
--
ALTER TABLE `resident`
  MODIFY `residentId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `room`
--
ALTER TABLE `room`
  MODIFY `roomId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `addressinfo`
--
ALTER TABLE `addressinfo`
  ADD CONSTRAINT `addressinfo_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `member` (`memberId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `admincredentials`
--
ALTER TABLE `admincredentials`
  ADD CONSTRAINT `admincredentials_ibfk_1` FOREIGN KEY (`adminId`) REFERENCES `administrators` (`adminId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `apartment`
--
ALTER TABLE `apartment`
  ADD CONSTRAINT `apartment_ibfk_1` FOREIGN KEY (`buildingId`) REFERENCES `building` (`buildingId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `contactinfo`
--
ALTER TABLE `contactinfo`
  ADD CONSTRAINT `contactinfo_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `member` (`memberId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `facultyinfo`
--
ALTER TABLE `facultyinfo`
  ADD CONSTRAINT `facultyinfo_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `member` (`memberId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `fieldcriteria`
--
ALTER TABLE `fieldcriteria`
  ADD CONSTRAINT `fieldcriteria_ibfk_1` FOREIGN KEY (`fieldId`) REFERENCES `field` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `logininfo`
--
ALTER TABLE `logininfo`
  ADD CONSTRAINT `logininfo_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `member` (`memberId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `maintenance`
--
ALTER TABLE `maintenance`
  ADD CONSTRAINT `fk_room` FOREIGN KEY (`roomId`) REFERENCES `room` (`roomId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `notification`
--
ALTER TABLE `notification`
  ADD CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`senderId`) REFERENCES `administrators` (`adminId`),
  ADD CONSTRAINT `notification_ibfk_2` FOREIGN KEY (`receiverId`) REFERENCES `resident` (`residentId`);

--
-- Constraints for table `parentalinfo`
--
ALTER TABLE `parentalinfo`
  ADD CONSTRAINT `parentalinfo_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `member` (`memberId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `member` (`memberId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reservation`
--
ALTER TABLE `reservation`
  ADD CONSTRAINT `fk_roomId` FOREIGN KEY (`roomId`) REFERENCES `room` (`roomId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reservation_ibfk_1` FOREIGN KEY (`residentId`) REFERENCES `resident` (`residentId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `resident`
--
ALTER TABLE `resident`
  ADD CONSTRAINT `resident_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `member` (`memberId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `room`
--
ALTER TABLE `room`
  ADD CONSTRAINT `room_ibfk_1` FOREIGN KEY (`apartmentId`) REFERENCES `apartment` (`apartmentId`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

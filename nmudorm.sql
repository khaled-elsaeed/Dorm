-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 08, 2024 at 02:51 AM
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
  `id` int(11) NOT NULL,
  `governorate` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `memberId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `addressinfo`
--

INSERT INTO `addressinfo` (`id`, `governorate`, `city`, `address`, `memberId`) VALUES
(6, 'Dakahlia', 'Mansoura', 'manzala', 6),
(9, 'Aswan', 'Kom Ombo', 'fdadfadsf', 9);

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
(1, 1, 'shaymalarby984@gmail.com', 'shayma', '$2y$10$aF5xdmTZH.N5BQ0Fb0MKnO6U25cAhasEM5qzKtdnL50XXS7WT57ua', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `administrators`
--

CREATE TABLE `administrators` (
  `id` int(11) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `administrators`
--

INSERT INTO `administrators` (`id`, `firstName`, `lastName`) VALUES
(1, 'shayma', 'alarabi');

-- --------------------------------------------------------

--
-- Table structure for table `alert`
--

CREATE TABLE `alert` (
  `id` int(11) NOT NULL,
  `type` enum('alert','warning','expulsion') NOT NULL,
  `expelledId` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `alert`
--

INSERT INTO `alert` (`id`, `type`, `expelledId`, `date`) VALUES
(47, 'alert', 13, '2024-04-30 23:57:32'),
(48, 'warning', 13, '2024-04-30 23:57:42'),
(49, 'expulsion', 13, '2024-05-01 00:01:15'),
(50, 'alert', 14, '2024-05-01 00:12:32'),
(51, 'warning', 14, '2024-05-01 00:12:36'),
(52, 'expulsion', 14, '2024-05-01 00:12:41');

-- --------------------------------------------------------

--
-- Table structure for table `apartment`
--

CREATE TABLE `apartment` (
  `id` int(11) NOT NULL,
  `apartmentNumber` int(11) NOT NULL,
  `roomCount` int(11) NOT NULL DEFAULT 30,
  `buildingId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `apartment`
--

INSERT INTO `apartment` (`id`, `apartmentNumber`, `roomCount`, `buildingId`) VALUES
(2, 5454, 30, 2);

-- --------------------------------------------------------

--
-- Table structure for table `building`
--

CREATE TABLE `building` (
  `id` int(11) NOT NULL,
  `buildingNumber` varchar(15) NOT NULL,
  `apartmentLimit` int(11) NOT NULL DEFAULT 24,
  `buildingCategory` enum('male','female','academic staff') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `building`
--

INSERT INTO `building` (`id`, `buildingNumber`, `apartmentLimit`, `buildingCategory`) VALUES
(2, '213', 24, 'male');

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
(6, 'khaled221101039@nmu.edu.eg', '01212939615', 6),
(9, 'khaled221101039@nmu.edu.eg', '01212939615', 9);

-- --------------------------------------------------------

--
-- Table structure for table `expelledstudent`
--

CREATE TABLE `expelledstudent` (
  `id` int(11) NOT NULL,
  `studentId` int(9) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `expulsionStatus` enum('yes','no') DEFAULT 'no',
  `expulsionType` enum('term','year') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `expelledstudent`
--

INSERT INTO `expelledstudent` (`id`, `studentId`, `name`, `expulsionStatus`, `expulsionType`) VALUES
(13, 2147483647, 'Khaled Elsaeedfadf', 'yes', 'year'),
(14, 2147483647, 'Khaled Elsaeedfadf', 'yes', 'term');

-- --------------------------------------------------------

--
-- Table structure for table `facultyinfo`
--

CREATE TABLE `facultyinfo` (
  `id` int(11) NOT NULL,
  `faculty` varchar(255) NOT NULL,
  `department` varchar(255) NOT NULL,
  `studentId` int(11) NOT NULL,
  `level` int(2) NOT NULL,
  `email` varchar(255) NOT NULL,
  `cgpa` decimal(10,0) DEFAULT NULL,
  `certificateType` varchar(255) DEFAULT NULL,
  `certificateScore` decimal(10,0) DEFAULT NULL,
  `memberId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `facultyinfo`
--

INSERT INTO `facultyinfo` (`id`, `faculty`, `department`, `studentId`, `level`, `email`, `cgpa`, `certificateType`, `certificateScore`, `memberId`) VALUES
(4, 'Faculty of Computer Science & Engineering', 'Computer Science Program', 221101039, 2, 'khaled221101039@nmu.edu.eg', 2, NULL, NULL, 6),
(7, 'Faculty of Science', 'Molecular Biology Program', 221102555, 2, 'khaled221101039@nmu.edu.eg', 3, NULL, NULL, 9);

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
(1, 'cgpa', 'numerical');

-- --------------------------------------------------------

--
-- Table structure for table `fieldcriteria`
--

CREATE TABLE `fieldcriteria` (
  `id` int(11) NOT NULL,
  `fieldId` int(11) DEFAULT NULL,
  `type` varchar(255) NOT NULL,
  `criteria` text NOT NULL,
  `weight` int(11) NOT NULL,
  `time` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `fieldcriteria`
--

INSERT INTO `fieldcriteria` (`id`, `fieldId`, `type`, `criteria`, `weight`, `time`) VALUES
(1, 1, 'compound', 'x > 1 and x <= 2', 1500, '2024-05-07 14:40:40');

-- --------------------------------------------------------

--
-- Table structure for table `insurance`
--

CREATE TABLE `insurance` (
  `insuranceId` int(11) NOT NULL,
  `memberId` int(11) DEFAULT NULL,
  `amount` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `insurance`
--

INSERT INTO `insurance` (`insuranceId`, `memberId`, `amount`) VALUES
(1, 6, 2500);

-- --------------------------------------------------------

--
-- Table structure for table `logininfo`
--

CREATE TABLE `logininfo` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `passwordHash` varchar(255) NOT NULL,
  `memberId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `logininfo`
--

INSERT INTO `logininfo` (`id`, `email`, `passwordHash`, `memberId`) VALUES
(6, 'khaled221101039@nmu.edu.eg', '67d1daa312b438528b703a1931aa7ace', 6),
(9, 'khaled221101039@nmu.edu.eg', 'ca44ba436a174fc8894f5db22e699eae', 9);

-- --------------------------------------------------------

--
-- Table structure for table `maintenance`
--

CREATE TABLE `maintenance` (
  `id` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `requestDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('pending','inProgress','complete','reject') NOT NULL,
  `completeDate` timestamp NULL DEFAULT NULL,
  `assignedTo` varchar(35) DEFAULT NULL,
  `roomId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `maintenance`
--

INSERT INTO `maintenance` (`id`, `description`, `requestDate`, `status`, `completeDate`, `assignedTo`, `roomId`) VALUES
(2, 'fdafdaf', '2024-05-07 12:33:35', 'pending', NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `member`
--

CREATE TABLE `member` (
  `id` int(11) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `middleName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `birthdate` date NOT NULL,
  `gender` varchar(7) NOT NULL,
  `nationality` varchar(255) NOT NULL,
  `governmentId` varchar(16) NOT NULL,
  `status` enum('pending','accepted','rejected') NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `member`
--

INSERT INTO `member` (`id`, `firstName`, `middleName`, `lastName`, `birthdate`, `gender`, `nationality`, `governmentId`, `status`) VALUES
(6, 'Khaled', 'El-Saeid', 'zahran', '2024-05-16', 'male', 'Egyptian', '30308218800598', 'accepted'),
(9, 'mohamed ', 'Ahmed Mohamed', 'essam', '2024-05-08', 'male', 'Bangladeshi', '22110133333025', 'accepted');

-- --------------------------------------------------------

--
-- Table structure for table `note`
--

CREATE TABLE `note` (
  `noteId` int(11) NOT NULL,
  `alertId` int(11) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `note`
--

INSERT INTO `note` (`noteId`, `alertId`, `description`) VALUES
(45, 47, 'fadsfasdf'),
(46, 48, 'adfdfdf33'),
(47, 49, '45465'),
(48, 50, 'fadfa'),
(49, 51, 'dafdfa'),
(50, 52, 'adsfe434');

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
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phoneNumber` varchar(20) NOT NULL,
  `location` varchar(255) NOT NULL,
  `memberId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `parentalinfo`
--

INSERT INTO `parentalinfo` (`id`, `name`, `phoneNumber`, `location`, `memberId`) VALUES
(4, 'saeed zahran', '01224083706', 'local', 6),
(7, 'Khaled Zahran', '01212939615', 'abroad', 9);

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `id` int(11) NOT NULL,
  `memberId` int(11) NOT NULL,
  `amount` decimal(10,0) NOT NULL DEFAULT 20000
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`id`, `memberId`, `amount`) VALUES
(4, 6, 20000),
(7, 9, 20000);

-- --------------------------------------------------------

--
-- Table structure for table `reservation`
--

CREATE TABLE `reservation` (
  `id` int(11) NOT NULL,
  `residentId` int(11) NOT NULL,
  `roomId` int(11) DEFAULT NULL,
  `reservationDate` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reservation`
--

INSERT INTO `reservation` (`id`, `residentId`, `roomId`, `reservationDate`) VALUES
(1, 3, 1, '2024-05-07 12:10:36');

-- --------------------------------------------------------

--
-- Table structure for table `resident`
--

CREATE TABLE `resident` (
  `id` int(11) NOT NULL,
  `score` int(11) NOT NULL,
  `memberId` int(11) NOT NULL,
  `occupancyStatus` varchar(50) NOT NULL DEFAULT 'vacant',
  `moveInDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `moveOutDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `resident`
--

INSERT INTO `resident` (`id`, `score`, `memberId`, `occupancyStatus`, `moveInDate`, `moveOutDate`) VALUES
(3, 1500, 6, 'occupied', '2024-05-07 11:55:35', NULL),
(6, 0, 9, 'vacant', '2024-05-07 16:22:28', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `room`
--

CREATE TABLE `room` (
  `id` int(11) NOT NULL,
  `roomNumber` int(11) NOT NULL,
  `apartmentId` int(11) DEFAULT NULL,
  `occupancyStatus` varchar(255) NOT NULL DEFAULT 'vacant'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `room`
--

INSERT INTO `room` (`id`, `roomNumber`, `apartmentId`, `occupancyStatus`) VALUES
(1, 21, 2, 'occupied');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addressinfo`
--
ALTER TABLE `addressinfo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `memberId` (`memberId`);

--
-- Indexes for table `admincredentials`
--
ALTER TABLE `admincredentials`
  ADD PRIMARY KEY (`credentialId`),
  ADD KEY `adminId` (`adminId`);

--
-- Indexes for table `administrators`
--
ALTER TABLE `administrators`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `alert`
--
ALTER TABLE `alert`
  ADD PRIMARY KEY (`id`),
  ADD KEY `alert_ibfk_1` (`expelledId`);

--
-- Indexes for table `apartment`
--
ALTER TABLE `apartment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `buildingId` (`buildingId`);

--
-- Indexes for table `building`
--
ALTER TABLE `building`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contactinfo`
--
ALTER TABLE `contactinfo`
  ADD PRIMARY KEY (`contactId`),
  ADD KEY `memberId` (`memberId`);

--
-- Indexes for table `expelledstudent`
--
ALTER TABLE `expelledstudent`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `facultyinfo`
--
ALTER TABLE `facultyinfo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `memberId` (`memberId`);

--
-- Indexes for table `field`
--
ALTER TABLE `field`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `fieldcriteria`
--
ALTER TABLE `fieldcriteria`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fieldId` (`fieldId`);

--
-- Indexes for table `insurance`
--
ALTER TABLE `insurance`
  ADD PRIMARY KEY (`insuranceId`),
  ADD KEY `memberId` (`memberId`);

--
-- Indexes for table `logininfo`
--
ALTER TABLE `logininfo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `memberId` (`memberId`);

--
-- Indexes for table `maintenance`
--
ALTER TABLE `maintenance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_roomId` (`roomId`);

--
-- Indexes for table `member`
--
ALTER TABLE `member`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `note`
--
ALTER TABLE `note`
  ADD PRIMARY KEY (`noteId`),
  ADD KEY `note_ibfk_1` (`alertId`);

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
  ADD PRIMARY KEY (`id`),
  ADD KEY `memberId` (`memberId`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `memberId` (`memberId`);

--
-- Indexes for table `reservation`
--
ALTER TABLE `reservation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `residentId` (`residentId`),
  ADD KEY `roomId` (`roomId`);

--
-- Indexes for table `resident`
--
ALTER TABLE `resident`
  ADD PRIMARY KEY (`id`),
  ADD KEY `memberId` (`memberId`);

--
-- Indexes for table `room`
--
ALTER TABLE `room`
  ADD PRIMARY KEY (`id`),
  ADD KEY `apartmentId` (`apartmentId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addressinfo`
--
ALTER TABLE `addressinfo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `admincredentials`
--
ALTER TABLE `admincredentials`
  MODIFY `credentialId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `administrators`
--
ALTER TABLE `administrators`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `alert`
--
ALTER TABLE `alert`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `apartment`
--
ALTER TABLE `apartment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `building`
--
ALTER TABLE `building`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `contactinfo`
--
ALTER TABLE `contactinfo`
  MODIFY `contactId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `expelledstudent`
--
ALTER TABLE `expelledstudent`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `facultyinfo`
--
ALTER TABLE `facultyinfo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `field`
--
ALTER TABLE `field`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `fieldcriteria`
--
ALTER TABLE `fieldcriteria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `insurance`
--
ALTER TABLE `insurance`
  MODIFY `insuranceId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `logininfo`
--
ALTER TABLE `logininfo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `maintenance`
--
ALTER TABLE `maintenance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `member`
--
ALTER TABLE `member`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `note`
--
ALTER TABLE `note`
  MODIFY `noteId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `parentalinfo`
--
ALTER TABLE `parentalinfo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `reservation`
--
ALTER TABLE `reservation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `resident`
--
ALTER TABLE `resident`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `room`
--
ALTER TABLE `room`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `addressinfo`
--
ALTER TABLE `addressinfo`
  ADD CONSTRAINT `addressinfo_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `member` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `admincredentials`
--
ALTER TABLE `admincredentials`
  ADD CONSTRAINT `admincredentials_ibfk_1` FOREIGN KEY (`adminId`) REFERENCES `administrators` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `alert`
--
ALTER TABLE `alert`
  ADD CONSTRAINT `alert_ibfk_1` FOREIGN KEY (`expelledId`) REFERENCES `expelledstudent` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `apartment`
--
ALTER TABLE `apartment`
  ADD CONSTRAINT `apartment_ibfk_1` FOREIGN KEY (`buildingId`) REFERENCES `building` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `contactinfo`
--
ALTER TABLE `contactinfo`
  ADD CONSTRAINT `contactinfo_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `member` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `facultyinfo`
--
ALTER TABLE `facultyinfo`
  ADD CONSTRAINT `facultyinfo_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `member` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `fieldcriteria`
--
ALTER TABLE `fieldcriteria`
  ADD CONSTRAINT `fieldcriteria_ibfk_1` FOREIGN KEY (`fieldId`) REFERENCES `field` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `insurance`
--
ALTER TABLE `insurance`
  ADD CONSTRAINT `insurance_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `member` (`id`);

--
-- Constraints for table `logininfo`
--
ALTER TABLE `logininfo`
  ADD CONSTRAINT `logininfo_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `member` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `maintenance`
--
ALTER TABLE `maintenance`
  ADD CONSTRAINT `FK_roomId` FOREIGN KEY (`roomId`) REFERENCES `room` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `note`
--
ALTER TABLE `note`
  ADD CONSTRAINT `note_ibfk_1` FOREIGN KEY (`alertId`) REFERENCES `alert` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `notification`
--
ALTER TABLE `notification`
  ADD CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`senderId`) REFERENCES `member` (`id`),
  ADD CONSTRAINT `notification_ibfk_2` FOREIGN KEY (`receiverId`) REFERENCES `member` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `parentalinfo`
--
ALTER TABLE `parentalinfo`
  ADD CONSTRAINT `parentalinfo_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `member` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `member` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reservation`
--
ALTER TABLE `reservation`
  ADD CONSTRAINT `reservation_ibfk_1` FOREIGN KEY (`residentId`) REFERENCES `resident` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reservation_ibfk_2` FOREIGN KEY (`roomId`) REFERENCES `room` (`id`);

--
-- Constraints for table `resident`
--
ALTER TABLE `resident`
  ADD CONSTRAINT `resident_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `member` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `room`
--
ALTER TABLE `room`
  ADD CONSTRAINT `room_ibfk_1` FOREIGN KEY (`apartmentId`) REFERENCES `apartment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

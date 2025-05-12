-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: garbageguard
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `audit_results`
--

DROP TABLE IF EXISTS `audit_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_results` (
  `result_id` int NOT NULL AUTO_INCREMENT,
  `session_id` int NOT NULL,
  `item_type` enum('ISO','LAW') COLLATE utf8mb4_unicode_ci NOT NULL,
  `item_index` tinyint NOT NULL,
  `is_pass` tinyint(1) NOT NULL,
  `comment` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `checked_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`result_id`),
  KEY `audit_results_ibfk_1` (`session_id`),
  CONSTRAINT `audit_results_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `audit_sessions` (`session_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1346 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_results`
--

LOCK TABLES `audit_results` WRITE;
/*!40000 ALTER TABLE `audit_results` DISABLE KEYS */;
/*!40000 ALTER TABLE `audit_results` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_sessions`
--

DROP TABLE IF EXISTS `audit_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_sessions` (
  `session_id` int NOT NULL AUTO_INCREMENT,
  `site_id` int NOT NULL,
  `company_id` int NOT NULL,
  `performed_by` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `performed_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`session_id`),
  KEY `company_id` (`company_id`),
  KEY `audit_sessions_ibfk_1` (`site_id`),
  CONSTRAINT `audit_sessions_ibfk_1` FOREIGN KEY (`site_id`) REFERENCES `construction_sites` (`site_id`) ON DELETE CASCADE,
  CONSTRAINT `audit_sessions_ibfk_2` FOREIGN KEY (`company_id`) REFERENCES `companies` (`company_id`)
) ENGINE=InnoDB AUTO_INCREMENT=106 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_sessions`
--

LOCK TABLES `audit_sessions` WRITE;
/*!40000 ALTER TABLE `audit_sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `audit_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `companies`
--

DROP TABLE IF EXISTS `companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `companies` (
  `company_id` int NOT NULL AUTO_INCREMENT,
  `company_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ceo_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`company_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companies`
--

LOCK TABLES `companies` WRITE;
/*!40000 ALTER TABLE `companies` DISABLE KEYS */;
/*!40000 ALTER TABLE `companies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company_emissions`
--

DROP TABLE IF EXISTS `company_emissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company_emissions` (
  `emission_id` int NOT NULL AUTO_INCREMENT,
  `company_id` int NOT NULL,
  `total_carbon_emission` decimal(10,2) DEFAULT NULL,
  `recorded_month` varchar(7) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`emission_id`),
  KEY `company_id` (`company_id`),
  CONSTRAINT `company_emissions_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`company_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_emissions`
--

LOCK TABLES `company_emissions` WRITE;
/*!40000 ALTER TABLE `company_emissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `company_emissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `construction_sites`
--

DROP TABLE IF EXISTS `construction_sites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `construction_sites` (
  `site_id` int NOT NULL AUTO_INCREMENT,
  `site_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `manager_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `company_id` int DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `department` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `importance_level` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contractor_notes` text COLLATE utf8mb4_unicode_ci,
  `calibration_date` date DEFAULT NULL,
  `survey_file_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `procedure_file_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `standard_file_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `monitoring_data_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `calibration_file_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`site_id`),
  KEY `construction_sites_ibfk_1` (`company_id`),
  CONSTRAINT `construction_sites_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`company_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `construction_sites`
--

LOCK TABLES `construction_sites` WRITE;
/*!40000 ALTER TABLE `construction_sites` DISABLE KEYS */;
/*!40000 ALTER TABLE `construction_sites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `dept_id` int NOT NULL AUTO_INCREMENT,
  `dept_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`dept_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materials`
--

DROP TABLE IF EXISTS `materials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materials` (
  `material_id` int NOT NULL AUTO_INCREMENT,
  `material_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unit` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`material_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materials`
--

LOCK TABLES `materials` WRITE;
/*!40000 ALTER TABLE `materials` DISABLE KEYS */;
/*!40000 ALTER TABLE `materials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `monthly_waste_report`
--

DROP TABLE IF EXISTS `monthly_waste_report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `monthly_waste_report` (
  `report_id` int NOT NULL AUTO_INCREMENT,
  `report_month` varchar(7) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `waste_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`report_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `monthly_waste_report`
--

LOCK TABLES `monthly_waste_report` WRITE;
/*!40000 ALTER TABLE `monthly_waste_report` DISABLE KEYS */;
/*!40000 ALTER TABLE `monthly_waste_report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site_materials_usage`
--

DROP TABLE IF EXISTS `site_materials_usage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `site_materials_usage` (
  `usage_id` int NOT NULL AUTO_INCREMENT,
  `site_id` int DEFAULT NULL,
  `material_id` int DEFAULT NULL,
  `used_quantity` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`usage_id`),
  KEY `material_id` (`material_id`),
  KEY `site_materials_usage_ibfk_1` (`site_id`),
  CONSTRAINT `site_materials_usage_ibfk_1` FOREIGN KEY (`site_id`) REFERENCES `construction_sites` (`site_id`) ON DELETE CASCADE,
  CONSTRAINT `site_materials_usage_ibfk_2` FOREIGN KEY (`material_id`) REFERENCES `materials` (`material_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_materials_usage`
--

LOCK TABLES `site_materials_usage` WRITE;
/*!40000 ALTER TABLE `site_materials_usage` DISABLE KEYS */;
/*!40000 ALTER TABLE `site_materials_usage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site_waste_summary`
--

DROP TABLE IF EXISTS `site_waste_summary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `site_waste_summary` (
  `summary_id` int NOT NULL AUTO_INCREMENT,
  `site_id` int DEFAULT NULL,
  `waste_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`summary_id`),
  KEY `site_waste_summary_ibfk_1` (`site_id`),
  CONSTRAINT `site_waste_summary_ibfk_1` FOREIGN KEY (`site_id`) REFERENCES `construction_sites` (`site_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_waste_summary`
--

LOCK TABLES `site_waste_summary` WRITE;
/*!40000 ALTER TABLE `site_waste_summary` DISABLE KEYS */;
/*!40000 ALTER TABLE `site_waste_summary` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `waste_management`
--

DROP TABLE IF EXISTS `waste_management`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `waste_management` (
  `waste_id` int NOT NULL AUTO_INCREMENT,
  `site_id` int DEFAULT NULL,
  `waste_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `waste_amount` decimal(10,2) DEFAULT NULL,
  `carbon_emission` decimal(10,2) DEFAULT NULL,
  `recycled` tinyint(1) DEFAULT NULL,
  `disposal_date` date DEFAULT NULL,
  `waste_category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `waste_code` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `recyclable` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`waste_id`),
  KEY `waste_management_ibfk_1` (`site_id`),
  CONSTRAINT `waste_management_ibfk_1` FOREIGN KEY (`site_id`) REFERENCES `construction_sites` (`site_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `waste_management`
--

LOCK TABLES `waste_management` WRITE;
/*!40000 ALTER TABLE `waste_management` DISABLE KEYS */;
/*!40000 ALTER TABLE `waste_management` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `waste_objects`
--

DROP TABLE IF EXISTS `waste_objects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `waste_objects` (
  `object_id` int NOT NULL AUTO_INCREMENT,
  `object_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`object_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `waste_objects`
--

LOCK TABLES `waste_objects` WRITE;
/*!40000 ALTER TABLE `waste_objects` DISABLE KEYS */;
INSERT INTO `waste_objects` VALUES (1,'폐콘크리트'),(2,'플라스틱'),(3,'general_w'),(4,'brick'),(5,'pipes'),(6,'plastic'),(7,'undefined'),(8,'잡자재'),(9,'벽돌'),(10,'파이프'),(11,'타일'),(12,'콘크리트'),(13,'스티로폼'),(14,'목재');
/*!40000 ALTER TABLE `waste_objects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `waste_photo_objects`
--

DROP TABLE IF EXISTS `waste_photo_objects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `waste_photo_objects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `photo_id` int DEFAULT NULL,
  `object_id` int DEFAULT NULL,
  `count` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `photo_id` (`photo_id`),
  KEY `object_id` (`object_id`),
  CONSTRAINT `waste_photo_objects_ibfk_1` FOREIGN KEY (`photo_id`) REFERENCES `waste_photos` (`photo_id`),
  CONSTRAINT `waste_photo_objects_ibfk_2` FOREIGN KEY (`object_id`) REFERENCES `waste_objects` (`object_id`)
) ENGINE=InnoDB AUTO_INCREMENT=136 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `waste_photo_objects`
--

LOCK TABLES `waste_photo_objects` WRITE;
/*!40000 ALTER TABLE `waste_photo_objects` DISABLE KEYS */;
INSERT INTO `waste_photo_objects` VALUES (72,NULL,9,10),(73,NULL,14,2),(74,NULL,11,1),(75,NULL,8,31),(76,NULL,9,16),(77,NULL,2,5),(78,NULL,10,2),(79,NULL,11,2),(80,NULL,12,1),(81,NULL,13,1),(82,NULL,9,10),(83,NULL,14,2),(84,NULL,11,1),(85,NULL,8,31),(86,NULL,9,16),(87,NULL,2,5),(88,NULL,10,2),(89,NULL,11,2),(90,NULL,12,1),(91,NULL,13,1),(92,NULL,10,2),(93,NULL,2,5),(94,NULL,9,10),(95,NULL,14,2),(96,NULL,11,1),(97,NULL,9,10),(98,NULL,14,2),(99,NULL,11,1),(100,NULL,2,15),(101,NULL,10,3),(102,NULL,2,15),(103,NULL,10,3),(104,NULL,9,10),(105,NULL,14,2),(106,NULL,11,1),(107,NULL,2,15),(108,NULL,10,3),(109,NULL,2,15),(110,NULL,10,3),(111,NULL,8,31),(112,NULL,9,16),(113,NULL,2,5),(114,NULL,10,2),(115,NULL,11,2),(116,NULL,12,1),(117,NULL,13,1),(118,NULL,9,10),(119,NULL,14,2),(120,NULL,11,1),(121,NULL,9,10),(122,NULL,14,2),(123,NULL,11,1),(124,NULL,8,31),(125,NULL,9,16),(126,NULL,2,5),(127,NULL,10,2),(128,NULL,11,2),(129,NULL,12,1),(130,NULL,13,1),(131,NULL,9,10),(132,NULL,14,2),(133,NULL,11,1),(134,NULL,2,15),(135,NULL,10,3);
/*!40000 ALTER TABLE `waste_photo_objects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `waste_photos`
--

DROP TABLE IF EXISTS `waste_photos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `waste_photos` (
  `photo_id` int NOT NULL AUTO_INCREMENT,
  `site_id` int DEFAULT NULL,
  `object_id` int DEFAULT NULL,
  `uploaded_at` datetime DEFAULT NULL,
  `image_filename` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `detection_summary` text COLLATE utf8mb4_unicode_ci,
  `is_analyzed` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`photo_id`),
  KEY `object_id` (`object_id`),
  KEY `idx_uploaded_at` (`uploaded_at`),
  KEY `waste_photos_ibfk_1` (`site_id`),
  CONSTRAINT `waste_photos_ibfk_1` FOREIGN KEY (`site_id`) REFERENCES `construction_sites` (`site_id`) ON DELETE CASCADE,
  CONSTRAINT `waste_photos_ibfk_2` FOREIGN KEY (`object_id`) REFERENCES `waste_objects` (`object_id`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `waste_photos`
--

LOCK TABLES `waste_photos` WRITE;
/*!40000 ALTER TABLE `waste_photos` DISABLE KEYS */;
/*!40000 ALTER TABLE `waste_photos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-12 15:46:28

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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companies`
--

LOCK TABLES `companies` WRITE;
/*!40000 ALTER TABLE `companies` DISABLE KEYS */;
INSERT INTO `companies` VALUES (13,'테스트회사1','테스트동','김테스트','테스트테론'),(14,'테스트회사2','둔산동','이테스트','123123123');
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
  PRIMARY KEY (`site_id`),
  KEY `construction_sites_ibfk_1` (`company_id`),
  CONSTRAINT `construction_sites_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`company_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `construction_sites`
--

LOCK TABLES `construction_sites` WRITE;
/*!40000 ALTER TABLE `construction_sites` DISABLE KEYS */;
INSERT INTO `construction_sites` VALUES (23,'쿠키앤크리무','대전 서구 둔산동 1205','스키짱',13,36.34980136748117,127.38157825805702),(24,'집지음','대전 서구 둔산동 1249','김집',14,36.34722978139802,127.38259058133545);
/*!40000 ALTER TABLE `construction_sites` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `waste_management`
--

LOCK TABLES `waste_management` WRITE;
/*!40000 ALTER TABLE `waste_management` DISABLE KEYS */;
INSERT INTO `waste_management` VALUES (27,23,'잡자재',31.00,3764.70,NULL,'2025-07-03','혼합건설폐기물','17-09-04',0),(28,23,'벽돌',10.00,345.00,NULL,'2025-08-13','폐벽돌','17-01-02',1),(29,24,'잡자재',31.00,3764.70,NULL,'2025-05-08','혼합건설폐기물','17-09-04',0);
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
) ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `waste_photo_objects`
--

LOCK TABLES `waste_photo_objects` WRITE;
/*!40000 ALTER TABLE `waste_photo_objects` DISABLE KEYS */;
INSERT INTO `waste_photo_objects` VALUES (72,NULL,9,10),(73,NULL,14,2),(74,NULL,11,1),(75,NULL,8,31),(76,NULL,9,16),(77,NULL,2,5),(78,NULL,10,2),(79,NULL,11,2),(80,NULL,12,1),(81,NULL,13,1),(82,NULL,9,10),(83,NULL,14,2),(84,NULL,11,1),(85,NULL,8,31),(86,NULL,9,16),(87,NULL,2,5),(88,NULL,10,2),(89,NULL,11,2),(90,NULL,12,1),(91,NULL,13,1);
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
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `waste_photos`
--

LOCK TABLES `waste_photos` WRITE;
/*!40000 ALTER TABLE `waste_photos` DISABLE KEYS */;
INSERT INTO `waste_photos` VALUES (47,23,8,'2025-05-08 00:00:00','쿠키앤크리무_2025-05-08.jpg','잡자재 31개, 벽돌 16개, 플라스틱 5개, 파이프 2개, 타일 2개, 콘크리트 1개, 스티로폼 1개',1),(48,23,9,'2025-06-19 00:00:00','쿠키앤크리무_2025-06-19.jpg','벽돌 10개, 목재 2개, 타일 1개',1),(49,23,8,'2025-07-03 00:00:00','쿠키앤크리무_2025-07-03.jpg','잡자재 31개, 벽돌 16개, 플라스틱 5개, 파이프 2개, 타일 2개, 콘크리트 1개, 스티로폼 1개',1),(50,23,9,'2025-08-13 00:00:00','쿠키앤크리무_2025-08-13.jpg','벽돌 10개, 목재 2개, 타일 1개',1),(51,24,8,'2025-05-08 00:00:00','집지음_2025-05-08.jpg','잡자재 31개, 벽돌 16개, 플라스틱 5개, 파이프 2개, 타일 2개, 콘크리트 1개, 스티로폼 1개',1);
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

-- Dump completed on 2025-05-08 16:04:56

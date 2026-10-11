-- ==============================================================================
-- UrjaDrishti AI — Local MySQL Database Schema
-- Database Name: urjadrishti_ai
-- Target Environment: Local MySQL Server (MySQL 8.0+) via MySQL Workbench
-- ==============================================================================

-- 1. Create Database if not exists
CREATE DATABASE IF NOT EXISTS urjadrishti_ai
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE urjadrishti_ai;

-- 2. Table: consumption_logs
-- Stores logged/simulated household power consumption readings
CREATE TABLE IF NOT EXISTS consumption_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    timestamp DATETIME NOT NULL,
    household_id VARCHAR(64) NOT NULL DEFAULT 'HH_01',
    load_kwh DECIMAL(10, 4) NOT NULL,
    temperature DECIMAL(6, 2) NULL,
    is_anomaly TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_consumption_ts (timestamp),
    INDEX idx_consumption_household (household_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Table: prediction_history
-- Stores machine learning inference logs and forecast runs
CREATE TABLE IF NOT EXISTS prediction_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    created_at DATETIME NOT NULL,
    model_id VARCHAR(64) NOT NULL,
    horizon_hours INT NOT NULL DEFAULT 24,
    predicted_load_kw DECIMAL(10, 4) NOT NULL,
    confidence_lower DECIMAL(10, 4) NULL,
    confidence_upper DECIMAL(10, 4) NULL,
    input_features LONGTEXT NULL,
    INDEX idx_prediction_model (model_id),
    INDEX idx_prediction_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Table: billing_history
-- Stores simulated electricity bills computed via Mumbai DISCOM tariff engine
CREATE TABLE IF NOT EXISTS billing_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    created_at DATETIME NOT NULL,
    provider VARCHAR(64) NOT NULL,
    units DECIMAL(10, 2) NOT NULL,
    tariff_fy VARCHAR(32) NOT NULL DEFAULT 'FY 2022-23',
    total_bill DECIMAL(10, 2) NULL,
    calculation_status VARCHAR(64) NULL,
    breakdown_json LONGTEXT NULL,
    INDEX idx_billing_provider (provider),
    INDEX idx_billing_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Table: anomaly_events
-- Stores detected grid & household anomaly events from Isolation Forest & rules
CREATE TABLE IF NOT EXISTS anomaly_events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    timestamp DATETIME NOT NULL,
    household_id VARCHAR(64) NOT NULL DEFAULT 'HH_01',
    actual_kwh DECIMAL(10, 4) NOT NULL,
    expected_kwh DECIMAL(10, 4) NULL,
    severity VARCHAR(32) NOT NULL,
    score DECIMAL(8, 4) NULL,
    detector VARCHAR(64) NOT NULL,
    is_ground_truth TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_anomaly_severity (severity),
    INDEX idx_anomaly_ts (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- phpMyAdmin SQL Dump
-- version 3.5.1
-- http://www.phpmyadmin.net
--
-- 主机: localhost
-- 生成日期: 2012 年 08 月 09 日 14:25
-- 服务器版本: 5.0.45-community-nt-log
-- PHP 版本: 5.2.3

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- 数据库: `favorit`
--

-- --------------------------------------------------------

--
-- 表的结构 `folder`
--

CREATE TABLE IF NOT EXISTS `folder` (
  `folder_id` int(11) NOT NULL auto_increment,
  `folder_name` varchar(20) NOT NULL,
  `parent_folder_id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  UNIQUE KEY `folder_id` (`folder_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

-- --------------------------------------------------------

--
-- 表的结构 `url`
--

CREATE TABLE IF NOT EXISTS `url` (
  `id` int(11) NOT NULL auto_increment,
  `folder_id` varchar(10) NOT NULL,
  `name` varchar(20) NOT NULL,
  `url` varchar(200) NOT NULL,
  `userid` char(3) NOT NULL,
  KEY `id` (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=18 ;

-- --------------------------------------------------------

--
-- 表的结构 `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `userid` int(11) NOT NULL auto_increment,
  `username` varchar(10) NOT NULL,
  `pass` varchar(10) NOT NULL,
  KEY `userid` (`userid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

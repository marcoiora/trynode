-- phpMyAdmin SQL Dump
-- version 3.3.9
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Sep 06, 2011 at 02:36 PM
-- Server version: 5.5.8
-- PHP Version: 5.3.5

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `mymovies`
--

-- --------------------------------------------------------

--
-- Table structure for table `cast`
--

CREATE TABLE IF NOT EXISTS `cast` (
  `ID_attore` int(11) NOT NULL,
  `ID_film` int(11) NOT NULL,
  `ruolo` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `cast`
--

INSERT INTO `cast` (`ID_attore`, `ID_film`, `ruolo`) VALUES
(1, 1, 'Logan/Wolverine'),
(2, 1, 'Victor Creed'),
(3, 1, 'Stryker'),
(4, 1, 'Kayla Silverfox'),
(5, 1, 'Fred Dukes'),
(6, 1, 'Agent Zero'),
(1, 2, 'Robert Angier'),
(8, 2, 'Alfred Borden'),
(9, 2, 'Cutter'),
(10, 2, 'Julia McCullough'),
(11, 2, 'Sarah Borden'),
(12, 2, 'Olivia Wenscombe'),
(14, 3, 'Dom Cobb'),
(15, 3, 'Arthur'),
(16, 3, 'Ariadne'),
(17, 3, 'Eames');

-- --------------------------------------------------------

--
-- Table structure for table `film`
--

CREATE TABLE IF NOT EXISTS `film` (
  `Film_ID` int(11) NOT NULL,
  `Titolo` varchar(250) NOT NULL,
  `Anno` int(11) NOT NULL,
  `Trama` text NOT NULL,
  `Locandina` varchar(250) NOT NULL,
  PRIMARY KEY (`Film_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `film`
--

INSERT INTO `film` (`Film_ID`, `Titolo`, `Anno`, `Trama`, `Locandina`) VALUES
(1, 'X-Men le origini - Wolverine', 2009, 'Sulle montagne rocciose canadesi, Logan cerca la pace dopo un secolo di guerre e violenza. Silverfox lo ama e lo incoraggia a dar retta alla propria natura umana e a tenere a bada la forza sovrumana e mutante che è in lui, ma il brutale assassinio della donna che ama da parte del fratello Victor, riporta inevitabilmente Logan nelle mani di Stryker, che vuole fare di lui l''Arma X, una macchina da guerra indistruttibile. Nel corso di un''operazione d''indicibile sofferenza, lo scheletro di Wolverine viene rivestito di adamantio e ne esce un essere invulnerabile, il più micidiale degli esperimenti di laboratorio che Stryker sta operando sui mutanti: un cuore di dolore dentro un''impalcatura di rabbia, in attesa di rivolgere la propria furia contro il giusto nemico.', 'wolverine-poster2009.jpg'),
(2, 'The Prestige', 2006, 'Due giovani maghi apprendisti, Robert Angier e Alfred Borden, vengono istruiti e seguiti da Cutter, un ingegnere illusionista ed ex mago, ma durante un numero in cui la moglie di Robert viene legata e messa in una cassa di vetro piena d''acqua, qualcosa va storto e la donna muore. Angier incolperà l''amico dell''accaduto, tentando di vendicarsi. Inizia così un crudele gioco tra i due uomini su chi sia il migliore e la rivalità si trasformerà pian piano in ossessione.', 'prestige-poster2006.jpg'),
(3, 'Inception', 2010, 'Dom Cobb possiede una qualifica speciale: è in grado di inserirsi nei sogni altrui per prelevare i segreti nascosti nel più profondo del subconscio. Viene contattato da Saito, un potentissimo industriale di origine giapponese, il quale gli chiede di tentare l''operazione opposta. Non deve prelevare pensieri celati ma inserire un''idea che si radichi nella mente di una persona. Costui è Robert Fischer Jr. il quale, alla morte dell''anziano e dittatoriale genitore, dovrà convincersi che l''unica cosa che può fare è distruggere l''impero ereditato. Saito avrà allora campo libero. In cambio offrirà a Cobb la possibilità di rientrare negli Stati Uniti dove è ricercato per omicidio. Cobb accetta e si fa affiancare da un team di cui entra a far parte la giovane Ariane, architetto abilissimo nella costruzione di spazi virtuali.', 'inception-poster2010.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `personale`
--

CREATE TABLE IF NOT EXISTS `personale` (
  `ID_personale` int(11) NOT NULL,
  `Nome` varchar(250) NOT NULL,
  `Cognome` varchar(250) NOT NULL,
  `VIP` tinyint(1) NOT NULL,
  PRIMARY KEY (`ID_personale`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `personale`
--

INSERT INTO `personale` (`ID_personale`, `Nome`, `Cognome`, `VIP`) VALUES
(1, 'Hugh', 'Jackman', 1),
(2, 'Liev', 'Schreiber', 1),
(3, 'Danny', 'Huston', 0),
(4, 'Lynn', 'Collins', 0),
(5, 'Kevin', 'Durand', 0),
(6, 'Daniel', 'Henney', 0),
(7, 'Gavin', 'Hood', 0),
(8, 'Christian', 'Bale', 1),
(9, 'Michael', 'Caine', 1),
(10, 'Piper', 'Perabo', 0),
(11, 'Rebecca', 'Hall', 0),
(12, 'Scarlett', 'Johansson', 1),
(13, 'Christopher', 'Nolan', 0),
(14, 'Leonardo', 'DiCaprio', 1),
(15, 'Joseph', 'Gordon-Levitt', 1),
(16, 'Ellen', 'Page', 1),
(17, 'Tom', 'Hardy', 0);

-- --------------------------------------------------------

--
-- Table structure for table `regista`
--

CREATE TABLE IF NOT EXISTS `regista` (
  `ID_regista` int(11) NOT NULL,
  `ID_film` int(11) NOT NULL,
  PRIMARY KEY (`ID_regista`,`ID_film`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `regista`
--

INSERT INTO `regista` (`ID_regista`, `ID_film`) VALUES
(7, 1),
(13, 2),
(13, 3);

-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 22, 2025 at 03:54 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `watchlist_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `collection`
--

CREATE TABLE `collection` (
  `id` bigint(20) NOT NULL,
  `created_date` bigint(20) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `page_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `collection_movies`
--

CREATE TABLE `collection_movies` (
  `collection_id` bigint(20) NOT NULL,
  `movie_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `movie`
--

CREATE TABLE `movie` (
  `id` bigint(20) NOT NULL,
  `description` text DEFAULT NULL,
  `imdb_id` varchar(255) DEFAULT NULL,
  `imdb_rating` double NOT NULL,
  `poster_path` varchar(255) DEFAULT NULL,
  `rt_rating` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `tmdb_id` int(11) DEFAULT NULL,
  `year` int(11) NOT NULL,
  `page_id` bigint(20) NOT NULL,
  `trailer_path` varchar(255) DEFAULT NULL,
  `ambient_color` varchar(255) DEFAULT NULL,
  `added_date` bigint(20) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `watch_date` bigint(20) DEFAULT NULL,
  `watched` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `movie`
--

INSERT INTO `movie` (`id`, `description`, `imdb_id`, `imdb_rating`, `poster_path`, `rt_rating`, `title`, `tmdb_id`, `year`, `page_id`, `trailer_path`, `ambient_color`, `added_date`, `rating`, `watch_date`, `watched`) VALUES
(3, 'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. Their concept catches on, with underground \"fight clubs\" forming in every town, until an eccentric gets in the way and ignites an out-of-control spiral toward oblivion.', 'tt0137523', 8.8, 'https://image.tmdb.org/t/p/w500//pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', '81%', 'Fight Club', 550, 1999, 2, NULL, NULL, NULL, NULL, NULL, b'0'),
(4, 'A burger-loving hit man, his philosophical partner, a drug-addled gangster\'s moll and a washed-up boxer converge in this sprawling, comedic crime caper. Their adventures unfurl in three stories that ingeniously trip back and forth in time.', 'tt0110912', 8.8, 'https://image.tmdb.org/t/p/w500//vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg', '92%', 'Pulp Fiction', 680, 1994, 2, NULL, NULL, NULL, NULL, NULL, b'0'),
(287, 'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. Their concept catches on, with underground \"fight clubs\" forming in every town, until an eccentric gets in the way and ignites an out-of-control spiral toward oblivion.', 'tt0137523', 8.8, 'https://image.tmdb.org/t/p/w500//jSziioSwPVrOy9Yow3XhWIBDjq1.jpg', '81%', 'Fight Club', 550, 1999, 1, 'dfeUzm6KF4g', '234,170,104', 1755008157292, 2, 1728172800000, b'1'),
(288, 'Jack Torrance accepts a caretaker job at the Overlook Hotel, where he, along with his wife Wendy and their son Danny, must live isolated from the rest of the world for the winter. But they aren\'t prepared for the madness that lurks within.', 'tt0081505', 8.4, 'https://image.tmdb.org/t/p/w500//xazWoLealQwEgqZ89MLZklLZD3k.jpg', '84%', 'The Shining', 694, 1980, 1, 'FZQvIJxG9Xs', '230,229,229', 1755008159224, -1, 1728259200000, b'1'),
(289, 'A burger-loving hit man, his philosophical partner, a drug-addled gangster\'s moll and a washed-up boxer converge in this sprawling, comedic crime caper. Their adventures unfurl in three stories that ingeniously trip back and forth in time.', 'tt0110912', 8.8, 'https://image.tmdb.org/t/p/w500//vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg', '92%', 'Pulp Fiction', 680, 1994, 1, 'tGpTpVyI_OQ', '222,121,57', 1755008161227, -1, 1728345600000, b'1'),
(290, 'Taking place after alien crafts land around the world, an expert linguist is recruited by the military to determine whether they come in peace or are a threat.', 'tt2543164', 7.9, 'https://image.tmdb.org/t/p/w500//x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg', '94%', 'Arrival', 329865, 2016, 1, '7W1m5ER3I1Y', '105,118,135', 1755008163244, -1, 1728432000000, b'1'),
(291, 'Joel Barish, heartbroken that his girlfriend underwent a procedure to erase him from her memory, decides to do the same. However, as he watches his memories of her fade away, he realises that he still loves her, and may be too late to correct his mistake.', 'tt0338013', 8.3, 'https://image.tmdb.org/t/p/w500//5MwkWH9tYHv3mV9OdYTMR5qreIz.jpg', '92%', 'Eternal Sunshine of the Spotless Mind', 38, 2004, 1, 'c2e-bj6qy8Y', '17,55,77', 1755008165225, -1, 1728518400000, b'1'),
(292, 'A man with a low IQ has accomplished great things in his life and been present during significant historic events—in each case, far exceeding what anyone imagined he could do. But despite all he has achieved, his one true love eludes him.', 'tt0109830', 8.8, 'https://image.tmdb.org/t/p/w500//arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', '75%', 'Forrest Gump', 13, 1994, 1, 'm-btyJIYLyI', '203,197,197', 1755008167231, -1, 1728518400000, b'1'),
(293, 'Held in an L.A. interrogation room, Verbal Kint attempts to convince the feds that a mythic crime lord, Keyser Soze, not only exists, but was also responsible for drawing him and his four partners into a multi-million dollar heist that ended with an explosion in San Pedro harbor – leaving few survivors. Verbal lures his interrogators with an incredible story of the crime lord\'s almost supernatural prowess.', 'tt0114814', 8.5, 'https://image.tmdb.org/t/p/w500//99X2SgyFunJFXGAYnDv3sb9pnUD.jpg', '87%', 'The Usual Suspects', 629, 1995, 1, 'jM3jrHGAsIE', '192,175,151', 1755008169224, -1, 1728864000000, b'1'),
(294, 'Dr. Steven Murphy is a renowned cardiovascular surgeon who presides over a spotless household with his wife and two children. Lurking at the margins of his idyllic suburban existence is Martin, a fatherless teen who insinuates himself into the doctor\'s life in gradually unsettling ways.', 'tt5715874', 7, 'https://image.tmdb.org/t/p/w500//e4DGlsc9g0h5AyoyvvAuIRnofN7.jpg', '79%', 'The Killing of a Sacred Deer', 399057, 2017, 1, 'O6a68PJ1FS4', '40,33,29', 1755008171223, -1, 1728864000000, b'1'),
(295, 'While on a trip to Paris with his fiancée\'s family, a nostalgic screenwriter finds himself mysteriously going back to the 1920s every day at midnight.', 'tt1605783', 7.6, 'https://image.tmdb.org/t/p/w500//4wBG5kbfagTQclETblPRRGihk0I.jpg', '93%', 'Midnight in Paris', 59436, 2011, 1, 'FAfR8omt-CY', '41,87,116', 1755008173223, -1, 1729036800000, b'1'),
(296, 'A teacher lives a lonely life, all the while struggling over his son’s custody. His life slowly gets better as he finds love and receives good news from his son, but his new luck is about to be brutally shattered by an innocent little lie.', 'tt2106476', 8.3, 'https://image.tmdb.org/t/p/w500//jkixsXzRh28q3PCqFoWcf7unghT.jpg', '92%', 'The Hunt', 103663, 2012, 1, 'BSVDnUgJVYY', '198,154,115', 1755008175222, -1, 1729987200000, b'1'),
(297, 'Two homicide detectives are on a desperate hunt for a serial killer whose crimes are based on the \"seven deadly sins\" in this dark and haunting film that takes viewers from the tortured remains of one victim to the next. The seasoned Det. Somerset researches each sin in an effort to get inside the killer\'s mind, while his novice partner, Mills, scoffs at his efforts to unravel the case.', 'tt0114369', 8.6, 'https://image.tmdb.org/t/p/w500//191nKfP0ehp3uIvWqgPbFmI4lv9.jpg', '84%', 'Se7en', 807, 1995, 1, 'KPOuJGkpblk', '27,27,26', 1755008177224, -1, 1730073600000, b'1'),
(298, 'Susan Morrow receives a book manuscript from her ex-husband – a man she left 20 years earlier – asking for her opinion of his writing. As she reads, she is drawn into the fictional life of Tony Hastings, a mathematics professor whose family vacation turns violent.', 'tt4550098', 7.4, 'https://image.tmdb.org/t/p/w500//mdLDgQBD0va09npSQX5Zgo2evXM.jpg', '74%', 'Nocturnal Animals', 340666, 2016, 1, 'SI45fDplBpw', '25,18,23', 1755008179221, -1, 1730505600000, b'1'),
(299, 'World War II soldier-turned-U.S. Marshal Teddy Daniels investigates the disappearance of a patient from a hospital for the criminally insane, but his efforts are compromised by troubling visions and a mysterious doctor.', 'tt1130884', 8.2, 'https://image.tmdb.org/t/p/w500//nrmXQ0zcZUL8jFLrakWc90IR8z9.jpg', '69%', 'Shutter Island', 11324, 2010, 1, 'qdPw9x9h5CY', '14,17,24', 1755008181225, -1, 1730592000000, b'1'),
(300, 'Imprisoned in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work for an amoral warden. During his long stretch in prison, Dufresne comes to be admired by the other inmates -- including an older prisoner named Red -- for his integrity and unquenchable sense of hope.', 'tt0111161', 9.3, 'https://image.tmdb.org/t/p/w500//9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg', '89%', 'The Shawshank Redemption', 278, 1994, 1, 'PLl99DlL6b4', '31,10,6', 1755008183250, -1, 1731801600000, b'1'),
(301, 'Following an unexpected tragedy, child psychologist Malcolm Crowe meets a nine year old boy named Cole Sear, who is hiding a dark secret.', 'tt0167404', 8.2, 'https://image.tmdb.org/t/p/w500//vOyfUXNFSnaTk7Vk5AjpsKTUWsu.jpg', '86%', 'The Sixth Sense', 745, 1999, 1, 'HXG4HTIlc1U', '190,122,64', 1755008185229, -1, 1732060800000, b'1'),
(302, 'With no clue how he came to be imprisoned, drugged and tortured for 15 years, a desperate man seeks revenge on his captors.', 'tt0364569', 8.3, 'https://image.tmdb.org/t/p/w500//pWDtjs568ZfOTMbURQBYuT4Qxka.jpg', '82%', 'Oldboy', 670, 2003, 1, 'tAaBkFChaRg', '32,24,36', 1755008187219, -1, 1733616000000, b'1'),
(303, 'After a shipwreck, an intelligent robot called Roz is stranded on an uninhabited island. To survive the harsh environment, Roz bonds with the island\'s animals and cares for an orphaned baby goose.', 'tt29623480', 8.2, 'https://image.tmdb.org/t/p/w500//wTnV3PCVW5O92JMrFvvrRcV39RU.jpg', '96%', 'The Wild Robot', 1184918, 2024, 1, 'VUCNBAmse04', '31,33,32', 1755008189224, -1, 1733616000000, b'1'),
(304, 'After getting a green card in exchange for assassinating a Cuban government official, Tony Montana stakes a claim on the drug trade in Miami. Viciously murdering anyone who stands in his way, Tony eventually becomes the biggest drug lord in the state, controlling nearly all the cocaine that comes through Miami. But increased pressure from the police, wars with Colombian drug cartels and his own drug-fueled paranoia serve to fuel the flames of his eventual downfall.', 'tt0086250', 8.3, 'https://image.tmdb.org/t/p/w500//iQ5ztdjvteGeboxtmRdXEChJOHh.jpg', '79%', 'Scarface', 111, 1983, 1, 'lZMIrD36MG8', '242,241,241', 1755008191224, -1, 1733788800000, b'1'),
(305, 'Teenager Riley\'s mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions! Joy, Sadness, Anger, Fear and Disgust, who’ve long been running a successful operation by all accounts, aren’t sure how to feel when Anxiety shows up. And it looks like she’s not alone.', 'tt22022452', 7.5, 'https://image.tmdb.org/t/p/w500//vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg', '90%', 'Inside Out 2', 1022789, 2024, 1, 'u69y5Ie519M', '218,143,128', 1755008193235, -1, 1734825600000, b'1'),
(306, 'Under the direction of a ruthless instructor, a talented young drummer begins to pursue perfection at any cost, even his humanity.', 'tt2582802', 8.5, 'https://image.tmdb.org/t/p/w500//7fn624j5lj3xTme2SgiLCeuedmO.jpg', '94%', 'Whiplash', 244786, 2014, 1, 'Q7kZy3T6vRM', '10,12,15', 1755008195339, -1, 1734998400000, b'1'),
(307, 'In honor of his birthday, San Francisco banker Nicholas Van Orton, a financial genius and a cold-hearted loner, receives an unusual present from his younger brother, Conrad: a gift certificate to play a unique kind of game. In nary a nanosecond, Nicholas finds himself consumed by a dangerous set of ever-changing rules, unable to distinguish where the charade ends and reality begins.', 'tt0119174', 7.7, 'https://image.tmdb.org/t/p/w500//4UOa079915QjiTA2u5hT2yKVgUu.jpg', '77%', 'The Game', 2649, 1997, 1, '9KXxG-KjfUc', '187,122,77', 1755008197228, -1, 1735084800000, b'1'),
(308, 'A supernatural tale set on death row in a Southern prison, where gentle giant John Coffey possesses the mysterious power to heal people\'s ailments. When the cell block\'s head guard, Paul Edgecomb, recognizes Coffey\'s miraculous gift, he tries desperately to help stave off the condemned man\'s execution.', 'tt0120689', 8.6, 'https://image.tmdb.org/t/p/w500//8VG8fDNiy50H4FedGwdSVUPoaJe.jpg', '79%', 'The Green Mile', 497, 1999, 1, 'Bg7epsq0OIQ', '43,41,26', 1755008199220, -1, 1735430400000, b'1'),
(309, 'In a near-future Britain, young Alexander DeLarge and his pals get their kicks beating and raping anyone they please. When not destroying the lives of others, Alex swoons to the music of Beethoven. The state, eager to crack down on juvenile crime, gives an incarcerated Alex the option to undergo an invasive procedure that\'ll rob him of all personal agency. In a time when conscience is a commodity, can Alex change his tune?', 'tt0066921', 8.2, 'https://image.tmdb.org/t/p/w500//4sHeTAp65WrSSuc05nRBKddhBxO.jpg', '86%', 'A Clockwork Orange', 185, 1971, 1, 'T54uZPI4Z8A', '247,246,244', 1755008201222, -1, 1735689600000, b'1'),
(310, 'A pragmatic U.S. Marine observes the dehumanizing effects the U.S.-Vietnam War has on his fellow recruits from their brutal boot camp training to the bloody street fighting in Hue.', 'tt0093058', 8.2, 'https://image.tmdb.org/t/p/w500//kMKyx1k8hWWscYFnPbnxxN4Eqo4.jpg', '90%', 'Full Metal Jacket', 600, 1987, 1, 'n2i917l5RFc', '212,201,156', 1755008203224, -1, 1735948800000, b'1'),
(311, 'Léon, the top hit man in New York, has earned a rep as an effective \"cleaner\". But when his next-door neighbors are wiped out by a loose-cannon DEA agent, he becomes the unwilling custodian of 12-year-old Mathilda. Before long, Mathilda\'s thoughts turn to revenge, and she considers following in Léon\'s footsteps.', 'tt0110413', 8.5, 'https://image.tmdb.org/t/p/w500//bxB2q91nKYp8JNzqE7t7TWBVupB.jpg', '75%', 'Léon: The Professional', 101, 1994, 1, 'DD-6bmOY__g', '23,12,11', 1755008205222, -1, 1736121600000, b'1'),
(312, 'An aspiring actor in Hollywood meets an enigmatic stranger by the name of Tommy Wiseau, the meeting leads the actor down a path nobody could have predicted; creating the worst movie ever made.', 'tt3521126', 7.3, 'https://image.tmdb.org/t/p/w500//2HuLGiyH0TPYxnCvYHAxc8K738o.jpg', '90%', 'The Disaster Artist', 371638, 2017, 1, 'sPSJYXi7BWA', '27,39,53', 1755008207228, -1, 1736553600000, b'1'),
(313, 'Driven by tragedy, billionaire Bruce Wayne dedicates his life to uncovering and defeating the corruption that plagues his home, Gotham City.  Unable to work within the system, he instead creates a new identity, a symbol of fear for the criminal underworld - The Batman.', 'tt0372784', 8.2, 'https://image.tmdb.org/t/p/w500//4MpN4kIEqUjW8OPtOQJXlTdHiJV.jpg', '85%', 'Batman Begins', 272, 2005, 1, 'lirBhHXvDSg', '194,122,73', 1755008209230, -1, 1737072000000, b'1'),
(314, 'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.', 'tt0468569', 9.1, 'https://image.tmdb.org/t/p/w500//qJ2tW6WMUDux911r6m7haRef0WH.jpg', '94%', 'The Dark Knight', 155, 2008, 1, '_PZpmTj1Q8Q', '17,35,53', 1755008211224, -1, 1737158400000, b'1'),
(315, 'Following the death of District Attorney Harvey Dent, Batman assumes responsibility for Dent\'s crimes to protect the late attorney\'s reputation and is subsequently hunted by the Gotham City Police Department. Eight years later, Batman encounters the mysterious Selina Kyle and the villainous Bane, a new terrorist leader who overwhelms Gotham\'s finest. The Dark Knight resurfaces to protect a city that has branded him an enemy.', 'tt1345836', 8.4, 'https://image.tmdb.org/t/p/w500//hr0L2aueqlP2BYUblTTjmtn0hw4.jpg', '87%', 'The Dark Knight Rises', 49026, 2012, 1, 'GAjBzu8ggi0', '25,14,13', 1755008213238, -1, 1737244800000, b'1'),
(316, 'At the height of the First World War, two young British soldiers must cross enemy territory and deliver a message that will stop a deadly attack on hundreds of soldiers.', 'tt8579674', 8.2, 'https://image.tmdb.org/t/p/w500//iZf0KyrE25z1sage4SYFLCCrMi9.jpg', '88%', '1917', 530915, 2019, 1, 'gZjQROMAh_s', '52,54,57', 1755008215226, -1, 1738368000000, b'1'),
(317, 'Two sisters move to the country with their father in order to be closer to their hospitalized mother, and discover the surrounding trees are inhabited by Totoros, magical spirits of the forest. When the youngest runs away from home, the older sister seeks help from the spirits to find her.', 'tt0096283', 8.1, 'https://image.tmdb.org/t/p/w500//rtGDOeG9LzoerkDGZF9dnVeLppL.jpg', '94%', 'My Neighbor Totoro', 8392, 1988, 1, '_nv94fL_IA8', '21,35,38', 1755008217220, -1, 1741046400000, b'1'),
(318, 'Clarice Starling is a top student at the FBI\'s training academy.  Jack Crawford wants Clarice to interview Dr. Hannibal Lecter, a brilliant psychiatrist who is also a violent psychopath, serving life behind bars for various acts of murder and cannibalism.  Crawford believes that Lecter may have insight into a case and that Starling, as an attractive young woman, may be just the bait to draw him out.', 'tt0102926', 8.6, 'https://image.tmdb.org/t/p/w500//uS9m8OBk1A8eM9I042bx8XXpqAq.jpg', '95%', 'The Silence of the Lambs', 274, 1991, 1, '1lFj08l4ujg', '199,198,202', 1755008219238, -1, 1743206400000, b'1'),
(319, 'A mentally unstable Vietnam War veteran works as a night-time taxi driver in New York City where the perceived decadence and sleaze feed his urge for violent action.', 'tt0075314', 8.2, 'https://image.tmdb.org/t/p/w500//ekstpH614fwDX8DUln1a2Opz0N8.jpg', '89%', 'Taxi Driver', 103, 1976, 1, 'zdqCqDSTVNI', '18,21,25', 1755008221222, -1, 1743379200000, b'1'),
(320, 'After narrowly escaping a bizarre accident, a troubled teenager is plagued by visions of a large bunny rabbit that manipulates him to commit a series of crimes.', 'tt0246578', 8, 'https://image.tmdb.org/t/p/w500//fhQoQfejY1hUcwyuLgpBrYs6uFt.jpg', '88%', 'Donnie Darko', 141, 2001, 1, '71RaE7JYTUU', '5,9,12', 1755008223224, -1, 1745625600000, b'1'),
(321, 'A solitary cat, displaced by a great flood, finds refuge on a boat with various species and must navigate the challenges of adapting to a transformed world together.', 'tt4772188', 7.9, 'https://image.tmdb.org/t/p/w500//imKSymKBK7o73sajciEmndJoVkR.jpg', '97%', 'Flow', 823219, 2024, 1, 'shsVQvHUTxw', '191,233,240', 1755008225220, -1, 1746057600000, b'1'),
(322, 'Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: \"inception\", the implantation of another person\'s idea into a target\'s subconscious.', 'tt1375666', 8.8, 'https://image.tmdb.org/t/p/w500//ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg', '87%', 'Inception', 27205, 2010, 1, 'cdx31ak4KbQ', '8,22,33', 1755008227241, -1, 1747008000000, b'1'),
(323, 'The story of the miraculous evacuation of Allied soldiers from Belgium, Britain, Canada and France, who were cut off and surrounded by the German army from the beaches and harbour of Dunkirk between May 26th and June 4th 1940 during World War II.', 'tt5013056', 7.8, 'https://image.tmdb.org/t/p/w500//b4Oe15CGLL61Ped0RAS9JpqdmCt.jpg', '92%', 'Dunkirk', 374720, 2017, 1, 'T7O7BtBnsG4', '135,173,195', 1755008229226, -1, 1747267200000, b'1'),
(324, 'Armed with only one word - Tenet - and fighting for the survival of the entire world, the Protagonist journeys through a twilight world of international espionage on a mission that will unfold in something beyond real time.', 'tt6723592', 7.3, 'https://image.tmdb.org/t/p/w500//aCIFMriQh8rvhxpN1IWGgvH0Tlg.jpg', '70%', 'Tenet', 577922, 2020, 1, 'KJP5RunZUKk', '117,138,156', 1755008231235, -1, 1747353600000, b'1'),
(325, 'Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet in the universe to ensure the future of his family and his people. As malevolent forces explode into conflict over the planet\'s exclusive supply of the most precious resource in existence-a commodity capable of unlocking humanity\'s greatest potential-only those who can conquer their fear will survive.', 'tt1160419', 8, 'https://image.tmdb.org/t/p/w500//d5NXSklXo0qyIYkgV94XAgMIckC.jpg', '83%', 'Dune', 438631, 2021, 1, 'w0HgHet0sxg', '116,146,140', 1755008233224, -1, 1747440000000, b'1'),
(326, 'Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, Paul endeavors to prevent a terrible future only he can foresee.', 'tt15239678', 8.5, 'https://image.tmdb.org/t/p/w500//6izwz7rsy95ARzTR3poZ8H6c5pp.jpg', '92%', 'Dune: Part Two', 693134, 2024, 1, 'U2Qp5pL3ovA', '222,134,47', 1755008235226, -1, 1747785600000, b'1'),
(327, 'An aging Chinese immigrant is swept up in an insane adventure, where she alone can save what\'s important to her by connecting with the lives she could have led in other universes.', 'tt6710474', 7.8, 'https://image.tmdb.org/t/p/w500//u68AjlvlutfEIcpmbYpKcdi09ut.jpg', '94%', 'Everything Everywhere All at Once', 545611, 2022, 1, 'wxN1T1uxQ2g', '133,84,77', 1755008237337, -1, NULL, b'0'),
(328, 'After high school slacker Ferris Bueller successfully fakes an illness in order to skip school for the day, he goes on a series of adventures throughout Chicago with his girlfriend Sloane and best friend Cameron, all the while trying to outwit his wily school principal and fed-up sister.', 'tt0091042', 7.8, 'https://image.tmdb.org/t/p/w500//9LTQNCvoLsKXP0LtaKAaYVtRaQL.jpg', '83%', 'Ferris Bueller\'s Day Off', 9377, 1986, 1, 'GDttaV80_BM', '216,179,163', 1755008239346, -1, NULL, b'0'),
(329, 'Strange phenomena surface around the globe. The skies ignite. Terror races through the world\'s major cities. As these extraordinary events unfold, it becomes increasingly clear that a force of incredible magnitude has arrived. Its mission: total annihilation over the Fourth of July weekend. The last hope to stop the destruction is an unlikely group of people united by fate and unimaginable circumstances.', 'tt0116629', 7, 'https://image.tmdb.org/t/p/w500//p0BPQGSPoSa8Ml0DAf2mB2kCU0R.jpg', '68%', 'Independence Day', 602, 1996, 1, 'qHH7VxJJ2k8', '38,14,15', 1755008241223, -1, NULL, b'0'),
(330, 'At the height of the Vietnam war, Captain Benjamin Willard is sent on a dangerous mission that, officially, \"does not exist, nor will it ever exist.\" His goal is to locate - and eliminate - a mysterious Green Beret Colonel named Walter Kurtz, who has been leading his personal army on illegal guerrilla missions into enemy territory.', 'tt0078788', 8.4, 'https://image.tmdb.org/t/p/w500//gQB8Y5RCMkv2zwzFHbUJX3kAhvA.jpg', '90%', 'Apocalypse Now', 28, 1979, 1, '9l-ViOOFH-s', '40,17,19', 1755008243220, -1, NULL, b'0'),
(331, 'The drug-induced utopias of four Coney Island residents are shattered when their addictions run deep.', 'tt0180093', 8.3, 'https://image.tmdb.org/t/p/w500//nOd6vjEmzCT0k4VYqsA2hwyi87C.jpg', '78%', 'Requiem for a Dream', 641, 2000, 1, '20YzUO_RLS0', '187,176,181', 1755008245223, -1, NULL, b'0'),
(332, 'Los Angeles, 1969. TV star Rick Dalton, a struggling actor specializing in westerns, and stuntman Cliff Booth, his best friend, try to survive in a constantly changing movie industry. Dalton is the neighbor of the young and promising actress and model Sharon Tate, who has just married the prestigious Polish director Roman Polanski…', 'tt7131622', 7.6, 'https://image.tmdb.org/t/p/w500//8j58iEBw9pOXFD2L0nt0ZXeHviB.jpg', '86%', 'Once Upon a Time... in Hollywood', 466272, 2019, 1, 'vKgITiP1UMg', '47,42,34', 1755008247230, -1, NULL, b'0'),
(333, 'A young man and woman meet on a train in Europe, and wind up spending one evening together in Vienna. Unfortunately, both know that this will probably be their only night together.', 'tt0112471', 8.1, 'https://image.tmdb.org/t/p/w500//kf1Jb1c2JAOqjuzA3H4oDM263uB.jpg', '100%', 'Before Sunrise', 76, 1995, 1, 'jGvcbSabADM', '237,229,204', 1755008249345, -1, NULL, b'0'),
(334, 'Derek Vineyard is paroled after serving 3 years in prison for killing two African-American men. Through his brother, Danny Vineyard\'s narration, we learn that before going to prison, Derek was a skinhead and the leader of a violent white supremacist gang that committed acts of racial crime throughout L.A. and his actions greatly influenced Danny. Reformed and fresh out of prison, Derek severs contact with the gang and becomes determined to keep Danny from going down the same violent path as he did.', 'tt0120586', 8.5, 'https://image.tmdb.org/t/p/w500//x2drgoXYZ8484lqyDj7L1CEVR4T.jpg', '84%', 'American History X', 73, 1998, 1, 'ZVAfE5cT59c', '11,5,5', 1755008251223, -1, NULL, b'0'),
(335, 'Leonard Shelby is tracking down the man who raped and murdered his wife. The difficulty of locating his wife\'s killer, however, is compounded by the fact that he suffers from a rare, untreatable form of short-term memory loss. Although he can recall details of life before his accident, Leonard cannot remember what happened fifteen minutes ago, where he\'s going, or why.', 'tt0209144', 8.4, 'https://image.tmdb.org/t/p/w500//fKTPH2WvH8nHTXeBYBVhawtRqtR.jpg', '94%', 'Memento', 77, 2000, 1, 'Rq9eM4ZXRgs', '228,226,221', 1755008253219, -1, NULL, b'0'),
(336, 'A true story of two men who should never have met – a quadriplegic aristocrat who was injured in a paragliding accident and a young man from the projects.', 'tt1675434', 8.5, 'https://image.tmdb.org/t/p/w500//1QU7HKgsQbGpzsJbJK4pAVQV9F5.jpg', '75%', 'The Intouchables', 77338, 2011, 1, 'dvdJ--DV0Uo', '202,163,138', 1755008255221, -1, NULL, b'0'),
(337, 'Four high school teachers launch a drinking experiment: upholding a constant low level of intoxication.', 'tt10288566', 7.7, 'https://image.tmdb.org/t/p/w500//aDcIt4NHURLKnAEu7gow51Yd00Q.jpg', '93%', 'Another Round', 580175, 2020, 1, 'xlwAgvn1e5E', '217,198,174', 1755008257220, -1, NULL, b'0'),
(338, 'At an elite, old-fashioned boarding school in New England, a passionate English teacher inspires his students to rebel against convention and seize the potential of every day, courting the disdain of the stern headmaster.', 'tt0097165', 8.1, 'https://image.tmdb.org/t/p/w500//erzbMlcNHOdx24AXOcn2ZKA7R1q.jpg', '85%', 'Dead Poets Society', 207, 1989, 1, 's_jsDreXFZU', '33,25,24', 1755008259223, -1, NULL, b'0'),
(339, 'A petty criminal fakes insanity to serve his sentence in a mental ward rather than prison. He soon finds himself as a leader to the other patients—and an enemy to the cruel, domineering nurse who runs the ward.', 'tt0073486', 8.7, 'https://image.tmdb.org/t/p/w500//kjWsMh72V6d8KRLV4EOoSJLT1H7.jpg', '93%', 'One Flew Over the Cuckoo\'s Nest', 510, 1975, 1, '3NSVJlBeGBA', '32,31,32', 1755008261250, -1, NULL, b'0'),
(340, 'The defense and the prosecution have rested and the jury is filing into the jury room to decide if a young Spanish-American is guilty or innocent of murdering his father. What begins as an open and shut case soon becomes a mini-drama of each of the jurors\' prejudices and preconceptions about the trial, the accused, and each other.', 'tt0050083', 9, 'https://image.tmdb.org/t/p/w500//ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg', '100%', '12 Angry Men', 389, 1957, 1, 'TEN-2uTi2c0', '226,219,212', 1755008263217, -1, NULL, b'0'),
(341, 'When larcenous real estate clerk Marion Crane goes on the lam with a wad of cash and hopes of starting a new life, she ends up at the notorious Bates Motel, where manager Norman Bates cares for his housebound mother.', 'tt0054215', 8.5, 'https://image.tmdb.org/t/p/w500//yz4QVqPx3h1hD1DfqqQkCq3rmxW.jpg', '97%', 'Psycho', 539, 1960, 1, 'D90QhegiVvo', '33,37,53', 1755008265223, -1, NULL, b'0'),
(343, 'The mysterious disappearance of a kindergarten teacher during a picnic in the north of Iran is followed by a series of misadventures for her fellow travelers.', 'tt1360860', 7.9, 'https://image.tmdb.org/t/p/w500//c0UxlkjpWTM5bAm2NtJ0UaYjfzO.jpg', '99%', 'About Elly', 37181, 2009, 1, 'atb0JaAN_90', '201,199,200', 1755008269221, -1, NULL, b'0'),
(344, 'Forced out of their apartment due to dangerous works on a neighboring building, Emad and Rana move into a new flat in the center of Tehran. An incident linked to the previous tenant will dramatically change the young couple’s life.', 'tt5186714', 7.7, 'https://image.tmdb.org/t/p/w500//x4PIuYU5ZMMXiTrheNR8vCTYPBf.jpg', '96%', 'The Salesman', 375315, 2016, 1, 'r-61yYjKHHc', '236,231,229', 1755008271218, -1, NULL, b'0'),
(345, 'After the death of Emperor Marcus Aurelius, his devious son takes power and demotes Maximus, one of Rome\'s most capable generals who Marcus preferred. Eventually, Maximus is forced to become a gladiator and battle to the death against other men for the amusement of paying audiences.', 'tt0172495', 8.5, 'https://image.tmdb.org/t/p/w500//ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg', '80%', 'Gladiator', 98, 2000, 1, 'P5ieIbInFpg', '235,191,137', 1755008273222, -1, NULL, b'0'),
(346, 'In the poverty-stricken favelas of Rio de Janeiro in the 1970s, two young men choose different paths. Rocket is a budding photographer who documents the increasing drug-related violence of his neighborhood, while José “Zé” Pequeno is an ambitious drug dealer diving into a dangerous life of crime.', 'tt0317248', 8.6, 'https://image.tmdb.org/t/p/w500//k7eYdWvhYQyRQoU2TB2A2Xu2TfD.jpg', '91%', 'City of God', 598, 2002, 1, 'dcUOO4Itgmw', '188,63,39', 1755008275226, -1, NULL, b'0'),
(347, 'A drifter lives in people\'s houses while they are away and repays them by doing chores for them. His life changes when he meets a beautiful woman who wants to escape her unhappy marriage.', 'tt0423866', 7.9, 'https://image.tmdb.org/t/p/w500//8ens4pTquSxN7J9EgL0NOehWwdZ.jpg', '87%', '3-Iron', 1280, 2004, 1, 'S-S5n0JniDw', '34,35,35', 1755008277217, -1, NULL, b'0'),
(348, 'An international assassin known as ‘The Jackal’ is employed by disgruntled French generals to kill President Charles de Gaulle, with a dedicated gendarme on the assassin’s trail.', 'tt0069947', 7.8, 'https://image.tmdb.org/t/p/w500//vThgcb3JOj99yETg8WChuci4LV2.jpg', '91%', 'The Day of the Jackal', 4909, 1973, 1, 'lQdYPtm2u2k', '223,76,80', 1755008279222, -1, NULL, b'0'),
(349, 'In post–civil war Spain, 10-year-old Ofelia moves with her pregnant mother to live under the control of her cruel stepfather. Drawn into a mysterious labyrinth, she meets a faun who reveals that she may be a lost princess from an underground kingdom. To return to her true father, she must complete a series of surreal and perilous tasks that blur the line between reality and fantasy.', 'tt0457430', 8.2, 'https://image.tmdb.org/t/p/w500//s8C4whhKtDaJvMDcyiMvx3BIF5F.jpg', '95%', 'Pan\'s Labyrinth', 1417, 2006, 1, '6tYUOAMsydg', '18,32,36', 1755008281231, -1, NULL, b'0'),
(350, 'On his first day on the job as a narcotics officer, a rookie cop works with a rogue detective who isn\'t what he appears.', 'tt0139654', 7.8, 'https://image.tmdb.org/t/p/w500//bUeiwBQdupBLQthMCHKV7zv56uv.jpg', '74%', 'Training Day', 2034, 2001, 1, 'VQ-SCoyUwfg', '59,53,46', 1755008283224, -1, NULL, b'0'),
(351, 'When a charming 12-year-old girl takes on the characteristics and voices of others, doctors say there is nothing they can do. As people begin to die, the girl\'s mother realizes her daughter has been possessed by the Devil. Her daughter\'s only possible hope lies with two priests and the ancient rite of demonic exorcism.', 'tt0070047', 8.1, 'https://image.tmdb.org/t/p/w500//5x0CeVHJI8tcDx8tUUwYHQSNILq.jpg', '78%', 'The Exorcist', 9552, 1973, 1, 'BU2eYAO31Cc', '16,15,16', 1755008285218, -1, NULL, b'0'),
(352, 'In 2003, Harvard undergrad and computer programmer Mark Zuckerberg begins work on a new concept that eventually turns into the global social network known as Facebook. Six years later, Mark is one of the youngest billionaires ever, but his unprecedented success leads to both personal and legal complications when he ends up on the receiving end of two lawsuits, one involving his former friend.', 'tt1285016', 7.8, 'https://image.tmdb.org/t/p/w500//n0ybibhJtQ5icDqTp8eRytcIHJx.jpg', '96%', 'The Social Network', 37799, 2010, 1, 'rBCNU0XT9GY', '196,145,110', 1755008287227, -1, NULL, b'0'),
(353, 'An apocalyptic story set in the furthest reaches of our planet, in a stark desert landscape where humanity is broken, and most everyone is crazed fighting for the necessities of life. Within this world exist two rebels on the run who just might be able to restore order.', 'tt1392190', 8.1, 'https://image.tmdb.org/t/p/w500//hA2ple9q4qnwxp3hKVNhroipsir.jpg', '97%', 'Mad Max: Fury Road', 76341, 2015, 1, 'MonFNCgK4WE', '219,194,118', 1755008289227, -1, NULL, b'0'),
(354, 'Tragedy strikes a married couple vacationing in the Moroccan desert, which jumpstarts an interlocking story involving four different families.', 'tt0449467', 7.5, 'https://image.tmdb.org/t/p/w500//ocV89hUekPRPIjPxivNBZJXx7AN.jpg', '68%', 'Babel', 1164, 2006, 1, 'PqPNksLZIAk', '29,25,23', 1755008291219, -1, NULL, b'0'),
(355, 'Paul Rivers, an ailing mathematician lovelessly married to an English émigré; Christina Peck, an upper-middle-class suburban housewife and mother of two girls; and Jack Jordan, a born-again ex-con, are brought together by a terrible accident that changes their lives.', 'tt0315733', 7.6, 'https://image.tmdb.org/t/p/w500//wZ0l6or5juuVWqDkLEgaghs4f9l.jpg', '80%', '21 Grams', 470, 2003, 1, 'x_tPi8pYzSw', '222,116,57', 1755008293225, -1, NULL, b'0'),
(356, 'In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler.', 'tt1877830', 7.8, 'https://image.tmdb.org/t/p/w500//74xTEgt7R36Fpooo50r9T25onhq.jpg', '85%', 'The Batman', 414906, 2022, 1, 'vc7_mH2PWHs', '190,86,27', 1755008295232, -1, 1755025615997, b'1'),
(357, 'Headstrong yet aimless, Will Hunting has a genius-level IQ but chooses to work as a janitor at MIT. When he secretly solves highly difficult graduate-level math problems, his talents are discovered by Professor Gerald Lambeau, who decides to help the misguided youth reach his potential. When Will is arrested for attacking a police officer, Professor Lambeau makes a deal to get leniency for him if he gets court-ordered therapy. Eventually, therapist Dr. Sean Maguire helps Will confront the demons that are holding him back.', 'tt0119217', 8.3, 'https://image.tmdb.org/t/p/w500//z2FnLKpFi1HPO7BEJxdkv6hpJSU.jpg', '97%', 'Good Will Hunting', 489, 1997, 1, 'ReIJ1lbL-Q8', '198,137,47', 1755008297232, -1, NULL, b'0'),
(358, 'Ruthless silver miner, turned oil prospector, Daniel Plainview, moves to oil-rich California. Using his son to project a trustworthy, family-man image, Plainview cons local landowners into selling him their valuable properties for a pittance. However, local preacher Eli Sunday suspects Plainview\'s motives and intentions, starting a slow-burning feud that threatens both their lives.', 'tt0469494', 8.2, 'https://image.tmdb.org/t/p/w500//fa0RDkAlCec0STeMNAhPaF89q6U.jpg', '91%', 'There Will Be Blood', 7345, 2007, 1, '0FIm5ATyAY0', '207,148,103', 1755008299223, -1, NULL, b'0'),
(359, 'A BBC adaptation of the Victorian \"penny dreadful\" tale of 19th century \"demon barber\" Sweeney Todd, of Fleet Street, who cuts the throats of unsuspecting clients in his London shop.', 'tt0479760', 6.8, 'https://image.tmdb.org/t/p/w500//40ntPvTqjqEJlME1AtBEzwVUPHC.jpg', '', 'Sweeney Todd', 37924, 2006, 1, '6XLcRvf-slw', '208,131,120', 1755008301220, -1, NULL, b'0'),
(360, 'Rita, an underrated lawyer working for a large law firm more interested in getting criminals out of jail than bringing them to justice, is hired by the leader of a criminal organization.', 'tt20221436', 0, 'https://image.tmdb.org/t/p/w500//fko8fTfL6BcAqOUh6BZYUjt4SQP.jpg', NULL, 'Emilia Pérez', 974950, 2024, 1, 'houUHc5vm4I', '196,108,117', 1755008303225, -1, NULL, b'0'),
(361, 'A young girl, Chihiro, becomes trapped in a strange new world of spirits. When her parents undergo a mysterious transformation, she must call upon the courage she never knew she had to free her family.', 'tt0245429', 8.6, 'https://image.tmdb.org/t/p/w500//39wmItIWsg5sZMyRUHLkWBcuVCM.jpg', '96%', 'Spirited Away', 129, 2001, 1, 'GAp2_0JJskk', '22,17,15', 1755008305222, -1, NULL, b'0'),
(362, 'Sophie, a young milliner, is turned into an elderly woman by a witch who enters her shop and curses her. She encounters a wizard named Howl and gets caught up in his resistance to fighting for the king.', 'tt0347149', 8.2, 'https://image.tmdb.org/t/p/w500//TkTPELv4kC3u1lkloush8skOjE.jpg', '88%', 'Howl\'s Moving Castle', 4935, 2004, 1, 'ARCQf2CEr8k', '64,154,202', 1755008307226, -1, NULL, b'0'),
(363, 'The story of J. Robert Oppenheimer\'s role in the development of the atomic bomb during World War II.', 'tt15398776', 8.3, 'https://image.tmdb.org/t/p/w500//8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', '93%', 'Oppenheimer', 872585, 2023, 1, 'qiuSBWVdgLI', '219,129,48', 1755008309223, -1, 1754683736729, b'1'),
(364, 'With his wife\'s disappearance having become the focus of an intense media circus, a man sees the spotlight turned on him when it\'s suspected that he may not be innocent.', 'tt2267998', 8.1, 'https://image.tmdb.org/t/p/w500//ts996lKsxvjkO2yiYG0ht4qAicO.jpg', '88%', 'Gone Girl', 210577, 2014, 1, '2-_-1nJf8Vg', '169,174,169', 1755008313235, -1, 1754858728664, b'1'),
(365, 'A mysterious story of two magicians whose intense rivalry leads them on a life-long battle for supremacy -- full of obsession, deceit and jealousy with dangerous and deadly consequences.', 'tt0482571', 8.5, 'https://image.tmdb.org/t/p/w500//2ZOzyhoW08neG27DVySMCcq2emd.jpg', '77%', 'The Prestige', 1124, 2006, 1, 'ObGVA1WOqyE', '9,8,7', 1755008315221, -1, NULL, b'0'),
(366, 'Trying to leave their troubled lives behind, twin brothers return to their hometown to start again, only to discover that an even greater evil is waiting to welcome them back.', 'tt31193180', 7.6, 'https://image.tmdb.org/t/p/w500//4CkZl1LK6a5rXBqJB2ZP77h3N5i.jpg', '97%', 'Sinners', 1233413, 2025, 1, 'l2h2lC0vlX4', '44,21,10', 1755008317227, -1, 1752701656678, b'1'),
(367, 'Every second of every day, from the moment he was born, for the last thirty years, Truman Burbank has been the unwitting star of the longest running, most popular documentary-soap opera in history. The picture-perfect town of Seahaven that he calls home is actually a gigantic soundstage. Truman\'s friends and family - everyone he meets, in fact - are actors. He lives every moment under the unblinking gaze of thousands of hidden TV cameras.', 'tt0120382', 8.2, 'https://image.tmdb.org/t/p/w500//vuza0WqY239yBXOadKlGwJsZJFE.jpg', '94%', 'The Truman Show', 37165, 1998, 1, 'dlnmQbPGuls', '58,71,88', 1755008319225, -1, NULL, b'0'),
(368, 'A special bond develops between plus-sized inflatable robot Baymax, and prodigy Hiro Hamada, who team up with a group of friends to form a band of high-tech heroes.', 'tt2245084', 7.8, 'https://image.tmdb.org/t/p/w500//2mxS4wUimwlLmI1xp6QW6NSU361.jpg', '90%', 'Big Hero 6', 177572, 2014, 1, '8IdMPpKMdcc', '211,106,97', 1755008321222, -1, 1754769218130, b'1'),
(369, 'A look at the relationship between Mike and Sulley during their days at Monsters University — when they weren\'t necessarily the best of friends.', 'tt1453405', 7.2, 'https://image.tmdb.org/t/p/w500//y7thwJ7z5Bplv6vwl6RI0yteaDD.jpg', '80%', 'Monsters University', 62211, 2013, 1, 'xBzPioph8CI', '125,165,180', 1755008323235, -1, 1754935798102, b'1'),
(370, 'When all but one child from the same class mysteriously vanish on the same night at exactly the same time, a community is left questioning who or what is behind their disappearance.', 'tt26581740', 7.9, 'https://image.tmdb.org/t/p/w500//cpf7vsRZ0MYRQcnLWteD5jK9ymT.jpg', '95%', 'Weapons', 1078605, 2025, 1, 'QKHySfXqN0I', '6,21,31', 1755008325219, -1, NULL, b'0'),
(371, 'In the 22nd century, a paraplegic Marine is dispatched to the moon Pandora on a unique mission, but becomes torn between following orders and protecting an alien civilization.', 'tt0499549', 7.9, 'https://image.tmdb.org/t/p/w500//gKY6q7SjCkAU6FqvqWybDYgUKIF.jpg', '81%', 'Avatar', 19995, 2009, 1, 'jm2sNLIPPvA', '14,20,31', 1755182399625, -1, 1755111700683, b'1'),
(372, 'Set more than a decade after the events of the first film, learn the story of the Sully family (Jake, Neytiri, and their kids), the trouble that follows them, the lengths they go to keep each other safe, the battles they fight to stay alive, and the tragedies they endure.', 'tt1630029', 7.5, 'https://image.tmdb.org/t/p/w500//t6HIqrRAclMCA60NsSmeqe9RmNV.jpg', '76%', 'Avatar: The Way of Water', 76600, 2022, 1, 'o5F8MOz_IDw', '36,34,50', 1755827146810, -1, 1755195515648, b'1'),
(373, 'After a chaotic night of rioting in a marginal suburb of Paris, three young friends, Vinz, Hubert and Saïd, wander around unoccupied waiting for news about the state of health of a mutual friend who has been seriously injured when confronting the police.', 'tt0113247', 8.1, 'https://image.tmdb.org/t/p/w500//fFVWBMKLwwPh9K0hkrKwPUf8mwn.jpg', '96%', 'La Haine', 406, 1995, 1, 'FKwcXt3JIaU', '31,31,30', 1755827154918, -1, 1755292505266, b'1'),
(374, 'In Nazi-occupied France during World War II, a group of Jewish-American soldiers known as \"The Basterds\" are chosen specifically to spread fear throughout the Third Reich by scalping and brutally killing Nazis. The Basterds, lead by Lt. Aldo Raine soon cross paths with a French-Jewish teenage girl who runs a movie theater in Paris which is targeted by the soldiers.', 'tt0361748', 8.4, 'https://image.tmdb.org/t/p/w500//7sfbEnaARXDDhKm0CZ7D7uc2sbo.jpg', '89%', 'Inglourious Basterds', 16869, 2009, 1, 'uSEDz-my7XQ', '54,35,34', 1755827179938, -1, NULL, b'0'),
(375, 'A family is forced to live in silence while hiding from creatures that hunt by sound.', 'tt6644200', 7.5, 'https://image.tmdb.org/t/p/w500//nAU74GmpUk7t5iklEp3bufwDq4n.jpg', '96%', 'A Quiet Place', 447332, 2018, 1, 'rqEnM25BsNQ', '20,25,28', 1755827189225, -1, 1755302400000, b'1'),
(376, 'A married couple are faced with a difficult decision - to improve the life of their child by moving to another country or to stay in Iran and look after a deteriorating parent who has Alzheimer\'s disease.', 'tt1832382', 8.3, 'https://image.tmdb.org/t/p/w500//wQVvASmpm8jGhJBQU20OkoMcNzi.jpg', '99%', 'A Separation', 60243, 2011, 1, '58Onuy5USTc', '133,100,81', 1755827194981, -1, NULL, b'0'),
(377, 'Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land. However, when they get a chance to go to the real world, they soon discover the joys and perils of living among humans.', 'tt1517268', 6.8, 'https://image.tmdb.org/t/p/w500//iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg', '88%', 'Barbie', 346698, 2023, 1, 'Y1IgAEejvqM', '231,203,216', 1755463348843, -1, 1755463348843, b'1'),
(378, 'Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael steps in to take care of the would-be killers, launching a campaign of bloody revenge.', 'tt0068646', 9.2, 'https://image.tmdb.org/t/p/w500//3bhkrj58Vtu7enYsRolD1fZdja1.jpg', '97%', 'The Godfather', 238, 1972, 1, 'Ew9ngL1GZvs', '210,182,171', 1755547062770, -1, 1755547062770, b'1'),
(379, 'Following the events at home, the Abbott family now face the terrors of the outside world. Forced to venture into the unknown, they realize that the creatures that hunt by sound are not the only threats that lurk beyond the sand path.', 'tt8332922', 7.2, 'https://image.tmdb.org/t/p/w500//4q2hz2m8hubgvijz8Ez0T2Os2Yv.jpg', '91%', 'A Quiet Place Part II', 520763, 2021, 1, 'BpdDN9d9Jio', '196,199,186', 1755827228583, -1, NULL, b'0'),
(380, 'The true story of Henry Hill, a half-Irish, half-Sicilian Brooklyn kid who is adopted by neighbourhood gangsters at an early age and climbs the ranks of a Mafia family under the guidance of Jimmy Conway.', 'tt0099685', 8.7, 'https://image.tmdb.org/t/p/w500//aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg', '94%', 'GoodFellas', 769, 1990, 1, 'PTBRNXGQR9Q', '6,6,7', 1755827234224, -1, NULL, b'0'),
(381, 'In the continuing saga of the Corleone crime family, a young Vito Corleone grows up in Sicily and in 1910s New York. In the 1950s, Michael Corleone attempts to expand the family business into Las Vegas, Hollywood and Cuba.', 'tt0071562', 9, 'https://image.tmdb.org/t/p/w500//hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg', '96%', 'The Godfather Part II', 240, 1974, 1, '7pfqivkYUlE', '5,5,5', 1755827242640, -1, NULL, b'0'),
(382, 'Residents in a lonely gulch of inland California bear witness to an uncanny, chilling discovery.', 'tt10954984', 6.8, 'https://image.tmdb.org/t/p/w500//AcKVlWaNVVVFQwro3nLXqPljcYA.jpg', '83%', 'Nope', 762504, 2022, 1, 'fJKNxP-tjIQ', '7,20,38', 1755561600000, -1, 1755561600000, b'1'),
(383, 'After settling in Green Hills, Sonic is eager to prove he has what it takes to be a true hero. His test comes when Dr. Robotnik returns, this time with a new partner, Knuckles, in search for an emerald that has the power to destroy civilizations. Sonic teams up with his own sidekick, Tails, and together they embark on a globe-trotting journey to find the emerald before it falls into the wrong hands.', 'tt12412888', 6.5, 'https://image.tmdb.org/t/p/w500//6DrHO1jr3qVrViUO6s6kFiAGM7.jpg', '69%', 'Sonic the Hedgehog 2', 675353, 2022, 1, '47r8FXYZWNU', '216,151,126', 1755648000000, -1, 1755648000000, b'1'),
(384, 'American car designer Carroll Shelby and the British-born driver Ken Miles work together to battle corporate interference, the laws of physics, and their own personal demons to build a revolutionary race car for Ford Motor Company and take on the dominating race cars of Enzo Ferrari at the 24 Hours of Le Mans in France in 1966.', 'tt1950186', 8.1, 'https://image.tmdb.org/t/p/w500//dR1Ju50iudrOh3YgfwkAU1g2HZe.jpg', '92%', 'Ford v Ferrari', 359724, 2019, 1, 'I3h9Z89U9ZA', '224,231,226', 1755827262373, -1, NULL, b'0'),
(385, 'A Chicago artist\'s sanity starts to unravel, unleashing a terrifying wave of violence when he begins to explore the macabre history of the Candyman.', 'tt9347730', 5.9, 'https://image.tmdb.org/t/p/w500//qeV15PpR8jFJA9TF9JPXIoqEgp1.jpg', '84%', 'Candyman', 565028, 2021, 1, 'TPBH3XO8YEU', '14,9,7', 1755827268125, -1, NULL, b'0'),
(386, 'Sonic, Knuckles, and Tails reunite against a powerful new adversary, Shadow, a mysterious villain with powers unlike anything they have faced before. With their abilities outmatched in every way, Team Sonic must seek out an unlikely alliance in hopes of stopping Shadow and protecting the planet.', 'tt18259086', 6.9, 'https://image.tmdb.org/t/p/w500//d8Ryb8AunYAuycVKDp5HpdWPKgC.jpg', '85%', 'Sonic the Hedgehog 3', 939243, 2024, 1, 'LH1J1EbqCaI', '220,177,159', 1755734400000, -1, 1755734400000, b'1');

-- --------------------------------------------------------

--
-- Table structure for table `movie_genres`
--

CREATE TABLE `movie_genres` (
  `movie_id` bigint(20) NOT NULL,
  `genres` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `movie_genres`
--

INSERT INTO `movie_genres` (`movie_id`, `genres`) VALUES
(3, 'Drama'),
(4, 'Thriller'),
(4, 'Crime'),
(4, 'Comedy'),
(287, 'Drama'),
(287, 'Thriller'),
(288, 'Horror'),
(288, 'Thriller'),
(289, 'Thriller'),
(289, 'Crime'),
(289, 'Comedy'),
(289, 'Drama'),
(290, 'Drama'),
(290, 'Science Fiction'),
(290, 'Mystery'),
(291, 'Science Fiction'),
(291, 'Drama'),
(291, 'Romance'),
(292, 'Comedy'),
(292, 'Drama'),
(292, 'Romance'),
(293, 'Drama'),
(293, 'Crime'),
(293, 'Thriller'),
(294, 'Drama'),
(294, 'Thriller'),
(294, 'Mystery'),
(295, 'Fantasy'),
(295, 'Comedy'),
(295, 'Romance'),
(296, 'Drama'),
(297, 'Crime'),
(297, 'Mystery'),
(297, 'Thriller'),
(298, 'Drama'),
(298, 'Thriller'),
(299, 'Drama'),
(299, 'Thriller'),
(299, 'Mystery'),
(300, 'Drama'),
(300, 'Crime'),
(301, 'Mystery'),
(301, 'Thriller'),
(301, 'Drama'),
(302, 'Drama'),
(302, 'Thriller'),
(302, 'Mystery'),
(302, 'Action'),
(303, 'Animation'),
(303, 'Science Fiction'),
(303, 'Family'),
(304, 'Action'),
(304, 'Crime'),
(304, 'Drama'),
(305, 'Animation'),
(305, 'Adventure'),
(305, 'Comedy'),
(305, 'Family'),
(306, 'Drama'),
(306, 'Music'),
(307, 'Drama'),
(307, 'Thriller'),
(307, 'Mystery'),
(308, 'Fantasy'),
(308, 'Drama'),
(308, 'Crime'),
(309, 'Science Fiction'),
(309, 'Crime'),
(310, 'Drama'),
(310, 'War'),
(311, 'Crime'),
(311, 'Drama'),
(311, 'Action'),
(312, 'Comedy'),
(312, 'Drama'),
(313, 'Drama'),
(313, 'Crime'),
(313, 'Action'),
(314, 'Drama'),
(314, 'Action'),
(314, 'Crime'),
(314, 'Thriller'),
(315, 'Action'),
(315, 'Crime'),
(315, 'Drama'),
(315, 'Thriller'),
(316, 'War'),
(316, 'History'),
(316, 'Thriller'),
(316, 'Drama'),
(317, 'Fantasy'),
(317, 'Animation'),
(317, 'Family'),
(318, 'Crime'),
(318, 'Drama'),
(318, 'Thriller'),
(319, 'Crime'),
(319, 'Drama'),
(320, 'Fantasy'),
(320, 'Drama'),
(320, 'Mystery'),
(321, 'Animation'),
(321, 'Adventure'),
(321, 'Fantasy'),
(321, 'Family'),
(322, 'Action'),
(322, 'Science Fiction'),
(322, 'Adventure'),
(323, 'War'),
(323, 'Action'),
(323, 'Drama'),
(324, 'Action'),
(324, 'Thriller'),
(324, 'Science Fiction'),
(325, 'Science Fiction'),
(325, 'Adventure'),
(326, 'Science Fiction'),
(326, 'Adventure'),
(327, 'Action'),
(327, 'Adventure'),
(327, 'Science Fiction'),
(328, 'Comedy'),
(329, 'Action'),
(329, 'Adventure'),
(329, 'Science Fiction'),
(330, 'Drama'),
(330, 'War'),
(331, 'Crime'),
(331, 'Drama'),
(332, 'Comedy'),
(332, 'Drama'),
(332, 'Thriller'),
(333, 'Drama'),
(333, 'Romance'),
(334, 'Drama'),
(335, 'Mystery'),
(335, 'Thriller'),
(336, 'Drama'),
(336, 'Comedy'),
(337, 'Comedy'),
(337, 'Drama'),
(338, 'Drama'),
(339, 'Drama'),
(340, 'Drama'),
(341, 'Horror'),
(341, 'Thriller'),
(341, 'Mystery'),
(343, 'Drama'),
(344, 'Drama'),
(344, 'Thriller'),
(345, 'Action'),
(345, 'Drama'),
(345, 'Adventure'),
(346, 'Drama'),
(346, 'Crime'),
(347, 'Drama'),
(347, 'Romance'),
(347, 'Crime'),
(348, 'Action'),
(348, 'Thriller'),
(349, 'Fantasy'),
(349, 'Drama'),
(349, 'War'),
(350, 'Action'),
(350, 'Crime'),
(350, 'Drama'),
(351, 'Horror'),
(352, 'Drama'),
(353, 'Action'),
(353, 'Adventure'),
(353, 'Science Fiction'),
(354, 'Drama'),
(355, 'Drama'),
(355, 'Crime'),
(355, 'Thriller'),
(356, 'Crime'),
(356, 'Mystery'),
(356, 'Thriller'),
(357, 'Drama'),
(358, 'Drama'),
(359, 'Drama'),
(359, 'Horror'),
(359, 'Thriller'),
(359, 'Music'),
(360, 'Drama'),
(360, 'Thriller'),
(361, 'Animation'),
(361, 'Family'),
(361, 'Fantasy'),
(362, 'Fantasy'),
(362, 'Animation'),
(362, 'Adventure'),
(363, 'Drama'),
(363, 'History'),
(364, 'Mystery'),
(364, 'Thriller'),
(364, 'Drama'),
(365, 'Drama'),
(365, 'Mystery'),
(365, 'Science Fiction'),
(366, 'Horror'),
(366, 'Action'),
(366, 'Thriller'),
(367, 'Comedy'),
(367, 'Drama'),
(368, 'Adventure'),
(368, 'Family'),
(368, 'Animation'),
(368, 'Action'),
(368, 'Comedy'),
(369, 'Animation'),
(369, 'Family'),
(370, 'Horror'),
(370, 'Mystery'),
(371, 'Action'),
(371, 'Adventure'),
(371, 'Fantasy'),
(371, 'Science Fiction'),
(372, 'Science Fiction'),
(372, 'Adventure'),
(372, 'Action'),
(373, 'Drama'),
(374, 'Drama'),
(374, 'Thriller'),
(374, 'War'),
(375, 'Horror'),
(375, 'Drama'),
(375, 'Science Fiction'),
(376, 'Drama'),
(377, 'Comedy'),
(377, 'Adventure'),
(378, 'Drama'),
(378, 'Crime'),
(379, 'Science Fiction'),
(379, 'Thriller'),
(379, 'Horror'),
(380, 'Drama'),
(380, 'Crime'),
(381, 'Drama'),
(381, 'Crime'),
(382, 'Horror'),
(382, 'Science Fiction'),
(382, 'Thriller'),
(383, 'Action'),
(383, 'Adventure'),
(383, 'Family'),
(383, 'Comedy'),
(384, 'Drama'),
(384, 'Action'),
(384, 'History'),
(385, 'Horror'),
(385, 'Thriller'),
(386, 'Action'),
(386, 'Science Fiction'),
(386, 'Comedy'),
(386, 'Family');

-- --------------------------------------------------------

--
-- Table structure for table `movie_streaming_services`
--

CREATE TABLE `movie_streaming_services` (
  `movie_id` bigint(20) NOT NULL,
  `streaming_services` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `page`
--

CREATE TABLE `page` (
  `id` bigint(20) NOT NULL,
  `created_date` bigint(20) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `is_public` bit(1) DEFAULT NULL,
  `owner_name` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `owner_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `page`
--

INSERT INTO `page` (`id`, `created_date`, `description`, `is_public`, `owner_name`, `title`, `owner_id`) VALUES
(1, 1750691270233, 'Welcome to the Movie Watchlist!', b'1', 'alexpg', 'Movie Watchlist', 1),
(2, 1750716751991, 'Welcome to the Movie Watchlist!', b'1', 'Peyv', 'Movie Watchlist', 2);

-- --------------------------------------------------------

--
-- Table structure for table `page_movies`
--

CREATE TABLE `page_movies` (
  `page_id` bigint(20) NOT NULL,
  `movie_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` bigint(20) NOT NULL,
  `grid_size` int(11) DEFAULT NULL,
  `language` varchar(255) DEFAULT NULL,
  `theme` varchar(255) DEFAULT NULL,
  `view` int(11) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `grid_size`, `language`, `theme`, `view`, `user_id`) VALUES
(1, 3, 'en', 'default', 1, 1),
(2, 3, 'en', 'default', 1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `remember_me` varchar(255) DEFAULT NULL,
  `username` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `password`, `remember_me`, `username`) VALUES
(1, NULL, '{bcrypt}$2a$10$1AXM1j5KIX2h5YsA1/Bsa.EVOexGUJN0a21onkV.0cViPltY.k7wq', '15d05073-f201-41cf-932b-9d7753fc6237', 'alexpg'),
(2, NULL, '{bcrypt}$2a$10$93dK6UZJUyHEYrWl1nbrsOhtLbJPYog9ZpbpvX8a1.ekJSZn4Xmnq', NULL, 'Peyv');

-- --------------------------------------------------------

--
-- Table structure for table `user_movie`
--

CREATE TABLE `user_movie` (
  `id` bigint(20) NOT NULL,
  `added_date` bigint(20) DEFAULT NULL,
  `page_id` bigint(20) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `watch_date` bigint(20) DEFAULT NULL,
  `watched` bit(1) NOT NULL,
  `movie_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `user_id` bigint(20) NOT NULL,
  `role_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `collection`
--
ALTER TABLE `collection`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKbjr4xnxxfy0lip071hyh837x8` (`page_id`);

--
-- Indexes for table `collection_movies`
--
ALTER TABLE `collection_movies`
  ADD KEY `FK7pfxyje25h01doml3pmcfku1l` (`movie_id`),
  ADD KEY `FKdhxtbmmj53e0aydrdojd6uemg` (`collection_id`);

--
-- Indexes for table `movie`
--
ALTER TABLE `movie`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK33d43g718mp0ilkcycs70ss1t` (`page_id`);

--
-- Indexes for table `movie_genres`
--
ALTER TABLE `movie_genres`
  ADD KEY `FKs2xl3sirbon75mjcongwhrbi3` (`movie_id`);

--
-- Indexes for table `movie_streaming_services`
--
ALTER TABLE `movie_streaming_services`
  ADD KEY `FK47fxefdpdxcai6xo2e8vxdrug` (`movie_id`);

--
-- Indexes for table `page`
--
ALTER TABLE `page`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKmnl52u92rjp78c4tpjqmhwi0c` (`owner_id`);

--
-- Indexes for table `page_movies`
--
ALTER TABLE `page_movies`
  ADD KEY `FKt1bhsye034vajsjbh5gencymu` (`movie_id`),
  ADD KEY `FKsw2yr3eg74ogxt7v2tfjcd62x` (`page_id`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKiolw98qy0bp9gqo2u0pnxmx39` (`user_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_movie`
--
ALTER TABLE `user_movie`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKic2w099acvoapsiypkvkwio7n` (`movie_id`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD KEY `FKrhfovtciq1l558cw6udg0h0d3` (`role_id`),
  ADD KEY `FK55itppkw3i07do3h7qoclqd4k` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `movie`
--
ALTER TABLE `movie`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=387;

--
-- AUTO_INCREMENT for table `page`
--
ALTER TABLE `page`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user_movie`
--
ALTER TABLE `user_movie`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `collection`
--
ALTER TABLE `collection`
  ADD CONSTRAINT `FKbjr4xnxxfy0lip071hyh837x8` FOREIGN KEY (`page_id`) REFERENCES `page` (`id`);

--
-- Constraints for table `collection_movies`
--
ALTER TABLE `collection_movies`
  ADD CONSTRAINT `FK7pfxyje25h01doml3pmcfku1l` FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`),
  ADD CONSTRAINT `FKdhxtbmmj53e0aydrdojd6uemg` FOREIGN KEY (`collection_id`) REFERENCES `collection` (`id`);

--
-- Constraints for table `movie`
--
ALTER TABLE `movie`
  ADD CONSTRAINT `FK33d43g718mp0ilkcycs70ss1t` FOREIGN KEY (`page_id`) REFERENCES `page` (`id`);

--
-- Constraints for table `movie_genres`
--
ALTER TABLE `movie_genres`
  ADD CONSTRAINT `FKs2xl3sirbon75mjcongwhrbi3` FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`);

--
-- Constraints for table `movie_streaming_services`
--
ALTER TABLE `movie_streaming_services`
  ADD CONSTRAINT `FK47fxefdpdxcai6xo2e8vxdrug` FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`);

--
-- Constraints for table `page`
--
ALTER TABLE `page`
  ADD CONSTRAINT `FK4ala3jwqh8ghoegpvc86q5k1t` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `page_movies`
--
ALTER TABLE `page_movies`
  ADD CONSTRAINT `FKsw2yr3eg74ogxt7v2tfjcd62x` FOREIGN KEY (`page_id`) REFERENCES `page` (`id`),
  ADD CONSTRAINT `FKt1bhsye034vajsjbh5gencymu` FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`);

--
-- Constraints for table `settings`
--
ALTER TABLE `settings`
  ADD CONSTRAINT `FKb69c0rwwhhcr1kdqpcc1grftp` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `user_movie`
--
ALTER TABLE `user_movie`
  ADD CONSTRAINT `FKic2w099acvoapsiypkvkwio7n` FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`);

--
-- Constraints for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `FK55itppkw3i07do3h7qoclqd4k` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `FKrhfovtciq1l558cw6udg0h0d3` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

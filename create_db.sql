
/* main_db.t_user */
CREATE DATABASE `main_db`;
USE `main_db`;

CREATE TABLE `t_user` (
  `user_id` INT(11) AUTO_INCREMENT,
  `user_name` VARCHAR(40) NOT NULL,
  `create_time` DATETIME NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `t_user` (`user_name`, `create_time`) VALUES ("jht", NOW());
INSERT INTO `t_user` (`user_name`, `create_time`) VALUES ("tsy", NOW());


/* other_db.t_log */
CREATE DATABASE `other_db`;
USE `other_db`;

CREATE TABLE `t_log` (
  `log_id` INT(11) AUTO_INCREMENT,
  `log_msg` VARCHAR(40) NOT NULL,
  `create_time` DATETIME NOT NULL,
  PRIMARY KEY (`log_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `t_log` (`log_msg`, `create_time`) VALUES ("get request", NOW());
INSERT INTO `t_log` (`log_msg`, `create_time`) VALUES ("query database", NOW());

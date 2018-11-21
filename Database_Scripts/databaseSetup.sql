
#Run the following command to connect to database from command line. Enter password when prompted.
#mysql -h classmysql.engr.oregonstate.edu -u cs361_clemeant -p cs361_clemeant
#password: 6488


#Create users table

CREATE TABLE users (
  `user_id` SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_name` VARCHAR(255) NOT NULL,
  `user_password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (user_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;


#Create games table

CREATE TABLE games (
  `game_id` SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `sport_type` VARCHAR(50) NOT NULL,
  `start_date` DATE NOT NULL,
  `start_time` TIME NOT NULL,
  `host_user` SMALLINT UNSIGNED,
  `max_players` INT(11) NOT NULL,
  `current_players` INT(11) NOT NULL,  
  `location_name` VARCHAR(255) NOT NULL,
  `location_address` VARCHAR(255) NOT NULL,
  `location_city` VARCHAR(255) NOT NULL,
  `location_state` VARCHAR(50) NOT NULL,
  `location_zip` VARCHAR(50) NOT NULL,
  `location_lat` FLOAT(10, 6) DEFAULT NULL,
  `location_long` FLOAT(10, 6) DEFAULT NULL,
  PRIMARY KEY (game_id),
  CONSTRAINT fk_host_user FOREIGN KEY (host_user) REFERENCES users (user_id) ON DELETE SET NULL ON UPDATE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8;


#Add a user

INSERT INTO users (user_name, user_password) VALUES ('TestUser1', 'sports!');


#Add a game

INSERT INTO games (sport_type, start_date, start_time, host_user, max_players, current_players, location_name, location_address, location_city, location_state, location_zip, location_lat, location_long) VALUES ('Football', '2018-11-19', '15:30:00', 1, 30, 3, 'Football Field', '123 Some Street', 'Philadelphia', 'PA', '19019', 39.95233, -75.16379);

#Create users in game table (N-M)

CREATE TABLE gameUsers (
  `gameUsers_id`SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `game_id` SMALLINT UNSIGNED NOT NULL,
  `user_id` SMALLINT UNSIGNED,
  PRIMARY KEY (gameUsers_id),
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) 
  ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_game_id FOREIGN KEY (game_id) REFERENCES games (game_id) 
  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

# Add user into game
INSERT INTO gameUsers (game_id, user_id) VALUES (1, 1);

# Remove user from game
DELETE FROM gameUsers
WHERE user_id = '1'
AND game_id = '1'

# Show all users in game
SELECT u.user_name AS Names
FROM users u
INNER JOIN gameUsers g ON g.user_id = u.user_id
WHERE g.game_id = '1';

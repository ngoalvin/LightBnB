INSERT INTO users (id, name, email, password) 
VALUES (1, 'Alvin', 'alvin@gmail.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
(2, 'Mike', 'mike@gmail.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
(3, 'Albert', 'albert@gmail.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (id, owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1, 1, 'Speed Lamp', 'description', 'thumb1_url', 'cover1_url', 500, 1, 2, 3, 'Canada', 'street','city', 'province','post_code', TRUE),
(2, 2, 'Blank Corner', 'description', 'thumb2_url', 'cover2_url', 600, 2, 3, 5, 'Canada', 'street','city', 'province','post_code', TRUE),
(3, 2, 'Blank Corner', 'description', 'thumb2_url', 'cover2_url', 600, 2, 3, 5, 'Canada', 'street','city', 'province','post_code', FALSE);

INSERT INTO reservations (id , start_date, end_date, property_id, guest_id)
VALUES (1, '2020-01-01', '2021-01-01', 2, 1),
(2, '2020-02-02', '2021-02-02', 2, 2),
(3, '2020-03-03', '2021-03-03', 2, 3);

INSERT INTO property_reviews (id, guest_id, property_id, reservation_id, rating,message)
VALUES (1, 1, 1, 1, 5,'message'),
(2, 2, 2, 2, 6,'message'),
(3, 3, 3, 3, 7,'message');

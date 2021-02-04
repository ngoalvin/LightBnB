const properties = require('./json/properties.json');
const users = require('./json/users.json');

/// Users
const { Pool } = require('pg');
const { query } = require('express');
const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb',
});

pool.connect().then(()=> {
  getAllProperties();
});

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithEmail = function(email) {
  return pool.query(`
  SELECT * FROM users
  WHERE email = $1;
  `, [email])
    .then(res => res.rows[0]);
};

exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool.query(`
  SELECT * FROM users
  WHERE id = $1;
  `, [id])
    .then(res => res.rows[0]);
};

exports.getUserWithId = getUserWithId;



/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) {
  console.log(user);
  return pool.query(`INSERT INTO users
  (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;`
  , [user.name, user.email, user.password])
    .then(res => res.rows[0]);
};

exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */

const getAllReservations = function(guest_id, limit = 10) {
  return pool.query(`
  SELECT properties.id, reservations.start_date, avg(rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id 
  WHERE reservations.guest_id = $1
  AND reservations.end_date < now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;`, [guest_id, limit])
    .then(res => res.rows);
};

exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

const getAllProperties = function(options, limit = 10) {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  LEFT JOIN property_reviews ON properties.id = property_id
  `;
  // 3
  const queryObj = {
    city : `city LIKE $`,
    owner_id : `owner_id = $`,
    minimum_price_per_night : `cost_per_night >= $`,
    maximum_price_per_night : `cost_per_night <= $`,
    minimum_rating : `rating >= $`
  };
  //list of keys of options
  let optionKeys = [];
  if (options) {
    optionKeys = Object.keys(options);
  }


  for (let i = 0; i < optionKeys.length; i++) {
    const key = optionKeys[i];
    //checks if its the first being added if so add WHERE
    if (options[key]) {
      if (i === 0) {
        queryString += `WHERE `;
      }
      //CHECKS IF ITS A NUMBER
      if (Number(options[key])) {
        if (key === 'minimum_price_per_night' || key === 'maximum_price_per_night') {
          const convertNum = options[key] * 100;
          queryParams.push(convertNum);
        } else {
          queryParams.push(options[key]);
        }
      } else {
        //adds the string with % to a LIKE
        queryParams.push(`%${options[key]}%`);
      }
      queryObj[key] += `${queryParams.length}`;
      queryString += queryObj[key];
    }
    // CHECKS TO SEE IF THERES A TRUTHY on the next run if so ADD AND
    if (options[optionKeys[i + 1]]) {
      queryString += ` AND `;
    }
  }

  // 4
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
  console.log(queryString,"PARAMS", queryParams);

  // 6
  return pool.query(queryString, queryParams)
    .then(res => res.rows);
};

exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
// const addProperty = function(property) {
//   const propertyId = Object.keys(properties).length + 1;
//   property.id = propertyId;
//   properties[propertyId] = property;
//   return Promise.resolve(property);
// };

const addProperty = function(property) {
  return pool.query(`INSERT INTO properties(
    owner_id, 
    title, 
    description, 
    thumbnail_photo_url,
    cover_photo_url,
    cost_per_night,
    street,
    city,
    province,
    post_code,
    country,
    parking_spaces,
    number_of_bathrooms,
    number_of_bedrooms
    ) VALUES ($1, $2, $3, $4 ,$5, $6, $7, $8, $9, $10,$11, $12, $13, $14) RETURNING *;`, [
    property.owner_id,
    property.title,
    property.description,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.cost_per_night,
    property.street,
    property.city,
    property.province,
    property.post_code,
    property.country,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms])
    .then(res => res.rows[0]);
};

exports.addProperty = addProperty;

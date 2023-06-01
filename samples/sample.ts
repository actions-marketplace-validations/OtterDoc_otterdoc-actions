

export interface User {
  name: string
  id: number
}

/**
 * Represents a user account with a name and ID.
 * @param {string} name - The name of the user.
 * @param {number} id - The ID of the user.
 * @class
 * @remarks To create a new user account, use the constructor to provide the name and ID.
 */
/**
 * Constructor for creating a UserAccount object with a name and ID.
 * 
 * @param {string} name - The name of the UserAccount.
 * @param {number} id - The ID of the UserAccount.
 * @class UserAccount
 */
/**
 * Constructor for creating an object with a name and ID.
 * 
 * @param {string} name - The name of the object.
 * @param {number} id - The ID of the object.
 * @class UserAccount
 * @returns {void}
 */
/**
 * Constructor for creating a UserAccount object with a name and ID.
 * 
 * @param {string} name - The name of the UserAccount object.
 * @param {number} id - The ID of the UserAccount object.
 * @returns {void}
 * @class UserAccount
 */
/**
 * Constructor function for creating a UserAccount object with a name and ID.
 *
 * @param {string} name - The name of the user.
 * @param {number} id - The unique ID of the user.
 * @returns {void}
 */
/**
 * Constructor for creating a UserAccount object with a name and ID.
 * 
 * @param {string} name - The name of the UserAccount.
 * @param {number} id - The ID of the UserAccount.
 * @class UserAccount
 */
export class UserAccount {
  name: string
  id: number

/**
 * Constructor for creating an object with a name and ID.
 * 
 * @param {string} name - The name of the object.
 * @param {number} id - The ID of the object.
 */
/**
 * Constructor for creating an object with a name and ID.
 * 
 * @param {string} name - The name of the object.
 * @param {number} id - The ID of the object.
 * @class ObjectCreator
 */
/**
 * Creates an object with a name and ID.
 * 
 * @param {string} name - The name of the object.
 * @param {number} id - The ID of the object.
 */
/**
 * Constructor for creating an object with a name and ID.
 * 
 * @param {string} name - The name of the object.
 * @param {number} id - The ID of the object.
 * @class MyObject
 */
/**
 * Constructs an object with a specified name and ID.
 * 
 * @param {string} name - The name of the object.
 * @param {number} id - The ID of the object.
 */
/**
 * Constructor for creating an object with a name and ID.
 * 
 * @param {string} name - The name of the object.
 * @param {number} id - The ID of the object
 * @class
 */
  constructor(name: string, id: number) {
    this.name = name
    this.id = id
  }
}

/**
  * Retrieves the admin user object.
  * @returns {User} The admin user object.
  */
/**
   * Returns a User object representing an admin user.
   * @returns {User} - The admin User object.
   * @remarks This function creates a new UserAccount object with the name "Murphy" and id "1".
   */
/**
  * Returns an instance of the User class representing an admin user with the following properties:
  * @returns {User} - An instance of the User class representing an admin user.
  * @remarks - The returned admin user instance is generated using the UserAccount class with the parameters 'Murphy' and 1.
  */
/**
   * Returns a User object representing an admin user.
   * @returns {User} - Object of type User.
   * @remarks - This function always returns a User object of type User with admin privileges.
   */
/**
  * Returns an instance of User with the object type {User}.
  * 
  * @returns {User} an instance of User
  * 
  * @remarks This function creates a new UserAccount instance with the name 'Murphy' and ID 1.
  */
/**
  * Retrieves the admin user.
  * @returns {User} The admin user object.
  */
export function getAdminUser(): User {
  return new UserAccount('Murphy', 1)
}

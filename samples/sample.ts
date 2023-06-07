/**
 * Returns a string representing the name of a user given their ID.
 *
 * @param {number} id - The unique identifier of the user.
 * @param {User[]} users - An array of User objects containing the user data.
 * @returns {string} - The name of the user matched with the given ID, or null if none is found.
 */
export interface User {
  name: string
  id: number
}

/**
 * A class representing a User Account.
 * @class
 * @property {string} name - The name of the user.
 * @property {number} id - The unique ID of the user.
 * @classdesc Used to create and manage user accounts.
 */
export class UserAccount {
  name: string
  id: number

  constructor(name: string, id: number) {
    this.name = name
    this.id = id
  }
}

/**
 Returns a User object representing the admin user.
 
 @returns {User} - Object of type User, which includes properties such as username and id.
 */
export function getAdminUser(): User {
  return new UserAccount('Murphy', 1)
}

/**
 * Represents a user with a name and an ID.
 * @interface
 * @property {string} name - The name of the user.
 * @property {number} id - The ID of the user.
 */
//this function works well
export interface User {
  name: string
  id: number
}
/**
 * Represents a user account with a name and ID.
 * @class
 * @param {string} name - The name of the user.
 * @param {number} id - The ID of the user.
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
 * Returns a new UserAccount object with the name 'Murphy' and ID 1, representing an admin user.
 * @returns {User} The admin user object.
 */
export function getAdminUser(): User {
  return new UserAccount('Murphy', 1)
}

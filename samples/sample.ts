export interface User {
  name: string
  id: number
}

/**
 * Represents a user account with a name and ID.
 * @class
 * @param {string} name - The name of the user.
 * @param {number} id - The unique ID of the user.
 */
export class UserAccount {
  name: string
  id: number

/**
 * Constructor function for creating an instance of a class with a name and ID.
 * 
 * @param {string} name - The name of the instance being created.
 * @param {number} id - The ID of the instance being created.
 */
  constructor(name: string, id: number) {
    this.name = name
    this.id = id
  }
}

/**
 * Retrieves the admin user.
 * 
 * @returns {User} - The admin user as a User object.
 */
export function getAdminUser(): User {
  return new UserAccount('Murphy', 1)
}

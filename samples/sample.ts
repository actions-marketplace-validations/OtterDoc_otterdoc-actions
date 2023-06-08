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

export function getAdminUser(): User {
  return new UserAccount('Murphy', 1)
}

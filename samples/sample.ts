/**
export interface User {
  name: string
  id: number
}

/**
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
export function getAdminUser(): User {
  return new UserAccount('Murphy', 1)
}

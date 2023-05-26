

export interface User {
  name: string
  id: number
}

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

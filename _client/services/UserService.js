const url = 'http://localhost:4000/users';

export default class UserService {
  static fetchUsers() {
    return fetch(url);
  }
}

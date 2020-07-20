const url = 'http://localhost:5000/users';

export default class UserService {
  static fetchUsers() {
    return fetch(url);
  }
}

const url = 'http://localhost:5000/api/users';

export default class UserService {
  static fetchUsers() {
    return fetch(url);
  }
}

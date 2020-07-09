const person = {
  name: 'Kim',
  sayHi() {
    return `Hi! My name is ${this.name}`;
  }
};

const anotherPerson = {
  name: 'Park'
};

anotherPerson.sayHi = person.sayHi;

console.log(anotherPerson.sayHi());

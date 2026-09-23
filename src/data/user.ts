import { faker } from '@faker-js/faker';
import { randomUUID } from 'node:crypto';
import { environment } from '../../config/environment';

export type UserData = {
  name: string;
  email: string;
  password: string;
  title: string;
  birth_date: string;
  birth_month: string;
  birth_year: string;
  firstname: string;
  lastname: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  zipcode: string;
  state: string;
  city: string;
  mobile_number: string;
};

export function createUser(): UserData {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    name: `${firstName} ${lastName}`,
    email: `test-${randomUUID()}@example.com`,
    password: environment.password,
    title: 'Mr',
    birth_date: '10',
    birth_month: '5',
    birth_year: '1990',
    firstname: firstName,
    lastname: lastName,
    company: faker.company.name(),
    address1: faker.location.streetAddress(),
    address2: '',
    country: 'New Zealand',
    zipcode: faker.location.zipCode(),
    state: 'Auckland',
    city: 'Auckland',
    mobile_number: faker.phone.number(),
  };
}

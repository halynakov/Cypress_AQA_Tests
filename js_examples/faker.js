const { faker } = require('@faker-js/faker');

function generateFakeArticle() {
    return {
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        tags: [
            faker.word.adjective(),
            faker.word.adjective(),
            faker.word.adjective()
        ]
    };
}

const article = generateFakeArticle();
console.log('title =', article.title);
console.log('description =', article.description);
for (const tag of article.tags) {
    console.log('tag =', tag);
}

function generateFakeUser() {
    return {
        id: faker.datatype.uuid(),
        email: faker.internet.email(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        about: faker.lorem.sentence(),
        job: faker.name.jobTitle(),
        company: faker.company.name(),
        address: {
            avatar: faker.image.avatar(),
            country: faker.address.country(),
            city: faker.address.city(),
            street: faker.address.street(),
            zipCode: faker.address.zipCode()
        }
    };
}

for (let i = 0; i <= 5; i++) {
    console.log(generateFakeUser());
}
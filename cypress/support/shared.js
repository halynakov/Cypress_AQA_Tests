import meUser from '/cypress/fixtures/me-user.json';
import { faker } from '@faker-js/faker';

export function login() {

    cy.get('@appHeader').find('a[href$="/login"]').click();
    cy.url().should('include', '/#/login');

    cy.get('.auth-page').should('be.visible').as('loginPage');
    cy.get('@loginPage').find('h1').should('have.text', 'Sign in');
    cy.get('@loginPage').find('form').should('be.visible').as('loginForm');

    cy.get('@loginForm').find('input[ng-model$=email]').type(meUser.email);
    cy.get('@loginForm').find('input[ng-model$=password]').type(meUser.password);
    cy.get('@loginForm').find('button[type=submit]').click();

    cy.get('@appHeader').should('contain.text', meUser.username);

}

export function generateFakeArticle() {

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

export function addArticle() {
    cy.get('@appHeader').find('a[href$="/editor/"]').click();
    cy.url().should('include', '/#/editor/');

    cy.get('.editor-page').as('addArticlePage');

    cy.get('@addArticlePage').find('form').should('be.visible').as('addArticleForm').as('editArticleForm');;

    const article = fillArticle();
    cy.get('@addArticleForm').find('button[type=button]').click();

    cy.get('.article-page').should('be.visible');

    return article;
}

export function openMyArticles() {

    cy.get('@appHeader').contains('a', meUser.username).click();
    cy.url().should('include', meUser.username);

    cy.get('.articles-toggle > ul > li:first-child a').should('have.class', 'active');

}

export function openMyArticle(article) {
    openMyArticles();

    cy.get('article-list').should('be.visible').as('myArticles').wait(2000);

    cy.get('@myArticles').contains(article.title).parents('article-preview').find('a.preview-link').click();
}

export function clearArticle() {

    cy.get('@editArticleForm').find('input[ng-model$=title]').clear();
    cy.get('@editArticleForm').find('input[ng-model$=description]').clear();
    cy.get('@editArticleForm').find('textarea[ng-model$=body]').clear();
    cy.get('@editArticleForm').find('input[ng-model$=tagField]').clear();

    cy.get('.tag-list .tag-default').each((tag) => cy.wrap(tag).find('[ng-click*=remove]').click());

}

export function fillArticle() {
    const article = generateFakeArticle();

    cy.get('@addArticleForm').find('input[ng-model$=title]').type(article.title);
    cy.get('@addArticleForm').find('input[ng-model$=description]').type(article.description);
    cy.get('@addArticleForm').find('input[ng-model$=tagField]').as('articleTagInput');
    for (const tag of article.tags) {
        cy.get('@articleTagInput').type(tag).type('{enter}');
    }

   const body = `I like cleaning!
   It is **easy** and *quickly.*
   My favorite vacuum cleaners are:
   * Xiaome Lite 56YR
   * Phillips 34UIU
   * Bosh 405wq`;
   cy.get('@addArticleForm').find('textarea[ng-model$=body]').type(body);

   return article;
}

export function checkArticle(article) {
    cy.get('@articlePage').find('h1').should('contains.text', article.title);

        cy.get('@articlePage').find('.tag-list').as('articleTags');
        for (const tag of article.tags) {
            cy.get('@articleTags').should('contain.text', tag);
        }

        // check Markdown is rendered to HTML
        cy.get('@articlePage').find('[ng-bind-html$=body]')
            .should('contain.html', '<strong>easy</strong>')
            .should('contain.html', '<em>quickly.</em>')
            .should('contain.html', '<li>Bosh 405wq</li>');
}

export function setJwtToken(window, token) {
    window.localStorage.setItem('jwtToken', token);
}
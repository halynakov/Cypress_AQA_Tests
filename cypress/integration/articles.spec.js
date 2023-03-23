///<reference types="cypress" />
import { login, addArticle, openMyArticles, clearArticle, openMyArticle, checkArticle, fillArticle } from '/cypress/support/shared';

describe('Articles', () => {

    beforeEach(() => {
        cy.visit('/');
        cy.get('.navbar').should('be.visible').as('appHeader');
        login();
    });

    it('should do publish article', () => {

        const article = addArticle();
        cy.get('.article-page').should('be.visible').as('articlePage');

        checkArticle(article);
    });

    it('should do delete article', () => {

        const article = addArticle();
        openMyArticle(article);

        cy.get('.article-actions span:not(.ng-hide) button').click();

        cy.url().should('eq', 'https://demo.realworld.io/#/');

        openMyArticles();

        cy.get('@myArticles').contains(article.title).should('have.length', 0);
    });

    it('should do edit article', () => {

        const article = addArticle();
        openMyArticles();

        openMyArticle(article);

        cy.get('.article-actions a[href*="#/editor"]').click();
        cy.get('.editor-page').as('editArticlePage');
        cy.get('@editArticlePage').find('form').should('be.visible').as('addArticleForm');

        clearArticle();
       
        const newArticle = fillArticle();

        cy.get('@editArticlePage').find('button[type=button]').click();

        cy.get('.article-page').should('be.visible').as('articlePage');

        checkArticle(newArticle);
    });

});
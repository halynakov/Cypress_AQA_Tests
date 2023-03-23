///<reference types="cypress" />
import { getRandomNumber } from '/cypress/support/utils';

describe('Global articles feed', () => {

    beforeEach(() => {
        cy.visit('/');
        cy.get('.navbar').should('be.visible').as('appHeader');
        cy.get('article-list').as('articlesList');
    });

    it('should do display article list', () => {

        cy.get('@articlesList').find('article-preview').should('have.length', 10).each(article => {
            cy.wrap(article).within(() => {
                cy.get('article-meta').within(() => {
                    cy.get('.date').should('be.visible');
                    cy.get('a[ui-sref*=profile] img').should('be.visible');
                    cy.get('.author').should('be.visible');
                    cy.get('favorite-btn').invoke('text').invoke('trim').should('match', /^[0-9]+$/) 
                });
                cy.get('h1').should('be.visible')
                cy.get('[ng-bind*=description]').should('be.visible');
                cy.get('.tag-list li').should('have.length.greaterThan', 0);
            });
        });
    });

    it('should do open article page', () => {
        cy.get('.feed-toggle ul > li:nth-child(2) a').should('have.class', 'active');
        cy.get('@articlesList').contains('.article-preview', 'Loading').should('not.be.visible');
        const rand = getRandomNumber(0, 9);
        cy.get('@articlesList').find('article-preview').should('have.length', 10).eq(rand).as('randomArticle');

        cy.get('@randomArticle').find('h1').invoke('text').invoke('trim').as('randomArticleTitle');

        cy.get('@randomArticle').find('a.preview-link').click();

        cy.location('hash').should('contain', '#/article/');

        cy.get('@randomArticleTitle').then(title => {
            cy.get('.article-page h1').invoke('text').invoke('trim').should('eq', title);
        });

    });

});
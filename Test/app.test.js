'use strict';
const expect = require('chai').expect;
const request = require('supertest');
const app = require('../app');
const data = require('../data');

/* eslint-disable no-unused-expressions */

describe('GET /apps', () => {
  it('returns json', () => {
    return request(app)
      .get('/apps')
      .expect('Content-Type', /json/)
      .expect(200);
  });

  it('returns the whole dataset with NO query params', () => {
    return request(app)
      .get('/apps')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(res => {
        expect(res.body).to.deep.eql(data);
      });
  });

  it('throws an error if the given genre is not supported', () => {
    return request(app)
      .get('/apps')
      .query({genres: 'foo'})
      .expect(400)
      .then(res => {
        const errorMsg = 'genres must be of Action, Puzzle, Strategy, Casual, Arcade or Card';
        expect(res.text).to.equal(errorMsg);
      });
  });

  it('filters the data by genres', () => {
    return request(app)
      .get('/apps')
      .query({genres: 'Card'})
      .expect(200)
      .then(res => {
        const actual = res.body.map(result => result['Genres']);
        actual.forEach(result => expect(result).to.equal('Card'));
      });
  });

  it('capitalizes the query params', () => {
    return request(app)
      .get('/apps')
      .query({genres: 'caRD', sort: 'rAtinG'})
      .expect(200);
  });

  it('returns an error if sort is not of "Rating" or "App"', () => {
    return request(app)
      .get('/apps')
      .query({sort: 'foo'})
      .expect(400)
      .then(res => {
        expect(res.text).to.equal('sort must be of Rating or App');
      });
  });

  //10, 9, 9, 8, 7
  it('sorts by Rating in desc order', () => {
    return request(app)
      .get('/apps')
      .query({sort: 'Rating'})
      .expect(200)
      .then(res => {
        const actual = res.body.map(item => Number(item.Rating));
        for(let i=1; i<actual.length; i++) {
          expect(actual[i]).to.not.be.above(actual[i-1]);
        }
      });
  });

  it('sorts by App title in asc order', () => {
    return request(app)
      .get('/apps')
      .query({sort: 'App'})
      .expect(200)
      .then(res => {
        const actual = res.body.map(item => item.App.toLowerCase());
        for(let i=0; i<actual.length-1; i++){
          let outcome = actual[i] < actual[i+1];
          expect(outcome).to.be.true;
        }
      });
  });

});
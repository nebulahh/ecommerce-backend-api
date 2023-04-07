import request from 'supertest';

import app from '../app';

describe('GET /api/v1/products', () => {
  it('responds with an array product', async () => 
    request(app)
      .get('/api/v1/products')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('length');
        expect(response.body.length).toBe(1);
        expect(response.body[0]).toHaveProperty('title');
        expect(response.body[0]).toHaveProperty('price');
        expect(response.body[0]).toHaveProperty('summary');
        expect(response.body[0]).toHaveProperty('image');
      }),
  );
});

import request from 'supertest';

import app from '../app';

describe('POST /api/v1/signup', () => {
  it('responds with user object', async () => 
    request(app)
      .post('/api/v1/signup')
      .type('form')
      .send({
        'name': 'leon',
        'email': 'leonmailcom',
        'password': '1234567',
        'confirmPassword': '1234567',
      })
      .then(() => {
        request(app)
          .get('/api/v1/signup')
          .expect({
            'name': 'leon',
            'email': 'leonmailcom',
            'password': '1234567',
          });
      }),
  );
});

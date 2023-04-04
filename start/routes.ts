/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route';

Route.get('/', async () => {
  return { hello: 'world' };
});

const testRoute = () => {
  Route.get('/', async ({ auth }) => {
    const user = await auth.authenticate();
    await user.load('bands');
    return { user: user.serialize() };
  });
};

const bandRoutes = () => {
  Route.post('/', 'BandsController.create').middleware('auth:api');
  Route.group(() => {
    Route.get('/:id', 'BandsController.read');
    Route.put('/:id', 'BandsController.update');
    Route.delete('/:id', 'BandsController.delete');
  })
    .middleware('auth:api')
    .middleware('bandMember');
};

Route.group(() => {
  // test
  Route.group(testRoute).middleware('auth:api');

  // login - register
  Route.post('register', 'AuthController.register');
  Route.post('login', 'AuthController.login');

  // band
  Route.group(bandRoutes).prefix('band');
}).prefix('api');

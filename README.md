# Twitter clone logic

Twitter clone created with NuxtJS, Express and MongoDB in which the user can create tweets, read other users' tweets, follow and be followed by friends. You can also react to posts and see which ones are trending.

## 🚀 Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:4000
$ npm run dev

# launch server for production
$ npm start

# execute tests
$ npm test
```

## 📖 Frontend
- Nuxt
- Tailwind

For detailed explanation on how things work, check out the [repository](https://github.com/juan961/twitter-clone).

### Enviroment variables
In .env.example do you have an example of how your .env file looks like
- JWT_SECRET=<Secret phrase to generate JWT, it should be equal to the phrase in the backend>

## 💻 Backend
- Express
- MongoDB

For detailed explanation on how things work, check out the [repository](https://github.com/juan961/twitter-clone-logic).

### Enviroment variables
In .env.example do you have an example of how your .env file looks like
- DB_NAME=< Name Of The Database To Use In Mongo >
- DB_NAME_TEST=< Name Of The Database To Use In Mongo To Test >
- JWT_SECRET=< Secret phrase to generate JWT, it should be equal to the phrase in the frontend >

## 🚧 To Do
- Select a picture when the user post a new tweet
- Window to refresh JWT tokens
- Select who can see the tweets of the user ()
const express = require('express');
const expressGraphql = require('express-graphql').graphqlHTTP
const schema = require('./schema/schema')
const connectDB = require("./DB")

const app = express();
const PORT = 5000;

// Connect to database
connectDB();

app.use('/graphql', expressGraphql({
    graphiql: true,
    schema: schema
}))


app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))
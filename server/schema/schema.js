const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLID, GraphQLInt, GraphQLList } = require('graphql')

const Book = require('../models/Book')
const Author = require('../models/Author')

// dummy data
var books = [
    { name: 'Name of the Wind', genre: 'Fantasy', id: '1', authorId: '1' },
    { name: 'The Final Empire', genre: 'Fantasy', id: '2', authorId: '2' },
    { name: 'The Hero of Ages', genre: 'Fantasy', id: '4', authorId: '2' },
    { name: 'The Long Earth', genre: 'Sci-Fi', id: '3', authorId: '3' },
    { name: 'The Colour of Magic', genre: 'Fantasy', id: '5', authorId: '3' },
    { name: 'The Light Fantastic', genre: 'Fantasy', id: '6', authorId: '3' },
];

var authors = [
    { name: 'Patrick Rothfuss', age: 44, id: '1' },
    { name: 'Brandon Sanderson', age: 42, id: '2' },
    { name: 'Terry Pratchett', age: 66, id: '3' }
];

const BookType = new GraphQLObjectType({
    name: "Book",
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        author: {
            type: AuthorType,
            resolve: async (book)=> await Author.findById(book.authorId)
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: "Author",
    fields: () => ({
        name: { type: new GraphQLNonNull(GraphQLString) },
        id: { type: new GraphQLNonNull(GraphQLID) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        books: {
            type: new GraphQLList(BookType),
            resolve: async(author)=> await Book.find({authorId: author.id})
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: () => ({
        book: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve: async(parent, args) => await Book.findById(args.id)
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve: async(parent, args)=> await Author.findById(args.id)
        },
        books: {
            type: new GraphQLList(BookType),
            resolve: async()=> await Book.find({})
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve: async()=> await Author.find({})
        }
    })
})

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: () => ({
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve: async (parent, args) => {
                const {name, age} = args
                const author = await Author.create({ name, age })
                return author
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                authorId: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve: async(parent, args) => {
                const { name, genre, authorId } = args
                const book = await Book.create({ name, genre, authorId })
                return book
            }
        }
    })
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})
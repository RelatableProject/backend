import {database, init} from './database.js';
import {ApolloServer} from "apollo-server";
import Schema from "./model/schema.js";

(async () => {
    await init();
    const apolloServer = new ApolloServer({
        ...Schema,
       /* cors: {
            origin: '*',
            methods: 'POST',
            allowedHeaders: [
                'Content-Type',
                'Origin',
                'Accept'
            ]
        },*/
    })
    let { url } = await apolloServer.listen();
    console.log(`🚀  Server ready at ${url}`);
})()



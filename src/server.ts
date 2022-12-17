import { ApolloServer } from 'apollo-server';
import { error, info, log } from 'console';
import { importSchema } from 'graphql-import';

export class server {

  server: ApolloServer;

  constructor(schemaPath: string, resolves:  ) {
    this.server = new ApolloServer({ typeDefs: importSchema(schemaPath), })
  }

  int() {
    return this.server.listen()
      .then(({ url }) => info('Running at:', url))
      .catch(err => error('ERROR:', err));
  }

}

import { diff } from '@graphql-inspector/core';
import { parse, Source } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';

const EXTRA_SCALARS_DOCUMENT = parse(`
  scalar AWSDate
  scalar AWSTime
  scalar AWSDateTime
  scalar AWSTimestamp
  scalar AWSEmail
  scalar AWSJSON
  scalar AWSURL
  scalar AWSPhone
  scalar AWSIPAddress
  scalar BigInt
  scalar Double
  `);

const EXTRA_DIRECTIVES_DOCUMENT = parse(`
  directive @aws_subscribe(mutations: [String!]!) on FIELD_DEFINITION
  directive @aws_auth(cognito_groups: [String!]!) on FIELD_DEFINITION
  directive @aws_api_key on FIELD_DEFINITION | OBJECT
  directive @aws_iam on FIELD_DEFINITION | OBJECT
  directive @aws_oidc on FIELD_DEFINITION | OBJECT
  directive @aws_cognito_user_pools(cognito_groups: [String!]) on FIELD_DEFINITION | OBJECT
  directive @aws_lambda on FIELD_DEFINITION | OBJECT

  # Allows transformer libraries to deprecate directive arguments.
  directive @deprecated(reason: String) on FIELD_DEFINITION | INPUT_FIELD_DEFINITION | ENUM | ENUM_VALUE
  `);

export const getDifference = async (currentDeploymentSchema: string | Source, nextDeploymentSchema: string | Source): Promise<any> => {
  const difference = await diff(
    makeExecutableSchema({ typeDefs: [EXTRA_DIRECTIVES_DOCUMENT, EXTRA_SCALARS_DOCUMENT, parse(currentDeploymentSchema)] }), 
    makeExecutableSchema({ typeDefs: [EXTRA_DIRECTIVES_DOCUMENT, EXTRA_SCALARS_DOCUMENT, parse(nextDeploymentSchema)] }),
  );
  return difference;
};

export const exampleCurrentSchema = `
  type Todo {
    id: ID!
    title: String
    description: String
    status: TodoStatus
  }

  enum TodoStatus {
    STARTED
    PENDING
    INPROGRESS
  }
`;

export const exampleNextSchema = `
  type Todo {
    id: ID!
    title: String
    status: TodoStatus
  }

  enum TodoStatus {
    STARTED
    PENDING
    IN_PROGRESS
  }

  type Person {
    id: ID!
    firstName: String
    lastName: String
  }
`;

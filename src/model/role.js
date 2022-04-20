import {database} from "../database.js";
import {DataTypes} from "sequelize";
import {gql} from "apollo-server";
import {getMutations, getQuerys} from "../utils/modelUtils.js";


const model = database.define('Role', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isStudent: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    isTeacher: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    isAdministrative: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
}, {
    tableName: 'Roles',
    timestamps: false
});

const typeDefs = gql`
    type Role {
        id: Int!
        name: String!
        isStudent: Boolean!
        isTeacher: Boolean!
        isAdministrative: Boolean!
    }

    extend type Query {
        roles: [Role]
        role(id: Int!): Role
    }

    extend type Mutation {
        createRole(name: String!, isStudent: Boolean!, isTeacher: Boolean!, isAdministrative: Boolean!): Role
        updateRole(id: Int!, name: String, isStudent: Boolean, isTeacher: Boolean, isAdministrative: Boolean): Role
        deleteRole(id: Int!): Role
    }
`

const resolvers = {
   Query: {
      ...getQuerys(model),
   },
   Mutation: {
      ...getMutations(model),
   },
};


export default { model, typeDefs, resolvers };

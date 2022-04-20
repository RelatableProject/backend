import {database} from "../database.js";
import {DataTypes} from "sequelize";
import {gql} from "apollo-server";
import { getQuerys, getMutations, getDefaultResolver, getRelations } from "../utils/modelUtils.js";


const model = database.define('Gender', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isMale: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    isFemale: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
}, {
    tableName: 'Genders',
    timestamps: true
});

const include = [

];

const typeDefs = gql`
    type Gender {
        id: Int!
        name: String!
        isMale: Boolean!
        isFemale: Boolean!
    }

    extend type Query {
        gender(id: Int!): Gender
        genders: [Gender]
    }

    extend type Mutation {
        createGender(name: String!, isMale: Boolean!, isFemale: Boolean!): Address
        updateGender(id: Int!, name: String, isMale: Boolean, isFemale: Boolean): Address
        deleteGender(id: Int!): Address
    }
`

const resolvers = {
   Query: {
      ...getQuerys(model),
   },
   Mutation: {
      ...getMutations(model),
   },
   Gender: {
      ...getRelations(model, include)
   }
};


export default { model, typeDefs, resolvers };

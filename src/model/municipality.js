import {database} from "../database.js";
import {DataTypes} from "sequelize";
import {gql} from "apollo-server";
import {getMutations, getQuerys,} from "../utils/modelUtils.js";


const model = database.define('Municipality', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
}, {
    tableName: 'Municipalities',
    timestamps: true
});

const typeDefs = gql`
    type Municipality {
        id: Int!
        name: String!
        isActive: Boolean!
    }

    extend type Query {
        municipality(id: Int!): Municipality
        municipalities: [Municipality]
    }

    extend type Mutation {
        createMunicipality(name: String!, isActive: Boolean!): Municipality
        updateMunicipality(id: Int!, name: String, isActive: Boolean): Municipality
        deleteMunicipality(id: Int!): Municipality
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

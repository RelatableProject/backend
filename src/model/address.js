import {database} from "../database.js";
import {DataTypes} from "sequelize";
import {gql} from "apollo-server";
import { getQuerys, getMutations, getDefaultResolver, getRelations } from "../utils/modelUtils.js";
import Municipality from "./municipality.js";


const model = database.define('Address', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Neighborhood: {
        type: DataTypes.STRING,
        allowNull: false
    },

}, {
    tableName: 'Addresses',
    timestamps: true
});

const include = [
    model.belongsTo(Municipality.model, {as: 'municipality', onDelete: 'CASCADE', onUpdate: 'CASCADE', foreignKey: {allowNull: false, name: 'municipalityId', field: 'municipalityId'}}),

];

const typeDefs = gql`
    type Address {
        id: Int!
        Neighborhood: String!
        municipality: Municipality!
        customer: Customer
    }

    extend type Query {
        address(id: Int!): Address
        addresses: [Address]
    }
    
    input AddressInput {
        Neighborhood: String!
        municipalityId: Int!
    }

    extend type Mutation {
        createAddress(Neighborhood: String!, municipalityId: Int!): Address
        updateAddress(id: Int!, Neighborhood: String, municipalityId: Int): Address
        deleteAddress(id: Int!): Address
    }
`

const resolvers = {
   Query: {
      ...getQuerys(model),
   },
   Mutation: {
      ...getMutations(model),
   },
   Address: {
      ...getRelations(model, include),
       customer: async (root) => await root.getCustomer(),
   }
};


export default { model, typeDefs, resolvers };

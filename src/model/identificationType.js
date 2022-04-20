import {database} from "../database.js";
import {DataTypes} from "sequelize";
import {gql} from "apollo-server";
import {getMutations, getQuerys,} from "../utils/modelUtils.js";


const model = database.define('IdentificationType', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isCedula: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    isTarjetaIdentidad: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    isCedulaExtranjeria: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
}, {
    tableName: 'IdentificationTypes',
    timestamps: false
});


const typeDefs = gql`
    type IdentificationType {
        id: Int!
        name: String!
        isCedula: Boolean!
        isTarjetaIdentidad: Boolean!
        isCedulaExtranjeria: Boolean!
    }
    
    extend type Query {
        identificationTypes: [IdentificationType],
        identificationType(id: Int!): IdentificationType
    }
    
    extend type Mutation {
        createIdentificationType(name: String!, isCedula: Boolean!, isTarjetaIdentidad: Boolean!, isCedulaExtranjeria: Boolean!): IdentificationType
        updateIdentificationType(id: Int!, name: String, isCedula: Boolean, isTarjetaIdentidad: Boolean, isCedulaExtranjeria: Boolean): IdentificationType
        deleteIdentificationType(id: Int!): IdentificationType
    }
`

const resolvers = {
   Query: {
      ...getQuerys(model, ),
   },
   Mutation: {
      ...getMutations(model, ),
   },
};


export default { model, typeDefs, resolvers };

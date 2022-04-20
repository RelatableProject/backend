import {database} from "../database.js";
import {DataTypes} from "sequelize";
import {gql} from "apollo-server";
import {getQuerys, getMutations, getDefaultResolver} from "../utils/modelUtils.js";

const model = database.define("InstitutionType", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isSchool: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    isUniversity: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
}, {
    timestamps: false,
    tableName: "InstitutionTypes"
});

const typeDefs = gql`

    scalar Date

    type InstitutionType {
        id: Int!
        name: String!
        isSchool: Boolean!
        isUniversity: Boolean!
    }
    
    type Query {
        institutionTypes: [InstitutionType]
        institutionType(id: Int!): InstitutionType
    }
    
    type Mutation {
        createInstitutionType(name: String!, isSchool: Boolean!, isUniversity: Boolean!): InstitutionType
        updateInstitutionType(id: Int!, name: String, isSchool: Boolean, isUniversity: Boolean): InstitutionType
        deleteInstitutionType(id: Int!): InstitutionType
    }
`;

const resolvers = getDefaultResolver(model);

export default {model, typeDefs, resolvers};


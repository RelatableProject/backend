import {database} from "../database.js";
import {DataTypes} from "sequelize";
import {gql} from "apollo-server";
import { getQuerys, getMutations, getDefaultResolver, getRelations } from "../utils/modelUtils.js";


const model = database.define('EducationLevel', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isPreschool: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    isPrimary: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    isSecondary: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    isTechnical: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    isTechnologist: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    isProfessional: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    isSpecialized: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
}, {
    tableName: 'EducationLevels',
    timestamps: true
});

const include = [

];

const typeDefs = gql`
    type EducationLevel {
        id: Int!
        name: String!
        isPreschool: Boolean!
        isPrimary: Boolean!
        isSecondary: Boolean!
        isTechnical: Boolean!
        isTechnologist: Boolean!
        isProfessional: Boolean!
        isSpecialized: Boolean!
    }
    
    extend type Query {
        educationLevels: [EducationLevel]
        educationLevel(id: Int!): EducationLevel
    }
    
    extend type Mutation {
        createEducationLevel(name: String!, isPreschool: Boolean, isPrimary: Boolean, isSecondary: Boolean, isTechnical: Boolean, isTechnologist: Boolean, isProfessional: Boolean, isSpecialized: Boolean): EducationLevel
        updateEducationLevel(id: Int!, name: String, isPreschool: Boolean, isPrimary: Boolean, isSecondary: Boolean, isTechnical: Boolean, isTechnologist: Boolean, isProfessional: Boolean, isSpecialized: Boolean): EducationLevel
        deleteEducationLevel(id: Int!): Boolean
    }
`

const resolvers = {
   Query: {
      ...getQuerys(model),
   },
   Mutation: {
      ...getMutations(model),
   },
   EducationLevel: {
      ...getRelations(model, include)
   }
};


export default { model, typeDefs, resolvers };

import {database} from "../database.js";
import {DataTypes} from "sequelize";
import {gql} from "apollo-server";
import {getMutations, getQuerys, getRelations,} from "../utils/modelUtils.js";
import Institution from "./institution.js";


const model = database.define('Program', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isMedicine: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    isDentistry: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    isLaws: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
}, {
    tableName: 'Programs',
    timestamps: true
});




const typeDefs = gql`
    type Program {
        id: Int!
        name: String!
        isMedicine: Boolean!
        isDentistry: Boolean!
        isLaws: Boolean!
        isActive: Boolean!
        institution: Institution!
    }
    
    extend type Query {
        program(id: Int!): Program
        programs: [Program]
        programsByInstitution(institutionId: Int!): [Program]
    }
    
    extend type Mutation {
        createProgram(name: String!, isMedicine: Boolean!, isDentistry: Boolean!, isLaws: Boolean!, isActive: Boolean!, institutionId: Int!): Program
        updateProgram(id: Int!, name: String, isMedicine: Boolean, isDentistry: Boolean, isLaws: Boolean, isActive: Boolean, institutionId: Int): Program
        deleteProgram(id: Int!): Program
    }
`

const resolvers = {
    Query: {
        ...getQuerys(model),
        programsByInstitution: async (_, {institutionId}) => await model.findAll({where: {institutionId}})
    },
    Mutation: {
        ...getMutations(model),
    },
    Program: {
        ...getRelations(model, [
            model.belongsTo(Institution.model, {
                as: 'institution',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
                foreignKey: {allowNull: false, name: 'institutionId', field: 'institutionId'}
            })
        ])
    }
};


export default { model, typeDefs, resolvers };

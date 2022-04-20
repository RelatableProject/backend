import {database} from "../database.js";
import {DataTypes} from "sequelize";
import {gql} from "apollo-server";
import {getMutations, getQuerys, getRelations} from "../utils/modelUtils.js";
import InstitutionType from "./institutionType.js";


const model = database.define('Institution', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    tableName: 'Institutions',
    timestamps: true
});


const typeDefs = gql`
    type Institution {
        id: Int!
        name: String!
        type: InstitutionType!
    }
    
    extend type Query {
        institutions: [Institution]
        institution(id: Int!): Institution
    }
    
    extend type Mutation {
        createInstitution(name: String!, typeId: Int!): Institution
        updateInstitution(id: Int!, name: String, typeId: Int): Institution
        deleteInstitution(id: Int!): Institution
    }
`

const resolvers = {
    Query: {
        ...getQuerys(model,),
    },
    Mutation: {
        ...getMutations(model,),
    },
    Institution: {
        ...getRelations(model, [
            model.belongsTo(InstitutionType.model, {
                as: 'type',
                onDelete: 'RESTRICT',
                onUpdate: 'CASCADE',
                foreignKey: {allowNull: false, name: 'typeId', field: 'typeId'}
            })
        ])
    }
};


export default { model, typeDefs, resolvers };

import {database} from "../database.js";
import {DataTypes} from "sequelize";
import {gql} from "apollo-server";
import {getMutations, getQuerys, getRelations,} from "../utils/modelUtils.js";
import Program from "./program.js";


const model = database.define('StudentDetail', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },    
    semesterNumber: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    tableName: 'StudentDetails',
    timestamps: true
});

const typeDefs = gql` 
    type StudentDetail {
        id: Int!
        semesterNumber: Int!
        program: Program!
    }
    
    input StudentDetailInput {
        semesterNumber: Int!
        programId: Int!
    }
    
    extend type Query {
        studentDetails: [StudentDetail]
        studentDetail(id: Int!): StudentDetail
    }
    extend type Mutation {
        createStudentDetail(semesterNumber: Int!, programId: Int!): StudentDetail
        updateStudentDetail(id: Int!, semesterNumber: Int!, programId: Int!): StudentDetail
        deleteStudentDetail(id: Int!): StudentDetail
    }
`

const resolvers = {
    Query: {
        ...getQuerys(model,),
    },
    Mutation: {
        ...getMutations(model),
    },
    StudentDetail: {
        ...getRelations(model, [
            model.belongsTo(Program.model, {
                as: 'program',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
                foreignKey: {allowNull: false, name: 'programId', field: 'programId'}
            })
        ])
    }
};


export default { model, typeDefs, resolvers };
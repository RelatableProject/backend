import {database} from "../database.js";
import {DataTypes} from "sequelize";
import {gql} from "apollo-server";
import {getMutations, getQuerys, getRelations,} from "../utils/modelUtils.js";
import Municipality from "./municipality.js";
import User from "./user.js";


const model = database.define('Project', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isOpen: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    isFreeConsumers: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
}, {
    tableName: 'Projects',
    timestamps: true
});

const typeDefs = gql` 
    type Project {
        id: Int!
        name: String!
        isOpen: Boolean!
        isFreeConsumers: Boolean!
        isActive: Boolean!
        municipality: Municipality!
        userManager: User!
        projectBases: [Project]!
        customers: [Customer]!
    }
    extend type Query {
        projects: [Project]
        project(id: Int!): Project
        projectBases(id: Int!): [Project]
    }
    extend type Mutation {
        createProject(name: String!, isOpen: Boolean!, isFreeConsumers: Boolean!, isActive: Boolean!, municipalityId: Int!, userManagerId: Int!, projectBasesIds: [Int!]): Project!
        updateProject(id: Int!, name: String, isOpen: Boolean, isFreeConsumers: Boolean, isActive: Boolean, municipalityId: Int, userManagerId: Int, projectBasesIds: [Int!]): Project!
        deleteProject(id: Int!): Project!
    }
`;

const resolvers = {
   Query: {
       ...getQuerys(model,),
       projectBases: async (_, args) => {
           const project = await model.findByPk(args.id);
           return await project.getProjectBases();
       }
   },
   Mutation: {
       ...getMutations(model,),
       createProject: async (_, args) => {
           const project = await model.create(args);
           if (args.projectBasesIds) {
               await project.setProjectBases(args.projectBasesIds);
           }
           return project;
       },
       updateProject: async (_, args) => {
           const project = await model.findByPk(args.id);
           if (args.projectBasesIds) {
               await project.setProjectBases(args.projectBasesIds);
           }
           await model.update(args, {where: {id: args.id}});
           return await model.findByPk(args.id);
       },
   },
    Project: {
        ...getRelations(model, [
            model.belongsTo(Municipality.model, {
                as: 'municipality',
                onDelete: 'RESTRICT',
                onUpdate: 'CASCADE',
                foreignKey: {allowNull: false, name: 'municipalityId', field: 'municipalityId'}
            }),
            model.belongsTo(User.model, {
                as: 'userManager',
                onDelete: 'RESTRICT',
                onUpdate: 'CASCADE',
                foreignKey: {allowNull: false, name: 'userManagerId', field: 'userManagerId'}
            }),
            model.belongsToMany(model, {
                as: 'projectBases',
                through: 'ProjectBases',
                foreignKey: {name: 'projectId', field: 'projectId'},
                otherKey: {name: 'project2Id', field: 'project2Id'}
            }),
        ]),
        customers: async (project) => await project.getCustomers()
    }
};


export default { model, typeDefs, resolvers };

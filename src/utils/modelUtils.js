export const getMutations = (model, include) => {
    const obj = {};
    obj["create" + model.name] = async (_, args) => await model.create(args);
    obj["update" + model.name] = async (_, args) => {
        await model.update(args, {where: {id: args.id}});
        return await model.findByPk(args.id, {include});
    };
    obj["delete" + model.name] = async (_, args) => {
       const search = await model.findByPk(args.id);
       await model.destroy({where: {id: args.id}});
       return search;
    }
    return obj;
}

export const getQuerys = (model, include) => {
    const obj = {};
    let tableName = model.tableName.charAt(0).toLowerCase() + model.tableName.slice(1);
    let name = model.name.charAt(0).toLowerCase() + model.name.slice(1);
    obj[tableName] = async () => await model.findAll({include});
    obj[name] = async (parent, {id}) => await model.findByPk(id, {include});
    return obj;
}

export const getDefaultResolver = (model, include) => ({
        Query: getQuerys(model, include),
        Mutation: getMutations(model, include)
});

export const getRelations = (model, include) => {
    const obj = {};
    include.forEach(({as}) => {
        const nameFn = "get" + as.charAt(0).toUpperCase() + as.slice(1);
        obj[as] = async (root) => await root[nameFn]()
    });
    return obj;
}

export const getAge = (dateString) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

export class forAsync {
}

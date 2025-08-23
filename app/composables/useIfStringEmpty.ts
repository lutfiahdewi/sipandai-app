export default (param:string | null | undefined) => {
    if(param?.length === 0 || param === null || param === undefined) return null;
    return param
}
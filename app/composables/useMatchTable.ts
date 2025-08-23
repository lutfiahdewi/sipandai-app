export default (targetTable: "subcategories1" | "subcategories2" | "subcategories3") => {
    if (targetTable == "subcategories1") return "category_id"
    if (targetTable == "subcategories2") return "subcategory1_id"
    if (targetTable == "subcategories3") return "subcategory2_id"
    return '';
}
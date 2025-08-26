// composables/useNavigation.ts
/**
 * For saving the slug of chosen category and subcategory 1 2 3
 * don't set the position if just wanna get some variable
 * 1. Set the category/subcat
 * 2. if it's jumped from the deeper page, the erased the deeper page
 * 3. So always clear the deeper ones
 * @returns 
 */
export const useNavigation = (position?: "category" | "subcategory1" | "subcategory2" | "subcategory3" ) => {
  const category = useCookie<string | null>('category')
  const subcat1 = useCookie<string | null>('subcat1')
  const subcat2 = useCookie<string | null>('subcat2')
  const subcat3 = useCookie<string | null>('subcat3')
  if(position==="category"){
    subcat1.value = null
    subcat2.value = null
    subcat3.value = null
  }else if(position==="subcategory1"){
    subcat2.value = null
    subcat3.value = null
  }else if(position==="subcategory2"){
    subcat3.value = null
  } 

  return { category, subcat1, subcat2, subcat3 }
}

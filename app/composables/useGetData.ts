// selector = field that wanna retrieved 
const supabase = useSupabaseClient();
export async function name(table : string, selector?:string) {
    const { data, error } = await supabase
      .from(table)
      .select(selector ?? '*');
    return {data, error};
}
import * as yup from 'yup'
import Subcategory1 from '~/pages/admin/subcategory1.vue';
const baseSchema =  yup.object({
  name: yup.string().required("Nama harus diisi"),
  description: yup.string().nullable(),
  icon: yup.mixed().nullable(),
  photo: yup.mixed().nullable(),
});

export const categorySchema = yup.object({
  name: yup.string().required("Nama harus diisi"),
  description: yup.string().nullable(),
  icon: yup.mixed().nullable(),
  photo: yup.mixed().nullable(),
});

export const documentSchema = yup.object({
  name: yup.string().required("Nama harus diisi"),
  url: yup.string().required("URL harus diisi"),
  description: yup.string().nullable(),
  icon: yup.mixed().nullable(),
  activity_date: yup.string().required("Isi tanggal sesuai kegiatan atau pembuatan").matches(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal tidak valid (yyyy-mm-dd)"),
  category_id: yup.string().required("Kategori harus terpilih"),
  subcategory1_id: yup.string().nullable(),
  subcategory2_id: yup.string().nullable(),
  subcategory3_id: yup.string().nullable(),
});

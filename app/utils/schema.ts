import * as yup from 'yup'

export const categorySchema = yup.object({
  name: yup.string().required("Nama harus diisi"),
  description: yup.string().nullable(),
  icon: yup.mixed().nullable(),
  photo: yup.mixed().nullable(),
});

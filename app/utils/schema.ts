import * as yup from 'yup'
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

import * as yup from 'yup'

export const categorySchema = yup.object({
  name: yup.string().required('Name is required'),
  icon_path: yup.string().nullable(),
  description: yup.string().nullable(),
  photo_path: yup.string().nullable(),
})

import type { CreateContactUsInput } from '@/types';
import Button from '@/components/ui/button';
import { Form } from '@/components/ui/forms/form';
import Input from '@/components/ui/forms/input';
import TextArea from '@/components/ui/forms/text-area';
import { useContact } from '@/framework/user';

import * as yup from 'yup';

const contactFormSchema = yup.object().shape({
  name: yup.string().required('error-name-required'),
  email: yup
    .string()
    .email('error-email-format')
    .required('error-email-required'),
  subject: yup.string().required('error-subject-required'),
  description: yup.string().required('error-description-required'),
});
const ContactForm = () => {

  const { mutate, isLoading } = useContact();

  function onSubmit(values: CreateContactUsInput) {
    mutate(values);
  }

  return (
    <Form<CreateContactUsInput>
      onSubmit={onSubmit}
      validationSchema={contactFormSchema}
    >
      {({ register, formState: { errors } }) => (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Input
              label="Name"
              {...register('name')}
              variant="outline"
              error={errors.name?.message!}
            />
            <Input
              label="Email"
              {...register('email')}
              type="email"
              variant="outline"
              error={errors.email?.message!}
            />
          </div>
          <Input
            label="Subject"
            {...register('subject')}
            variant="outline"
            className="my-6"
            error={errors.subject?.message!}
          />
          <TextArea
            label="Description"
            {...register('description')}
            variant="outline"
            className="my-6"
            error={errors.description?.message!}
          />

          <Button loading={isLoading} disabled={isLoading}>
            Submit
          </Button>
        </>
      )}
    </Form>
  );
};

export default ContactForm;

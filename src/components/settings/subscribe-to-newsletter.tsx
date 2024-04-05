import SubscriptionForm from '@/components/settings/subscription-form';


type SubscribeToNewsletterProps = {
  title: string;
  description?: string;
};
export default function SubscribeToNewsletter({
  title,
  description,
}: SubscribeToNewsletterProps) {


  // const {
  //   mutate: subscribe,
  //   isLoading: loading,
  //   isSubscribed,
  // } = useSubscription();

  function onSubmit({ email }: { email: string }) {
    // subscribe({ email });
  }
  return (
    <div className="flex flex-col">
      <h3 className="mt-3 mb-7 text-xl font-semibold text-heading">
        {title}
      </h3>
      <p className="mb-7 text-sm text-heading">{description!}</p>
      <SubscriptionForm
        onSubmit={onSubmit}
        loading={false}
        success={true}
      />
    </div>
  );
}

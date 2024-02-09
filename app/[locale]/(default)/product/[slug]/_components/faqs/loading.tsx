import { Skeleton } from '@bigcommerce/components/skeleton';

const FaqsLoading = () => {
  return (
    <div>
      <Skeleton className="my-4 h-16" />
      <Skeleton className="my-4 h-16" />
      <Skeleton className="my-4 h-16" />
    </div>
  );
};

export default FaqsLoading;

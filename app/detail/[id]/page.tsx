import DetailBookPage from './DetailBookClient';

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  return <DetailBookPage id={params.id} />;
}


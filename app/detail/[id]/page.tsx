import DetailBookPage from './DetailBookClient';

export default function Page({ params }: { params: { id: string } }) {
  return <DetailBookPage id={params.id} />;
}

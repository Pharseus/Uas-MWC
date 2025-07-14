import EditBookClient from './EditBookClient';

export default function Page({ params }: { params: { id: string } }) {
  return <EditBookClient id={params.id} />;
}

import dynamic from 'next/dynamic';

const CreateLocationPicker = dynamic(() => import('./CreateLocationPicker'), {
  ssr: false,
  loading: () => <div className="p-4 text-center">Cargando mapa...</div>
});

export default CreateLocationPicker;

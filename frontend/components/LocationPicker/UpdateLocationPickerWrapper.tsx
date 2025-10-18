import dynamic from 'next/dynamic';

const UpdateLocationPicker = dynamic(() => import('./UpdateLocationPicker'), {
  ssr: false,
  loading: () => <div className="p-4 text-center">Cargando mapa...</div>
});

export default UpdateLocationPicker;

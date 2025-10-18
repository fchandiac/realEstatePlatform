 'use client'
import React from 'react';
import IconButton from '../../IconButton/IconButton';
import { useRouter, useSearchParams } from 'next/navigation';
import type { DataGridColumn } from '../DataGrid';
import { getAlertExcelUrl } from '@/app/actions/alerts';
import { useAlert } from '@/app/hooks/useAlert';

interface ToolbarProps {
  filterMode?: boolean;
  onToggleFilterMode?: () => void;
  // optional columns prop so toolbar can pick first column for sorting
  columns?: DataGridColumn[];
  title?: string;
}

const Toolbar: React.FC<ToolbarProps> = ({ filterMode = false, onToggleFilterMode, columns = [], title = '' }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showAlert } = useAlert();

  // Determine active sortField from URL
  const activeSortField = searchParams.get('sortField');

  // First visible column field
  const firstVisible = columns.find((c) => !c.hide)?.field;

  const handleQuickSort = () => {
    if (!firstVisible) return;
    const params = new URLSearchParams(searchParams.toString());
    if (isSortActive) {
      // If already active, remove sorting params
      params.delete('sort');
      params.delete('sortField');
    } else {
      // Activate sort on first visible column
      params.set('sort', 'asc');
      params.set('sortField', firstVisible);
      params.set('page', '1');
    }
    router.replace(`?${params.toString()}`);
  };

  const handleExportExcel = async () => {
    try {
      const sort = searchParams.get('sort') as 'asc' | 'desc' | undefined;
      const sortField = searchParams.get('sortField') || undefined;
      const search = searchParams.get('search') || undefined;
      const filters = searchParams.get('filters') || undefined;
      const filtrationParam = searchParams.get('filtration');
      
      // Use the same filtration logic as the grid - if filtration=true in URL, apply filters
      const shouldApplyFilters = filtrationParam === 'true' && filters;

      console.log('Excel Export Debug:', {
        sort,
        sortField,
        search,
        filters,
        filtrationParam,
        shouldApplyFilters,
        finalParams: {
          fields: 'id,type,status,received_at,assignedUserNames',
          sort,
          sortField,
          search,
          ...(shouldApplyFilters && { filtration: true, filters }),
        }
      });

      const excelUrl = await getAlertExcelUrl({
        fields: 'id,type,status,received_at,assignedUserNames',
        sort,
        sortField,
        search,
        ...(shouldApplyFilters && { filtration: true, filters }),
      });

      console.log('Final Excel URL:', excelUrl);

      // Generate filename with title, underscore, date and time in DD/MM/YYYY-HH:mm:ss format
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const dateStr = `${day}/${month}/${year}-${hours}:${minutes}:${seconds}`;
      const filename = `${title}_${dateStr}.xlsx`;

      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = excelUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show success alert with filename
      showAlert({
        message: `Descarga exitosa: ${filename}`,
        type: 'success',
        duration: 5000
      });
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      // Optionally show a toast or alert to the user
    }
  };

  const isSortActive = activeSortField === firstVisible;

  return (
    <div className="flex justify-end items-center gap-4 py-2" data-test-id="data-grid-toolbar">
      {/* Quick sort button: sets sort=asc and sortField=first visible column */}
        <IconButton
          variant="text"
          title="Ordenar por primer campo (asc)"
          onClick={handleQuickSort}
          icon="sort"
          className={isSortActive ? 'text-primary' : 'text-secondary'}
          style={{ fontSize: 20, width: 20, height: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
        />

     
      
      {/* Material Symbols filter icon - cambia según filterMode */}
      <IconButton
        variant="text"
        title={filterMode ? 'Desactivar filtros' : 'Filtrar'}
        onClick={() => {
          const params = new URLSearchParams(searchParams.toString());
          if (filterMode) {
            // Clear filters when deactivating
            params.delete('filters');
            params.delete('filtration');
            router.replace(`?${params.toString()}`);
          } else {
            // Activate filtration when enabling filter mode
            params.set('filtration', 'true');
            router.replace(`?${params.toString()}`);
          }
          onToggleFilterMode?.();
        }}
        icon={filterMode ? 'filter_alt_off' : 'filter_alt'}
        className="text-secondary"
        style={{ fontSize: 20, width: 20, height: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
      />
      {/* Excel export icon - using Material Symbol for perfect alignment */}
      <IconButton
        variant="text"
        title="Exportar a Excel"
        onClick={handleExportExcel}
        icon="file_download"
        className="text-secondary"
        style={{ fontSize: 20, width: 20, height: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
      />
    </div>
  );
};

export default Toolbar;

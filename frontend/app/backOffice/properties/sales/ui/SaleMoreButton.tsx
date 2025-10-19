import React, { useState } from 'react';
import IconButton from '@/components/IconButton/IconButton';
import FullPropertyDialog from '../../ui/FullPropertyDialog';

interface SaleMoreButtonProps {
  property: any;
}

const SaleMoreButton: React.FC<SaleMoreButtonProps> = ({ property }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton
        icon="more_vert"
        variant="text"
        ariaLabel="Ver más detalles"
        onClick={() => setOpen(true)}
        data-test-id="sale-more-btn"
      />
      {open && (
        <FullPropertyDialog
          property={property}
          open={open}
          onClose={() => setOpen(false)}
          onSave={async () => setOpen(false)}
        />
      )}
    </>
  );
};

export default SaleMoreButton;

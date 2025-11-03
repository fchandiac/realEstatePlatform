import React, { useState } from 'react';
import IconButton from '@/components/IconButton/IconButton';
import FullProperty from '../../ui/FullProperty';
import Dialog from '@/components/Dialog/Dialog';

interface SaleMoreButtonProps {
  property: any;
}

const SaleMoreButton: React.FC<SaleMoreButtonProps> = ({ property }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex-shrink-0 w-fit">
      <IconButton
        icon="more_horiz"
        variant="text"
        ariaLabel="Ver más detalles"
        onClick={() => setOpen(true)}
        data-test-id="sale-more-btn"
        style={{
          minWidth: 32,
          minHeight: 32,
          width: 32,
          height: 32,
          padding: 4
        }}
      />
      {open && (
        <Dialog 
          open={open} 
          onClose={() => setOpen(false)} 
          title="Detalles de la Propiedad" 
          size="custom"
          maxWidth="1400px"
          height="700px"
          maxHeight="90vh"
        >
            <FullProperty propertyId={property.id} />
        </Dialog>
      )}
    </div>
  );
};

export default SaleMoreButton;

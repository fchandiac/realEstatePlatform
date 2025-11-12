import React, { useState, useCallback } from 'react';
import IconButton from '@/components/IconButton/IconButton';
import Dialog from '@/components/Dialog/Dialog';
import FullProperty from '../../ui/fullProperty/FullProperty';

interface SaleMoreButtonProps {
  property: any;
}

const SaleMoreButton: React.FC<SaleMoreButtonProps> = ({ property }) => {
  const [openDialogs, setOpenDialogs] = useState<Record<string, boolean>>({});

  const isOpen = openDialogs[property.id] || false;

  const handleOpen = useCallback(() => {
    setOpenDialogs(prev => ({
      ...prev,
      [property.id]: true
    }));
  }, [property.id]);

  const handleClose = useCallback(() => {
    setOpenDialogs(prev => ({
      ...prev,
      [property.id]: false
    }));
  }, [property.id]);

  return (
    <div className="flex-shrink-0 w-fit">
      <IconButton
        icon="more_horiz"
        variant="text"
        ariaLabel="Ver más detalles"
        onClick={handleOpen}
        data-test-id="sale-more-btn"
        style={{
          minWidth: 32,
          minHeight: 32,
          width: 32,
          height: 32,
          padding: 4
        }}
      />
      <Dialog
        open={isOpen}
        onClose={handleClose}
        size="custom"
        maxWidth="95vw"
        fullWidth={false}
        title="Detalles de la Propiedad"
        showCloseButton={true}
        scroll="paper"
        maxHeight="90vh"
      >
        <FullProperty
          propertyId={property.id}
        />
      </Dialog>
    </div>
  );
};

export default SaleMoreButton;
